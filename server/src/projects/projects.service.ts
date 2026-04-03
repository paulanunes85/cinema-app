import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Role, ProjectStatus, ObjectiveStatus, SUPERVISOR_ROLES } from '@cinema-app/shared';
import { DEFAULT_DEPARTMENTS } from '@cinema-app/shared';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.$transaction(async (tx) => {
      // Create project
      const project = await tx.project.create({
        data: {
          name: dto.name,
          description: dto.description,
          createdById: userId,
        },
      });

      // Add creator as member with DIRECTOR role
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId,
          roles: [Role.DIRECTOR],
        },
      });

      // Create default departments
      for (const dept of DEFAULT_DEPARTMENTS) {
        await tx.department.create({
          data: {
            projectId: project.id,
            name: dept.name,
            icon: dept.icon,
            color: dept.color,
            order: dept.order,
            isCustom: false,
          },
        });
      }

      // Create custom departments if provided
      if (dto.customDepartments) {
        for (let i = 0; i < dto.customDepartments.length; i++) {
          const custom = dto.customDepartments[i];
          await tx.department.create({
            data: {
              projectId: project.id,
              name: custom.name,
              icon: custom.icon,
              color: custom.color,
              order: DEFAULT_DEPARTMENTS.length + i,
              isCustom: true,
            },
          });
        }
      }

      return this.findById(project.id, userId);
    });
  }

  async findAllForUser(userId: string) {
    const memberships = await this.prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            _count: { select: { members: true } },
            departments: {
              include: {
                _count: { select: { primaryObjectives: true } },
                primaryObjectives: {
                  where: { status: 'COMPLETED' },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
      orderBy: { project: { createdAt: 'desc' } },
    });

    return memberships.map((m) => {
      const p = m.project;
      const totalObjectives = p.departments.reduce(
        (sum, d) => sum + d._count.primaryObjectives,
        0,
      );
      const completedObjectives = p.departments.reduce(
        (sum, d) => sum + d.primaryObjectives.length,
        0,
      );
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        memberCount: p._count.members,
        overallProgress: totalObjectives > 0
          ? Math.round((completedObjectives / totalObjectives) * 100)
          : 0,
        createdAt: p.createdAt.toISOString(),
        myRoles: m.roles,
      };
    });
  }

  async findById(projectId: string, userId: string) {
    await this.assertMember(projectId, userId);

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        departments: { orderBy: { order: 'asc' } },
        _count: { select: { members: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(projectId: string, userId: string, dto: UpdateProjectDto) {
    await this.assertMember(projectId, userId);

    return this.prisma.project.update({
      where: { id: projectId },
      data: dto,
    });
  }

  async archive(projectId: string, userId: string) {
    await this.assertMember(projectId, userId);

    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.ARCHIVED, archivedAt: new Date() },
    });
  }

  async getMembers(projectId: string, userId: string) {
    await this.assertMember(projectId, userId);

    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: { user: { select: { id: true, displayName: true, avatarUrl: true, email: true } } },
    });
  }

  // ─── Supervision Mode (FR-SM-01 to FR-SM-05) ───

  async getSupervisionDashboard(projectId: string, userId: string) {
    const member = await this.assertMember(projectId, userId);

    const hasSupervisorRole = member.roles.some((r) =>
      SUPERVISOR_ROLES.includes(r as Role),
    );
    if (!hasSupervisorRole) {
      throw new ForbiddenException('Supervision Mode requires Director or AD role');
    }

    const departments = await this.prisma.department.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        primaryObjectives: {
          include: {
            collaborators: {
              where: { isActive: true },
              include: {
                user: { select: { id: true, displayName: true, avatarUrl: true } },
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    const result = departments.map((dept) => {
      const total = dept.primaryObjectives.length;
      const completed = dept.primaryObjectives.filter(
        (o) => o.status === ObjectiveStatus.COMPLETED,
      ).length;
      const inProgress = dept.primaryObjectives.filter(
        (o) => o.status === ObjectiveStatus.IN_PROGRESS,
      ).length;

      return {
        id: dept.id,
        name: dept.name,
        icon: dept.icon,
        color: dept.color,
        progress: {
          total,
          completed,
          inProgress,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
        recentObjectives: dept.primaryObjectives.slice(0, 5).map((o) => ({
          id: o.id,
          title: o.title,
          status: o.status,
          deadline: o.deadline?.toISOString() ?? null,
          collaborators: o.collaborators.map((c) => ({
            displayName: c.user.displayName ?? 'Anónimo',
            avatarUrl: c.user.avatarUrl,
          })),
        })),
      };
    });

    const totalObjectives = result.reduce((s, d) => s + d.progress.total, 0);
    const totalCompleted = result.reduce((s, d) => s + d.progress.completed, 0);

    return {
      departments: result,
      overallProgress: totalObjectives > 0
        ? Math.round((totalCompleted / totalObjectives) * 100)
        : 0,
    };
  }

  private async assertMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this project');
    return member;
  }
}
