import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import {
  CreateObjectiveDto,
  UpdateObjectiveDto,
  UpdateStatusDto,
  ShareDepartmentDto,
} from './dto/objective.dto';
import { ObjectiveStatus } from '@cinema-app/shared';

@Injectable()
export class ObjectivesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  // ─── CRUD ───

  async create(departmentId: string, userId: string, dto: CreateObjectiveDto) {
    const dept = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!dept) throw new NotFoundException('Department not found');
    await this.assertProjectMember(dept.projectId, userId);

    // If a template is specified, pull whatIsNormallyDone from it
    let whatIsNormallyDone: string | undefined;
    if (dto.templateId) {
      const template = await this.prisma.template.findUnique({
        where: { id: dto.templateId },
      });
      if (template) {
        whatIsNormallyDone = template.content;
      }
    }

    const objective = await this.prisma.objective.create({
      data: {
        projectId: dept.projectId,
        primaryDeptId: departmentId,
        templateId: dto.templateId,
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        phase: dto.phase,
        sceneOrLocation: dto.sceneOrLocation,
        whatIsNormallyDone,
        createdById: userId,
      },
    });

    // Add to shared departments if specified
    if (dto.sharedDepartmentIds?.length) {
      await this.prisma.objectiveDepartment.createMany({
        data: dto.sharedDepartmentIds.map((dId) => ({
          objectiveId: objective.id,
          departmentId: dId,
        })),
      });
    }

    return this.findById(objective.id);
  }

  async findByDepartment(departmentId: string, userId: string) {
    const dept = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!dept) throw new NotFoundException('Department not found');
    await this.assertProjectMember(dept.projectId, userId);

    // Primary objectives + shared objectives for this department
    const [primary, shared] = await Promise.all([
      this.prisma.objective.findMany({
        where: { primaryDeptId: departmentId },
        include: this.objectiveListIncludes(),
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.objectiveDepartment.findMany({
        where: { departmentId },
        include: {
          objective: { include: this.objectiveListIncludes() },
        },
      }),
    ]);

    const sharedObjectives = shared.map((s) => s.objective);
    const allIds = new Set(primary.map((o) => o.id));
    const merged = [...primary];
    for (const obj of sharedObjectives) {
      if (!allIds.has(obj.id)) {
        merged.push(obj);
      }
    }

    return merged.map((o) => this.formatObjectiveSummary(o));
  }

  async findById(objectiveId: string) {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: {
        primaryDept: { select: { id: true, name: true } },
        departments: {
          include: { department: { select: { id: true, name: true } } },
        },
        collaborators: {
          include: {
            user: { select: { id: true, displayName: true, avatarUrl: true } },
          },
        },
        decisions: {
          include: {
            createdBy: { select: { displayName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        links: { orderBy: { updatedAt: 'desc' } },
        template: { select: { name: true, checklist: true } },
      },
    });

    if (!objective) throw new NotFoundException('Objective not found');
    return objective;
  }

  async update(objectiveId: string, userId: string, dto: UpdateObjectiveDto) {
    const obj = await this.findOrFail(objectiveId);
    await this.assertProjectMember(obj.projectId, userId);

    return this.prisma.objective.update({
      where: { id: objectiveId },
      data: {
        ...dto,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      },
    });
  }

  async remove(objectiveId: string, userId: string) {
    const obj = await this.findOrFail(objectiveId);
    await this.assertProjectMember(obj.projectId, userId);
    await this.prisma.objective.delete({ where: { id: objectiveId } });
  }

  // ─── Status Transitions ───

  async updateStatus(objectiveId: string, userId: string, dto: UpdateStatusDto) {
    const obj = await this.findOrFail(objectiveId);
    await this.assertProjectMember(obj.projectId, userId);

    this.validateStatusTransition(obj.status as ObjectiveStatus, dto.status);

    // Auto-add user as active collaborator when marking IN_PROGRESS
    if (dto.status === ObjectiveStatus.IN_PROGRESS) {
      await this.prisma.objectiveCollaborator.upsert({
        where: { objectiveId_userId: { objectiveId, userId } },
        update: { isActive: true },
        create: { objectiveId, userId, isActive: true },
      });
    }

    const updated = await this.prisma.objective.update({
      where: { id: objectiveId },
      data: { status: dto.status },
    });

    // Broadcast status change
    this.realtime.emitObjectiveStatusChanged(obj.projectId, {
      objectiveId,
      newStatus: dto.status,
      userId,
      departmentId: obj.primaryDeptId,
    });

    return updated;
  }

  private validateStatusTransition(current: ObjectiveStatus, next: ObjectiveStatus) {
    const allowed: Record<ObjectiveStatus, ObjectiveStatus[]> = {
      [ObjectiveStatus.NOT_STARTED]: [ObjectiveStatus.IN_PROGRESS],
      [ObjectiveStatus.IN_PROGRESS]: [ObjectiveStatus.COMPLETED],
      [ObjectiveStatus.COMPLETED]: [ObjectiveStatus.IN_PROGRESS],
    };

    if (!allowed[current].includes(next)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${next}`,
      );
    }
  }

  // ─── Collaborators ───

  async joinObjective(objectiveId: string, userId: string) {
    const obj = await this.findOrFail(objectiveId);
    await this.assertProjectMember(obj.projectId, userId);

    return this.prisma.objectiveCollaborator.upsert({
      where: { objectiveId_userId: { objectiveId, userId } },
      update: { isActive: true },
      create: { objectiveId, userId, isActive: true },
    });
  }

  async leaveObjective(objectiveId: string, userId: string) {
    await this.prisma.objectiveCollaborator.updateMany({
      where: { objectiveId, userId },
      data: { isActive: false },
    });
  }

  // ─── Cross-Department Sharing ───

  async shareToDepartments(objectiveId: string, userId: string, dto: ShareDepartmentDto) {
    const obj = await this.findOrFail(objectiveId);
    await this.assertProjectMember(obj.projectId, userId);

    await this.prisma.objectiveDepartment.createMany({
      data: dto.departmentIds.map((dId) => ({
        objectiveId,
        departmentId: dId,
      })),
      skipDuplicates: true,
    });

    return this.findById(objectiveId);
  }

  async unshareDepartment(objectiveId: string, departmentId: string, userId: string) {
    const obj = await this.findOrFail(objectiveId);
    await this.assertProjectMember(obj.projectId, userId);

    if (obj.primaryDeptId === departmentId) {
      throw new BadRequestException('Cannot remove primary department');
    }

    await this.prisma.objectiveDepartment.delete({
      where: { objectiveId_departmentId: { objectiveId, departmentId } },
    });
  }

  // ─── Decisions ───

  async addDecision(objectiveId: string, userId: string, content: string) {
    await this.findOrFail(objectiveId);
    const decision = await this.prisma.decision.create({
      data: { objectiveId, content, createdById: userId },
      include: {
        createdBy: { select: { displayName: true, avatarUrl: true } },
      },
    });

    this.realtime.emitDecisionCreated(objectiveId, decision as unknown as Record<string, unknown>);
    return decision;
  }

  async getDecisions(objectiveId: string) {
    return this.prisma.decision.findMany({
      where: { objectiveId },
      include: {
        createdBy: { select: { displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Links ───

  async addLink(objectiveId: string, data: { url: string; description?: string; authorName: string }) {
    await this.findOrFail(objectiveId);
    return this.prisma.link.create({
      data: { objectiveId, ...data },
    });
  }

  async getLinks(objectiveId: string) {
    return this.prisma.link.findMany({
      where: { objectiveId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async removeLink(linkId: string) {
    await this.prisma.link.delete({ where: { id: linkId } });
  }

  // ─── Helpers ───

  private async findOrFail(objectiveId: string) {
    const obj = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
    });
    if (!obj) throw new NotFoundException('Objective not found');
    return obj;
  }

  private async assertProjectMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a project member');
    return member;
  }

  private objectiveListIncludes() {
    return {
      primaryDept: { select: { id: true, name: true } },
      departments: {
        include: { department: { select: { id: true, name: true } } },
      },
      collaborators: {
        where: { isActive: true },
        include: {
          user: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      },
    } as const;
  }

  private formatObjectiveSummary(o: {
    id: string;
    title: string;
    status: string;
    deadline: Date | null;
    primaryDept: { id: string; name: string };
    departments: { department: { id: string; name: string } }[];
    collaborators: { user: { id: string; displayName: string | null; avatarUrl: string | null } }[];
    createdAt: Date;
  }) {
    return {
      id: o.id,
      title: o.title,
      status: o.status,
      deadline: o.deadline?.toISOString() ?? null,
      primaryDeptId: o.primaryDept.id,
      departmentNames: [
        o.primaryDept.name,
        ...o.departments.map((d) => d.department.name),
      ],
      collaborators: o.collaborators.map((c) => ({
        userId: c.user.id,
        displayName: c.user.displayName ?? 'Anónimo',
        avatarUrl: c.user.avatarUrl,
        isActive: true,
      })),
      createdAt: o.createdAt.toISOString(),
    };
  }
}
