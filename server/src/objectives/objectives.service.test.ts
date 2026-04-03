import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ObjectivesService } from './objectives.service';
import { ObjectiveStatus } from '@cinema-app/shared';

describe('ObjectivesService', () => {
  let service: ObjectivesService;
  let mockPrisma: any;
  let mockRealtime: any;

  beforeEach(() => {
    mockPrisma = {
      objective: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
      objectiveCollaborator: { upsert: vi.fn(), updateMany: vi.fn() },
      objectiveDepartment: { createMany: vi.fn(), delete: vi.fn() },
      projectMember: { findUnique: vi.fn() },
      department: { findUnique: vi.fn() },
      decision: { create: vi.fn(), findMany: vi.fn() },
      link: { create: vi.fn(), findMany: vi.fn(), delete: vi.fn() },
      template: { findUnique: vi.fn() },
    };
    mockRealtime = {
      emitObjectiveStatusChanged: vi.fn(),
      emitDecisionCreated: vi.fn(),
    };
    // @ts-expect-error — injecting mocks directly
    service = new ObjectivesService(mockPrisma, mockRealtime);
  });

  it('allows NOT_STARTED -> IN_PROGRESS', async () => {
    mockPrisma.objective.findUnique.mockResolvedValue({ id: 'o1', projectId: 'p1', primaryDeptId: 'd1', status: ObjectiveStatus.NOT_STARTED });
    mockPrisma.projectMember.findUnique.mockResolvedValue({ id: 'm1' });
    mockPrisma.objectiveCollaborator.upsert.mockResolvedValue({});
    mockPrisma.objective.update.mockResolvedValue({ id: 'o1', status: ObjectiveStatus.IN_PROGRESS });

    const result = await service.updateStatus('o1', 'u1', { status: ObjectiveStatus.IN_PROGRESS });
    expect(result.status).toBe(ObjectiveStatus.IN_PROGRESS);
    expect(mockRealtime.emitObjectiveStatusChanged).toHaveBeenCalled();
  });

  it('rejects NOT_STARTED -> COMPLETED', async () => {
    mockPrisma.objective.findUnique.mockResolvedValue({ id: 'o1', projectId: 'p1', primaryDeptId: 'd1', status: ObjectiveStatus.NOT_STARTED });
    mockPrisma.projectMember.findUnique.mockResolvedValue({ id: 'm1' });

    await expect(service.updateStatus('o1', 'u1', { status: ObjectiveStatus.COMPLETED })).rejects.toThrow('Cannot transition');
  });

  it('throws if not project member', async () => {
    mockPrisma.objective.findUnique.mockResolvedValue({ id: 'o1', projectId: 'p1', primaryDeptId: 'd1', status: ObjectiveStatus.NOT_STARTED });
    mockPrisma.projectMember.findUnique.mockResolvedValue(null);

    await expect(service.updateStatus('o1', 'u1', { status: ObjectiveStatus.IN_PROGRESS })).rejects.toThrow();
  });

  it('addDecision creates and broadcasts', async () => {
    mockPrisma.objective.findUnique.mockResolvedValue({ id: 'o1' });
    const decision = { id: 'd1', content: 'Test', createdBy: { displayName: 'Sofia' } };
    mockPrisma.decision.create.mockResolvedValue(decision);

    const result = await service.addDecision('o1', 'u1', 'Test');
    expect(result).toEqual(decision);
    expect(mockRealtime.emitDecisionCreated).toHaveBeenCalledWith('o1', expect.anything());
  });
});
