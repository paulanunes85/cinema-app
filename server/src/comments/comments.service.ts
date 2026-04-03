import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { ALLOWED_REACTIONS } from '@cinema-app/shared';
import type { ReactionEmoji } from '@cinema-app/shared';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  // ─── Comments ───

  async create(objectiveId: string, userId: string, dto: CreateCommentDto) {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
    });
    if (!objective) throw new NotFoundException('Objective not found');

    // Parse @mentions from content
    const mentionRegex = /@(\S+)/g;
    const mentionNames: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = mentionRegex.exec(dto.content)) !== null) {
      mentionNames.push(match[1]);
    }

    const comment = await this.prisma.comment.create({
      data: {
        objectiveId,
        parentId: dto.parentId,
        content: dto.content,
        createdById: userId,
      },
      include: this.commentIncludes(),
    });

    // Create mentions + notifications
    if (mentionNames.length > 0) {
      const members = await this.prisma.projectMember.findMany({
        where: { projectId: objective.projectId },
        include: { user: { select: { id: true, displayName: true } } },
      });

      for (const name of mentionNames) {
        const member = members.find(
          (m) => m.user.displayName?.toLowerCase() === name.toLowerCase(),
        );
        if (member && member.userId !== userId) {
          await this.prisma.commentMention.create({
            data: { commentId: comment.id, mentionedUserId: member.userId },
          });
          await this.prisma.notification.create({
            data: {
              userId: member.userId,
              type: 'MENTION',
              referenceId: objectiveId,
              referenceType: 'objective',
            },
          });
        }
      }
    }

    // Broadcast to objective room
    this.realtime.emitCommentCreated(objectiveId, comment as unknown as Record<string, unknown>);

    return comment;
  }

  async findByObjective(objectiveId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { objectiveId, parentId: null },
      include: {
        ...this.commentIncludes(),
        replies: {
          include: this.commentIncludes(),
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return comments;
  }

  async update(commentId: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.findOrFail(commentId);
    if (comment.createdById !== userId) {
      throw new ForbiddenException('Can only edit own comments');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content: dto.content },
      include: this.commentIncludes(),
    });
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.findOrFail(commentId);
    if (comment.createdById !== userId) {
      throw new ForbiddenException('Can only delete own comments');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
  }

  // ─── Reactions ───

  async addReaction(commentId: string, userId: string, emoji: string) {
    if (!ALLOWED_REACTIONS.includes(emoji as ReactionEmoji)) {
      throw new BadRequestException(
        `Invalid reaction. Allowed: ${ALLOWED_REACTIONS.join(', ')}`,
      );
    }

    await this.findOrFail(commentId);

    return this.prisma.commentReaction.upsert({
      where: {
        commentId_userId_emoji: { commentId, userId, emoji },
      },
      update: {},
      create: { commentId, userId, emoji },
    });
  }

  async removeReaction(commentId: string, userId: string, emoji: string) {
    await this.prisma.commentReaction.deleteMany({
      where: { commentId, userId, emoji },
    });
  }

  // ─── Helpers ───

  private async findOrFail(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  private commentIncludes() {
    return {
      createdBy: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
      reactions: {
        select: { emoji: true, userId: true },
      },
      mentions: {
        select: { mentionedUserId: true },
      },
    } as const;
  }
}
