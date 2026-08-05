import {
  WorkflowEventEntity,
  WorkflowExecutionEntity,
  WorkflowStepStateEntity,
} from '../entities';
import { WorkflowExecutionPersistenceEngineService } from './workflow-execution-persistence-engine.service';

describe('WorkflowExecutionPersistenceEngineService', () => {
  const executionEntity = new WorkflowExecutionEntity();
  const stepStateEntity = new WorkflowStepStateEntity();
  const eventEntity = new WorkflowEventEntity();

  const executionRecord = executionEntity.create({
    id: 'execution-1',
    workflowId: 'workflow-1',
    status: 'running',
    context: {
      runtimeVersion: 1,
      steps: [],
    },
    startedAt: new Date('2026-08-05T00:00:00.000Z'),
  });

  const checkpointEngine = {
    createCheckpointIfDue: jest.fn(),
    restoreLatestSnapshot: jest.fn(),
  };

  const executionRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const stepStateRepository = {
    findByExecutionAndStep: jest.fn(),
    listByExecutionId: jest.fn(),
    save: jest.fn(),
  };

  const eventRepository = {
    nextSequence: jest.fn(),
    append: jest.fn(),
  };

  let service: WorkflowExecutionPersistenceEngineService;

  beforeEach(() => {
    jest.clearAllMocks();

    executionRepository.findById.mockResolvedValue(null);
    executionRepository.save.mockImplementation(
      async (record: unknown) => record,
    );
    stepStateRepository.findByExecutionAndStep.mockResolvedValue(
      null,
    );
    stepStateRepository.listByExecutionId.mockResolvedValue([]);
    stepStateRepository.save.mockImplementation(
      async (record: unknown) => record,
    );
    eventRepository.nextSequence.mockResolvedValue(1);
    eventRepository.append.mockImplementation(
      async (record: unknown) => record,
    );
    checkpointEngine.createCheckpointIfDue.mockResolvedValue(null);
    checkpointEngine.restoreLatestSnapshot.mockResolvedValue(null);

    service = new WorkflowExecutionPersistenceEngineService(
      executionEntity,
      stepStateEntity,
      eventEntity,
      checkpointEngine as never,
      executionRepository as never,
      stepStateRepository as never,
      eventRepository as never,
    );
  });

  it('persists execution, step states, event and checkpoint policy', async () => {
    const runtime = {
      id: 'execution-1',
      workflowId: 'workflow-1',
      status: 'running' as const,
      maxParallelSteps: 1,
      activeStepIds: ['step-a'],
      createdAt: new Date('2026-08-05T00:00:00.000Z'),
      updatedAt: new Date('2026-08-05T00:01:00.000Z'),
      completedAt: null,
      steps: [
        {
          id: 'step-a',
          name: 'Step A',
          status: 'active' as const,
          dependsOn: [],
          attempt: 1,
          maxAttempts: 1,
          retryDelayMs: 0,
          continueOnFailure: false,
          input: {},
          output: null,
          metadata: {},
          error: null,
          scheduledRetryId: null,
          startedAt: new Date('2026-08-05T00:01:00.000Z'),
          completedAt: null,
          createdAt: new Date('2026-08-05T00:00:00.000Z'),
          updatedAt: new Date('2026-08-05T00:01:00.000Z'),
        },
      ],
    };

    await service.persistTransition(runtime);

    expect(executionRepository.save).toHaveBeenCalledTimes(1);
    expect(stepStateRepository.save).toHaveBeenCalledTimes(1);
    expect(eventRepository.append).toHaveBeenCalledTimes(1);
    expect(
      checkpointEngine.createCheckpointIfDue,
    ).toHaveBeenCalledWith(
      runtime,
      1,
      runtime.updatedAt,
      { force: false },
    );
  });

  it('restores from the latest valid checkpoint after restart', async () => {
    executionRepository.findById.mockResolvedValue({
      ...executionRecord,
      context: {
        runtimeVersion: 1,
        steps: [],
      },
    });

    checkpointEngine.restoreLatestSnapshot.mockResolvedValue({
      snapshotVersion: 1,
      workflowId: 'workflow-1',
      status: 'running',
      maxParallelSteps: 1,
      activeStepIds: [],
      createdAt: '2026-08-05T00:00:00.000Z',
      updatedAt: '2026-08-05T00:01:00.000Z',
      completedAt: null,
      steps: [
        {
          id: 'step-a',
          name: 'Step A',
          status: 'waiting',
          dependsOn: [],
          attempt: 0,
          maxAttempts: 1,
          retryDelayMs: 0,
          continueOnFailure: false,
          input: {},
          output: null,
          metadata: {},
          error: null,
          scheduledRetryId: null,
          startedAt: null,
          completedAt: null,
          createdAt: new Date('2026-08-05T00:00:00.000Z'),
          updatedAt: new Date('2026-08-05T00:00:00.000Z'),
        },
      ],
    });

    stepStateRepository.listByExecutionId.mockResolvedValue([
      stepStateEntity.create({
        id: 'execution-1:step-a',
        executionId: 'execution-1',
        stepId: 'step-a',
        status: 'ready',
      }),
    ]);

    await expect(
      service.restoreExecution('execution-1'),
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'execution-1',
        steps: [
          expect.objectContaining({
            id: 'step-a',
            status: 'ready',
          }),
        ],
      }),
    );
  });

  it('falls back to persisted runtime context when checkpoints are corrupted', async () => {
    executionRepository.findById.mockResolvedValue({
      ...executionRecord,
      context: {
        runtimeVersion: 1,
        steps: [
          {
            id: 'step-a',
            name: 'Step A',
            status: 'waiting',
            dependsOn: [],
            attempt: 0,
            maxAttempts: 1,
            retryDelayMs: 0,
            continueOnFailure: false,
            input: {},
            output: null,
            metadata: {},
            error: null,
            scheduledRetryId: null,
            startedAt: null,
            completedAt: null,
            createdAt: new Date('2026-08-05T00:00:00.000Z'),
            updatedAt: new Date('2026-08-05T00:00:00.000Z'),
          },
        ],
      },
    });

    checkpointEngine.restoreLatestSnapshot.mockResolvedValue(null);
    stepStateRepository.listByExecutionId.mockResolvedValue([]);

    await expect(
      service.restoreExecution('execution-1'),
    ).resolves.toEqual(
      expect.objectContaining({
        steps: [
          expect.objectContaining({
            id: 'step-a',
          }),
        ],
      }),
    );
  });

  it('propagates checkpoint failures through flush', async () => {
    checkpointEngine.createCheckpointIfDue.mockRejectedValue(
      new Error('checkpoint write failed'),
    );

    const runtime = {
      id: 'execution-1',
      workflowId: 'workflow-1',
      status: 'running' as const,
      maxParallelSteps: 1,
      activeStepIds: [],
      steps: [],
      createdAt: new Date('2026-08-05T00:00:00.000Z'),
      updatedAt: new Date('2026-08-05T00:01:00.000Z'),
      completedAt: null,
    };

    service.enqueueTransition(runtime);

    await expect(
      service.flush('execution-1'),
    ).rejects.toThrow('checkpoint write failed');
  });
});
