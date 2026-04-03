import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { SUPERVISOR_ROLES, Role } from '@cinema-app/shared';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string | null) {
    // Return system templates + project-specific templates
    const where = projectId
      ? { OR: [{ isSystem: true }, { projectId }] }
      : { isSystem: true };

    return this.prisma.template.findMany({
      where,
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
  }

  async findById(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async create(projectId: string, userId: string, dto: CreateTemplateDto) {
    await this.assertSupervisor(projectId, userId);

    return this.prisma.template.create({
      data: {
        projectId,
        name: dto.name,
        objectiveType: dto.objectiveType,
        content: dto.content,
        checklist: dto.checklist ?? Prisma.JsonNull,
        isSystem: false,
      },
    });
  }

  async update(templateId: string, userId: string, dto: UpdateTemplateDto) {
    const template = await this.findById(templateId);

    if (template.isSystem) {
      throw new BadRequestException('Cannot edit system templates');
    }

    if (template.projectId) {
      await this.assertSupervisor(template.projectId, userId);
    }

    return this.prisma.template.update({
      where: { id: templateId },
      data: dto,
    });
  }

  async remove(templateId: string, userId: string) {
    const template = await this.findById(templateId);

    if (template.isSystem) {
      throw new BadRequestException('Cannot delete system templates');
    }

    if (template.projectId) {
      await this.assertSupervisor(template.projectId, userId);
    }

    await this.prisma.template.delete({ where: { id: templateId } });
  }

  private async assertSupervisor(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) throw new ForbiddenException('Not a project member');

    const hasSupervisorRole = member.roles.some((r) =>
      SUPERVISOR_ROLES.includes(r as Role),
    );

    if (!hasSupervisorRole) {
      throw new ForbiddenException('Only Director or AD can manage templates');
    }
  }
}
