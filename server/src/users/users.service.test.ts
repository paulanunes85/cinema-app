import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: { user: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> } };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', email: 'test@test.com', displayName: 'Test' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null when not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('completeOnboarding', () => {
    it('should update user and set isOnboarded to true', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', isOnboarded: false });
      prisma.user.update.mockResolvedValue({ id: '1', displayName: 'Sofia', isOnboarded: true });

      const result = await service.completeOnboarding('1', { displayName: 'Sofia' });
      expect(result.isOnboarded).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { displayName: 'Sofia', isOnboarded: true },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.completeOnboarding('bad', { displayName: 'X' })).rejects.toThrow('User not found');
    });
  });
});
