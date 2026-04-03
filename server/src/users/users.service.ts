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
    return this.prisma.user.create({
      data: { ...data, emailVerified: data.authProvider !== AuthProvider.EMAIL },
    });
  }

  async createEmailUser(data: {
    email: string;
    displayName: string;
    passwordHash: string;
    verifyToken: string;
    verifyTokenExp: Date;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        passwordHash: data.passwordHash,
        authProvider: AuthProvider.EMAIL,
        emailVerified: false,
        verifyToken: data.verifyToken,
        verifyTokenExp: data.verifyTokenExp,
      },
    });
  }

  async findByVerifyToken(token: string) {
    return this.prisma.user.findUnique({ where: { verifyToken: token } });
  }

  async markEmailVerified(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExp: null,
        isOnboarded: true,
      },
    });
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
