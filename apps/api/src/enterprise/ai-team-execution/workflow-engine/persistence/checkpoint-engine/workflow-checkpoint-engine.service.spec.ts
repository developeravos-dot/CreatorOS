import {
  WorkflowCheckpointEntity,
  WorkflowCheckpointPersistenceRecord,
} from '../entities';
import {
  WorkflowCheckpointEngineService,
  WorkflowCheckpointSnapshot,
} from './workflow-checkpoint-engine.service';

describe('WorkflowCheckpointEngineService', () => {
  const checkpointEntity = new WorkflowCheckpointEntity();

  const runtime = {
    id: 'execution-1',
    workflowId: 'workflow-1',
    status: 'running' as const,
    maxParallelSteps: 2,
    activeStepIds: [],
    steps: [],
    createdAt: new Date('2026-08-05T00:00:00.000Z'),
    updatedAt: new Date('2026-08-05T00:01:00.000Z'),
    completedAt: null,
  };

  const repository = {
    listByExecutionId: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository.listByExecutionId.mockResolvedValue([]);
    repository.save.mockImplementation(
      async (record: WorkflowCheckpointPersistenceRecord) =>
        record,
    );
  });

  function createService(
    policy: {
      transitionInterval?: number;
      timeIntervalMs?: number;
      createInitialCheckpoint?: boolean;
    } = {},
  ): WorkflowCheckpointEngineService {
    return new WorkflowCheckpointEngineService(
      checkpointEntity,
      repository as never,
      policy,
    );
  }

  it('creates the initial checkpoint', async () => {
    const service = createService();

    const checkpoint =
      await service.createCheckpointIfDue(
        runtime,
        1,
        runtime.updatedAt,
      );

    expect(checkpoint).not.toBeNull();
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(checkpoint?.checksum).toMatch(/^sha256:/);
  });

  it('creates a checkpoint after the transition threshold', async () => {
    const service = createService({
      transitionInterval: 3,
      timeIntervalMs: 999_999,
    });

    const previousState = {
      snapshotVersion: 1,
      workflowId: runtime.workflowId,
      status: runtime.status,
      maxParallelSteps: runtime.maxParallelSteps,
      activeStepIds: runtime.activeStepIds,
      steps: runtime.steps,
      createdAt: runtime.createdAt.toISOString(),
      updatedAt: '2026-08-05T00:00:00.000Z',
      completedAt: null,
    };

    repository.listByExecutionId.mockResolvedValue([
      checkpointEntity.create({
        id: 'checkpoint-1',
        executionId: runtime.id,
        sequence: 2,
        state: previousState,
        checksum: service.checksum(previousState),
        createdAt: new Date('2026-08-05T00:00:00.000Z'),
      }),
    ]);

    await service.createCheckpointIfDue(
      {
        ...runtime,
        updatedAt: new Date('2026-08-05T00:02:00.000Z'),
      },
      5,
      new Date('2026-08-05T00:02:00.000Z'),
    );

    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('creates a checkpoint after the time threshold', async () => {
    const service = createService({
      transitionInterval: 100,
      timeIntervalMs: 60_000,
    });

    const previousState = {
      snapshotVersion: 1,
      workflowId: runtime.workflowId,
      status: runtime.status,
      maxParallelSteps: runtime.maxParallelSteps,
      activeStepIds: runtime.activeStepIds,
      steps: runtime.steps,
      createdAt: runtime.createdAt.toISOString(),
      updatedAt: '2026-08-05T00:00:00.000Z',
      completedAt: null,
    };

    repository.listByExecutionId.mockResolvedValue([
      checkpointEntity.create({
        id: 'checkpoint-1',
        executionId: runtime.id,
        sequence: 1,
        state: previousState,
        checksum: service.checksum(previousState),
        createdAt: new Date('2026-08-05T00:00:00.000Z'),
      }),
    ]);

    await service.createCheckpointIfDue(
      {
        ...runtime,
        updatedAt: new Date('2026-08-05T00:02:00.000Z'),
      },
      2,
      new Date('2026-08-05T00:02:00.000Z'),
    );

    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('does not persist duplicate snapshots', async () => {
    const service = createService();

    const state: WorkflowCheckpointSnapshot = {
      snapshotVersion: 1,
      workflowId: runtime.workflowId,
      status: runtime.status,
      maxParallelSteps: runtime.maxParallelSteps,
      activeStepIds: runtime.activeStepIds,
      steps: runtime.steps,
      createdAt: runtime.createdAt.toISOString(),
      updatedAt: runtime.updatedAt.toISOString(),
      completedAt: null,
    };

    repository.listByExecutionId.mockResolvedValue([
      checkpointEntity.create({
        id: 'checkpoint-1',
        executionId: runtime.id,
        sequence: 1,
        state: state as unknown as Record<string, unknown>,
        checksum: service.checksum(state),
      }),
    ]);

    await expect(
      service.createCheckpointIfDue(
        runtime,
        10,
        runtime.updatedAt,
        { force: true },
      ),
    ).resolves.toBeNull();

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('skips a corrupted checkpoint and restores the latest valid one', async () => {
    const service = createService();

    const validState: WorkflowCheckpointSnapshot = {
      snapshotVersion: 1,
      workflowId: runtime.workflowId,
      status: runtime.status,
      maxParallelSteps: runtime.maxParallelSteps,
      activeStepIds: [],
      steps: [],
      createdAt: runtime.createdAt.toISOString(),
      updatedAt: runtime.updatedAt.toISOString(),
      completedAt: null,
    };

    repository.listByExecutionId.mockResolvedValue([
      checkpointEntity.create({
        id: 'checkpoint-valid',
        executionId: runtime.id,
        sequence: 1,
        state: validState as unknown as Record<string, unknown>,
        checksum: service.checksum(validState),
      }),
      checkpointEntity.create({
        id: 'checkpoint-corrupt',
        executionId: runtime.id,
        sequence: 2,
        state: {
          ...validState,
          status: 'completed',
        },
        checksum: 'sha256:invalid',
      }),
    ]);

    await expect(
      service.restoreLatestSnapshot(runtime.id),
    ).resolves.toEqual(validState);
  });

  it('returns null when every checkpoint is corrupted', async () => {
    const service = createService();

    repository.listByExecutionId.mockResolvedValue([
      checkpointEntity.create({
        id: 'checkpoint-corrupt',
        executionId: runtime.id,
        sequence: 1,
        state: {
          snapshotVersion: 1,
          workflowId: runtime.workflowId,
          status: runtime.status,
          maxParallelSteps: 1,
          activeStepIds: [],
          steps: [],
          createdAt: runtime.createdAt.toISOString(),
          updatedAt: runtime.updatedAt.toISOString(),
          completedAt: null,
        },
        checksum: 'sha256:invalid',
      }),
    ]);

    await expect(
      service.restoreLatestSnapshot(runtime.id),
    ).resolves.toBeNull();
  });

  it('propagates checkpoint persistence failures', async () => {
    const service = createService();

    repository.save.mockRejectedValue(
      new Error('checkpoint database unavailable'),
    );

    await expect(
      service.createCheckpointIfDue(
        runtime,
        1,
        runtime.updatedAt,
      ),
    ).rejects.toThrow('checkpoint database unavailable');
  });

  it('produces the same checksum for equivalent key order', () => {
    const service = createService();

    expect(
      service.checksum({
        beta: 2,
        alpha: {
          delta: 4,
          gamma: 3,
        },
      }),
    ).toBe(
      service.checksum({
        alpha: {
          gamma: 3,
          delta: 4,
        },
        beta: 2,
      }),
    );
  });
});
