import {
  Job,
} from 'bullmq';
import {
  mergeQueueInfrastructureConfiguration,
} from '../configuration';
import {
  BullMqWorkerAdapter,
  BullMqWorkerLike,
} from './bullmq-worker.adapter';

describe('BullMqWorkerAdapter', () => {
  it('registers BullMQ workers', async () => {
    const worker: BullMqWorkerLike = {
      name: 'workflow-worker',
      close: jest.fn().mockResolvedValue(
        undefined,
      ),
      pause: jest.fn().mockResolvedValue(
        undefined,
      ),
      resume: jest.fn(),
      isRunning: jest.fn().mockReturnValue(true),
    };

    const factory = jest.fn(() => worker);

    const adapter = new BullMqWorkerAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      factory,
    );

    const handler = jest.fn();

    await adapter.registerWorker({
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 3,
      handler,
    });

    expect(factory).toHaveBeenCalledWith(
      'creatoros:workflow',
      expect.any(Function),
      expect.objectContaining({
        concurrency: 3,
      }),
    );

    expect(adapter.listWorkers()).toHaveLength(
      1,
    );

    await adapter.closeWorkers();
  });

  it('maps BullMQ jobs to worker context', async () => {
    let processor:
      | ((job: Job) => Promise<unknown>)
      | undefined;

    const worker: BullMqWorkerLike = {
      name: 'workflow-worker',
      close: jest.fn().mockResolvedValue(
        undefined,
      ),
      pause: jest.fn().mockResolvedValue(
        undefined,
      ),
      resume: jest.fn(),
      isRunning: jest.fn().mockReturnValue(true),
    };

    const handler = jest.fn(
      async (context) => ({
        executionId:
          context.payload.executionId,
      }),
    );

    const adapter = new BullMqWorkerAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      (
        _queueName,
        registeredProcessor,
      ) => {
        processor = registeredProcessor;
        return worker;
      },
    );

    await adapter.registerWorker({
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 1,
      handler,
    });

    const result = await processor!(
      {
        id: 'job-1',
        name: 'execute',
        data: {
          executionId: 'execution-1',
        },
        attemptsMade: 0,
      } as Job,
    );

    expect(result).toEqual({
      executionId: 'execution-1',
    });

    expect(handler).toHaveBeenCalledWith({
      jobId: 'job-1',
      queueName: 'workflow',
      jobName: 'execute',
      payload: {
        executionId: 'execution-1',
      },
      attempt: 1,
      metadata: {},
    });

    await adapter.closeWorkers();
  });

  it('unregisters and closes BullMQ workers', async () => {
    const worker: BullMqWorkerLike = {
      name: 'workflow-worker',
      close: jest.fn().mockResolvedValue(
        undefined,
      ),
      pause: jest.fn().mockResolvedValue(
        undefined,
      ),
      resume: jest.fn(),
      isRunning: jest.fn().mockReturnValue(true),
    };

    const adapter = new BullMqWorkerAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      () => worker,
    );

    await adapter.registerWorker({
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 1,
      handler: jest.fn(),
    });

    await expect(
      adapter.unregisterWorker(
        'workflow-worker',
      ),
    ).resolves.toBe(true);

    expect(worker.close).toHaveBeenCalledTimes(1);
  });
});
