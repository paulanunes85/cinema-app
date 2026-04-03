import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { ObjectiveStatus } from '@cinema-app/shared';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string, userId: string) {
    await this.assertProjectMember(projectId, userId);

    const departments = await this.prisma.department.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        primaryObjectives: {
          select: { id: true, status: true },
        },
      },
    });

    return departments.map((dept) => {
      const total = dept.primaryObjectives.length;
      const completed = dept.primaryObjectives.filter(
        (o) => o.status === ObjectiveStatus.COMPLETED,
      ).length;

      return {
        id: dept.id,
        name: dept.name,
        icon: dept.icon,
        color: dept.color,
        isCustom: dept.isCustom,
        order: dept.order,
        progress: {
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      };
    });
  }

  async getProgress(departmentId: string) {
    const objectives = await this.prisma.objective.findMany({
      where: { primaryDeptId: departmentId },
      select: { status: true },
    });

    const total = objectives.length;
    const completed = objectives.filter(
      (o) => o.status === ObjectiveStatus.COMPLETED,
    ).length;

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  async create(projectId: string, userId: string, dto: CreateDepartmentDto) {
    await this.assertProjectMember(projectId, userId);

    const maxOrder = await this.prisma.department.aggregate({
      where: { projectId },
      _max: { order: true },
    });

    return this.prisma.department.create({
      data: {
        projectId,
        name: dto.name,
        icon: dto.icon,
        color: dto.color,
        isCustom: true,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });
  }

  async update(departmentId: string, userId: string, dto: UpdateDepartmentDto) {
    const dept = await this.findOrFail(departmentId);
    await this.assertProjectMember(dept.projectId, userId);

    return this.prisma.department.update({
      where: { id: departmentId },
      data: dto,
    });
  }

  async remove(departmentId: string, userId: string) {
    const dept = await this.findOrFail(departmentId);
    await this.assertProjectMember(dept.projectId, userId);

    if (!dept.isCustom) {
      throw new BadRequestException('Cannot delete default departments');
    }

    await this.prisma.department.delete({ where: { id: departmentId } });
  }

  private async findOrFail(departmentId: string) {
    const dept = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  private async assertProjectMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this project');
    return member;
  }
}
