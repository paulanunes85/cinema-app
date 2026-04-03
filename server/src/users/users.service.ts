import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthProvider } from '@cinema-app/shared';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    authProvider: AuthProvider;
  }) {
    return this.prisma.user.create({ data });
  }

  async completeOnboarding(
    userId: string,
    data: { displayName: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: data.displayName,
        isOnboarded: true,
      },
    });
  }

  async updateProfile(userId: string, data: { displayName?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
