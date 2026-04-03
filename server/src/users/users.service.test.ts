import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };
    // @ts-expect-error — injecting mock directly
    service = new UsersService(mockPrisma);
  });

  it('findById returns user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'a@b.com' });
    const result = await service.findById('1');
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('findById returns null when not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    expect(await service.findById('x')).toBeNull();
  });

  it('completeOnboarding sets isOnboarded true', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
    mockPrisma.user.update.mockResolvedValue({ id: '1', displayName: 'Sofia', isOnboarded: true });
    const result = await service.completeOnboarding('1', { displayName: 'Sofia' });
    expect(result.isOnboarded).toBe(true);
  });

  it('completeOnboarding throws if user missing', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.completeOnboarding('bad', { displayName: 'X' })).rejects.toThrow();
  });
});
