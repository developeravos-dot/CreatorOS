import { WorkflowCheckpointEntity } from './workflow-checkpoint.entity';

describe('WorkflowCheckpointEntity', () => {
  const entity = new WorkflowCheckpointEntity();

  it('creates a checkpoint with defaults', () => {
    const record = entity.create({
      id: 'checkpoint-1',
      executionId: 'execution-1',
      sequence: 1,
      checksum: 'sha256:abc',
    });

    expect(record).toEqual(
      expect.objectContaining({
        state: {},
        completedStepIds: [],
        activeStepIds: [],
      }),
    );
  });

  it('creates defensive copies', () => {
    const state = { nested: { value: 1 } };
    const completedStepIds = ['step-1'];

    const record = entity.create({
      id: 'checkpoint-1',
      executionId: 'execution-1',
      sequence: 1,
      checksum: 'sha256:abc',
      state,
      completedStepIds,
    });

    (state.nested as { value: number }).value = 2;
    completedStepIds.push('step-2');

    expect(record.state).toEqual({ nested: { value: 1 } });
    expect(record.completedStepIds).toEqual(['step-1']);
  });

  it('requires a positive sequence', () => {
    expect(() =>
      entity.create({
        id: 'checkpoint-1',
        executionId: 'execution-1',
        sequence: 0,
        checksum: 'sha256:abc',
      }),
    ).toThrow(
      'Workflow checkpoint sequence must be a positive integer.',
    );
  });

  it('rejects active and completed overlap', () => {
    expect(() =>
      entity.create({
        id: 'checkpoint-1',
        executionId: 'execution-1',
        sequence: 1,
        checksum: 'sha256:abc',
        activeStepIds: ['step-1'],
        completedStepIds: ['step-1'],
      }),
    ).toThrow(
      'A workflow step cannot be both active and completed in a checkpoint.',
    );
  });
});
