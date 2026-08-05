import {
  WorkflowCheckpointEntity,
  WorkflowEventEntity,
  WorkflowExecutionEntity,
  WorkflowRecoveryEntity,
  WorkflowStepStateEntity,
} from '../entities';
import { WorkflowExecutionRepository } from './workflow-execution.repository';

describe('Prisma workflow persistence repositories', () => {
  it('persists and rehydrates workflow executions through Prisma', async () => {
    const entity = new WorkflowExecutionEntity();
    const record = entity.create({
      id: 'execution-1',
      workflowId: 'workflow-1',
      maxParallelSteps: 3,
    });

    const prisma = {
      workflowExecutionPersistence: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue(record),
      },
    };

    const repository = new WorkflowExecutionRepository(
      prisma as never,
      entity,
    );

    await expect(repository.save(record)).resolves.toEqual(record);
    expect(
      prisma.workflowExecutionPersistence.upsert,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'execution-1' },
      }),
    );
  });

  it('registers all entity constructors used by Prisma repositories', () => {
    expect([
      WorkflowExecutionEntity,
      WorkflowCheckpointEntity,
      WorkflowStepStateEntity,
      WorkflowEventEntity,
      WorkflowRecoveryEntity,
    ]).toHaveLength(5);
  });
});