import {
  WorkflowStepConsumer,
} from './workflow-step.consumer';

describe('WorkflowStepConsumer', () => {
  it('runs one workflow step', async () => {
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
      new WorkflowStepConsumer(
        engine as never,
        dispatcher as never,
      );

    await consumer.consume({
      jobId: 'job-1',
      queueName:
        'workflow-step-execution',
      jobName:
        'execute-workflow-step',
      attempt: 1,
      metadata: {},
      payload: {
        dispatchId: 'dispatch-1',
        executionId: 'execution-1',
        workflowId: 'workflow-1',
        stepId: 'step-a',
        attempt: 1,
        requestedAt:
          '2026-08-04T00:00:00.000Z',
      },
    });

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
