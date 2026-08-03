import {
  WorkflowRetryConsumer,
} from './workflow-retry.consumer';

describe('WorkflowRetryConsumer', () => {
  it('activates and executes scheduled retries', async () => {
    const orchestrator = {
      activateScheduledRetry: jest.fn(),
    };

    const engine = {
      runSingleStep: jest
        .fn()
        .mockResolvedValue({
          completedStepIds: ['step-a'],
        }),
    };

    const dispatcher = {
      markProcessing: jest.fn(),
      markCompleted: jest.fn(),
      markFailed: jest.fn(),
    };

    const consumer =
      new WorkflowRetryConsumer(
        orchestrator as never,
        engine as never,
        dispatcher as never,
      );

    await consumer.consume({
      jobId: 'job-1',
      queueName: 'workflow-retry',
      jobName: 'retry-workflow-step',
      attempt: 2,
      metadata: {},
      payload: {
        dispatchId: 'dispatch-1',
        executionId: 'execution-1',
        workflowId: 'workflow-1',
        stepId: 'step-a',
        retryAttempt: 2,
        scheduleId: 'schedule-1',
        requestedAt:
          '2026-08-04T00:00:00.000Z',
      },
    });

    expect(
      orchestrator.activateScheduledRetry,
    ).toHaveBeenCalledWith(
      'execution-1',
      'step-a',
      'schedule-1',
    );

    expect(
      engine.runSingleStep,
    ).toHaveBeenCalledWith(
      'execution-1',
      'step-a',
    );

    expect(
      dispatcher.markCompleted,
    ).toHaveBeenCalledWith('dispatch-1');
  });
});
