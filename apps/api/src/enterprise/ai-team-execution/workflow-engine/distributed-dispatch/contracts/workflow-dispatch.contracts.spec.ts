import {
  WORKFLOW_EXECUTION_QUEUE,
  WORKFLOW_RETRY_QUEUE,
  WORKFLOW_STEP_QUEUE,
  WorkflowDispatchRequest,
} from './workflow-dispatch.contracts';

describe('workflow dispatch contracts', () => {
  it('defines stable queue names', () => {
    expect(WORKFLOW_EXECUTION_QUEUE).toBe(
      'workflow-execution',
    );

    expect(WORKFLOW_STEP_QUEUE).toBe(
      'workflow-step-execution',
    );

    expect(WORKFLOW_RETRY_QUEUE).toBe(
      'workflow-retry',
    );
  });

  it('supports workflow execution dispatch requests', () => {
    const request: WorkflowDispatchRequest = {
      kind: 'workflow',
      payload: {
        executionId: 'execution-1',
        workflowId: 'workflow-1',
        requestedAt:
          '2026-08-04T00:00:00.000Z',
      },
      options: {
        priority: 'high',
        idempotencyKey:
          'workflow:execution-1',
      },
    };

    expect(request.kind).toBe('workflow');
    expect(request.options?.priority).toBe('high');
  });

  it('supports step retry dispatch requests', () => {
    const request: WorkflowDispatchRequest = {
      kind: 'retry',
      payload: {
        executionId: 'execution-1',
        workflowId: 'workflow-1',
        stepId: 'step-a',
        retryAttempt: 2,
        scheduleId: 'schedule-1',
        requestedAt:
          '2026-08-04T00:00:00.000Z',
      },
    };

    expect(request.kind).toBe('retry');
  });
});
