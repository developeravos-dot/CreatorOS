import { WorkflowStepStateEntity } from './workflow-step-state.entity';

describe('WorkflowStepStateEntity', () => {
  const entity = new WorkflowStepStateEntity();

  it('creates a pending step state with defaults', () => {
    const record = entity.create({
      id: 'state-1',
      executionId: 'execution-1',
      stepId: 'step-1',
    });

    expect(record).toEqual(
      expect.objectContaining({
        status: 'pending',
        attempt: 0,
        input: {},
        output: null,
        version: 1,
      }),
    );
  });

  it('requires startedAt for running states', () => {
    expect(() =>
      entity.create({
        id: 'state-1',
        executionId: 'execution-1',
        stepId: 'step-1',
        status: 'running',
      }),
    ).toThrow('startedAt is required for running workflow steps.');
  });

  it('requires completedAt for terminal states', () => {
    expect(() =>
      entity.create({
        id: 'state-1',
        executionId: 'execution-1',
        stepId: 'step-1',
        status: 'completed',
      }),
    ).toThrow('completedAt is required for terminal workflow steps.');
  });

  it('requires errorMessage for failed states', () => {
    expect(() =>
      entity.create({
        id: 'state-1',
        executionId: 'execution-1',
        stepId: 'step-1',
        status: 'failed',
        completedAt: new Date(),
      }),
    ).toThrow('errorMessage is required for failed workflow steps.');
  });
});
