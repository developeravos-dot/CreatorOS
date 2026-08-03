import {
  createEmptyWorkflowDispatchMetrics,
  WorkflowDispatchRecord,
} from './workflow-dispatch.models';

describe('workflow dispatch models', () => {
  it('creates empty dispatch metrics', () => {
    const collectedAt = new Date(
      '2026-08-04T00:00:00.000Z',
    );

    expect(
      createEmptyWorkflowDispatchMetrics(
        collectedAt,
      ),
    ).toEqual({
      pending: 0,
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      duplicate: 0,
      total: 0,
      collectedAt,
    });
  });

  it('models workflow dispatch records', () => {
    const record: WorkflowDispatchRecord = {
      id: 'dispatch-1',
      kind: 'step',
      executionId: 'execution-1',
      workflowId: 'workflow-1',
      stepId: 'step-a',
      queueName: 'workflow-step-execution',
      queueJobId: 'job-1',
      idempotencyKey:
        'step:execution-1:step-a:1',
      correlationId: 'correlation-1',
      status: 'queued',
      attempts: 0,
      error: null,
      createdAt: new Date(
        '2026-08-04T00:00:00.000Z',
      ),
      updatedAt: new Date(
        '2026-08-04T00:00:00.000Z',
      ),
      completedAt: null,
      metadata: {},
    };

    expect(record.status).toBe('queued');
    expect(record.kind).toBe('step');
  });
});
