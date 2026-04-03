import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationType } from '@cinema-app/shared';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async findByUser(userId: string, onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(onlyUnread ? { read: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async create(data: {
    userId: string;
    type: NotificationType;
    referenceId: string;
    referenceType: string;
  }) {
    const notification = await this.prisma.notification.create({ data });

    // Push real-time notification to the user
    this.realtime.emitToUser(data.userId, 'notification:new', notification);

    return notification;
  }
}
