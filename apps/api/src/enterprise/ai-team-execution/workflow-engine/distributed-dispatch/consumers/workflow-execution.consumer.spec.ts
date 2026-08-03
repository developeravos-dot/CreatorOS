import {
  WorkflowExecutionConsumer,
} from './workflow-execution.consumer';

describe('WorkflowExecutionConsumer', () => {
  it('runs workflow executions and completes dispatches', async () => {
    const engine = {
      runExecution: jest.fn().mockResolvedValue({
        execution: {
          status: 'completed',
        },
      }),
    };

    const dispatcher = {
      markProcessing: jest.fn(),
      markCompleted: jest.fn(),
      markFailed: jest.fn(),
    };

    const consumer =
      new WorkflowExecutionConsumer(
        engine as never,
        dispatcher as never,
      );

    await consumer.consume({
      jobId: 'job-1',
      queueName: 'workflow-execution',
      jobName: 'execute-workflow',
      attempt: 1,
      metadata: {},
      payload: {
        dispatchId: 'dispatch-1',
        executionId: 'execution-1',
        workflowId: 'workflow-1',
        requestedAt:
          '2026-08-04T00:00:00.000Z',
      },
    });

    expect(
      dispatcher.markProcessing,
    ).toHaveBeenCalledWith('dispatch-1');

    expect(
      engine.runExecution,
    ).toHaveBeenCalledWith(
      'execution-1',
      {},
    );

    expect(
      dispatcher.markCompleted,
    ).toHaveBeenCalledWith('dispatch-1');
  });

  it('marks failed workflow dispatches', async () => {
    const failure = new Error(
      'Workflow failed',
    );

    const engine = {
      runExecution: jest
        .fn()
        .mockRejectedValue(failure),
    };

    const dispatcher = {
      markProcessing: jest.fn(),
      markCompleted: jest.fn(),
      markFailed: jest.fn(),
    };

    const consumer =
      new WorkflowExecutionConsumer(
        engine as never,
        dispatcher as never,
      );

    await expect(
      consumer.consume({
        jobId: 'job-1',
        queueName: 'workflow-execution',
        jobName: 'execute-workflow',
        attempt: 1,
        metadata: {},
        payload: {
          dispatchId: 'dispatch-1',
          executionId: 'execution-1',
          workflowId: 'workflow-1',
          requestedAt:
            '2026-08-04T00:00:00.000Z',
        },
      }),
    ).rejects.toThrow('Workflow failed');

    expect(
      dispatcher.markFailed,
    ).toHaveBeenCalledWith(
      'dispatch-1',
      failure,
    );
  });
});
