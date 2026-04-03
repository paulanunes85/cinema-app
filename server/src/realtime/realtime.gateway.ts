import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  projectId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('RealtimeGateway');
  private onlineUsers = new Map<string, Set<string>>(); // projectId → Set<userId>

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Connection Lifecycle ───

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ??
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      client.userId = payload.sub;
      this.logger.log(`Client connected: ${client.userId}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId && client.projectId) {
      // Remove from online users
      const users = this.onlineUsers.get(client.projectId);
      if (users) {
        users.delete(client.userId);
        if (users.size === 0) this.onlineUsers.delete(client.projectId);
      }

      // Notify project room
      this.server.to(`project:${client.projectId}`).emit('user:offline', {
        userId: client.userId,
      });
    }
    this.logger.log(`Client disconnected: ${client.userId ?? 'unknown'}`);
  }

  // ─── Room Management ───

  @SubscribeMessage('join:project')
  handleJoinProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    if (!client.userId) return;

    client.projectId = data.projectId;
    client.join(`project:${data.projectId}`);

    // Track online user
    if (!this.onlineUsers.has(data.projectId)) {
      this.onlineUsers.set(data.projectId, new Set());
    }
    this.onlineUsers.get(data.projectId)!.add(client.userId);

    // Notify others
    this.server.to(`project:${data.projectId}`).emit('user:online', {
      userId: client.userId,
    });

    // Send current online users to the joining client
    client.emit('users:online', {
      userIds: Array.from(this.onlineUsers.get(data.projectId) ?? []),
    });
  }

  @SubscribeMessage('join:objective')
  handleJoinObjective(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { objectiveId: string },
  ) {
    client.join(`objective:${data.objectiveId}`);
  }

  @SubscribeMessage('leave:objective')
  handleLeaveObjective(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { objectiveId: string },
  ) {
    client.leave(`objective:${data.objectiveId}`);
  }

  // ─── Broadcast Methods (called by services) ───

  emitObjectiveStatusChanged(projectId: string, data: {
    objectiveId: string;
    newStatus: string;
    userId: string;
    departmentId: string;
  }) {
    this.server.to(`project:${projectId}`).emit('objective:statusChanged', data);
  }

  emitCollaboratorUpdate(objectiveId: string, data: {
    objectiveId: string;
    userId: string;
    displayName: string;
    avatarUrl: string | null;
    action: 'joined' | 'left';
  }) {
    this.server.to(`objective:${objectiveId}`).emit('objective:collaboratorUpdate', data);
    // Also notify project room for checklist updates
    this.server.to(`project:*`).emit('objective:collaboratorUpdate', data);
  }

  emitCommentCreated(objectiveId: string, comment: Record<string, unknown>) {
    this.server.to(`objective:${objectiveId}`).emit('comment:created', comment);
  }

  emitDecisionCreated(objectiveId: string, decision: Record<string, unknown>) {
    this.server.to(`objective:${objectiveId}`).emit('decision:created', decision);
  }

  emitToUser(userId: string, event: string, data: unknown) {
    // Find all sockets for this user and emit directly
    const sockets = this.server.sockets.sockets;
    for (const [, socket] of sockets) {
      if ((socket as AuthenticatedSocket).userId === userId) {
        socket.emit(event, data);
      }
    }
  }

  getOnlineUsers(projectId: string): string[] {
    return Array.from(this.onlineUsers.get(projectId) ?? []);
  }
}
