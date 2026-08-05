import { WorkflowRecoveryEntity } from './workflow-recovery.entity';

describe('WorkflowRecoveryEntity', () => {
  const entity = new WorkflowRecoveryEntity();

  it('creates a pending recovery with defaults', () => {
    const record = entity.create({
      id: 'recovery-1',
      executionId: 'execution-1',
      reason: 'server restart',
    });

    expect(record).toEqual(
      expect.objectContaining({
        checkpointId: null,
        status: 'pending',
        attempt: 1,
        restoredStepIds: [],
        errorMessage: null,
        startedAt: null,
        completedAt: null,
      }),
    );
  });

  it('requires startedAt for running recovery', () => {
    expect(() =>
      entity.create({
        id: 'recovery-1',
        executionId: 'execution-1',
        reason: 'server restart',
        status: 'running',
      }),
    ).toThrow('startedAt is required for running workflow recovery.');
  });

  it('requires completedAt for terminal recovery', () => {
    expect(() =>
      entity.create({
        id: 'recovery-1',
        executionId: 'execution-1',
        reason: 'server restart',
        status: 'completed',
      }),
    ).toThrow(
      'completedAt is required for terminal workflow recovery.',
    );
  });

  it('requires errorMessage for failed recovery', () => {
    expect(() =>
      entity.create({
        id: 'recovery-1',
        executionId: 'execution-1',
        reason: 'server restart',
        status: 'failed',
        completedAt: new Date(),
      }),
    ).toThrow('errorMessage is required for failed workflow recovery.');
  });
});
