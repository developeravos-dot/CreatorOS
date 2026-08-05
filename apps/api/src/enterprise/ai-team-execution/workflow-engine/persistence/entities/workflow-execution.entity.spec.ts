import { WorkflowExecutionEntity } from './workflow-execution.entity';

describe('WorkflowExecutionEntity', () => {
  const entity = new WorkflowExecutionEntity();

  it('creates a pending execution with persistence defaults', () => {
    const record = entity.create({
      id: 'execution-1',
      workflowId: 'workflow-1',
    });

    expect(record).toEqual(
      expect.objectContaining({
        id: 'execution-1',
        workflowId: 'workflow-1',
        status: 'pending',
        maxParallelSteps: 1,
        activeStepIds: [],
        context: {},
        metadata: {},
        version: 1,
        startedAt: null,
        pausedAt: null,
        completedAt: null,
        failureReason: null,
      }),
    );
  });

  it('creates defensive copies of mutable values', () => {
    const activeStepIds = ['step-1'];
    const context = {
      nested: {
        value: 1,
      },
    };

    const record = entity.create({
      id: 'execution-1',
      workflowId: 'workflow-1',
      activeStepIds,
      context,
    });

    activeStepIds.push('step-2');
    (context.nested as { value: number }).value = 2;

    expect(record.activeStepIds).toEqual(['step-1']);
    expect(record.context).toEqual({
      nested: {
        value: 1,
      },
    });
  });

  it('increments the optimistic-lock version', () => {
    const original = entity.create({
      id: 'execution-1',
      workflowId: 'workflow-1',
    });

    const updatedAt = new Date(
      original.updatedAt.getTime() + 1_000,
    );

    const updated = entity.nextVersion(
      original,
      {
        status: 'running',
        startedAt: updatedAt,
      },
      updatedAt,
    );

    expect(updated.version).toBe(2);
    expect(updated.status).toBe('running');
    expect(updated.startedAt).toEqual(updatedAt);
    expect(original.version).toBe(1);
    expect(original.status).toBe('pending');
  });

  it('requires terminal executions to have completedAt', () => {
    expect(() =>
      entity.create({
        id: 'execution-1',
        workflowId: 'workflow-1',
        status: 'completed',
      }),
    ).toThrow(
      'completedAt is required for terminal execution statuses.',
    );
  });

  it('requires failed executions to include a failure reason', () => {
    expect(() =>
      entity.create({
        id: 'execution-1',
        workflowId: 'workflow-1',
        status: 'failed',
        completedAt: new Date(),
      }),
    ).toThrow(
      'failureReason is required for failed executions.',
    );
  });

  it('rejects duplicate active step ids', () => {
    expect(() =>
      entity.create({
        id: 'execution-1',
        workflowId: 'workflow-1',
        activeStepIds: ['step-1', 'step-1'],
      }),
    ).toThrow('activeStepIds must not contain duplicates.');
  });
});
