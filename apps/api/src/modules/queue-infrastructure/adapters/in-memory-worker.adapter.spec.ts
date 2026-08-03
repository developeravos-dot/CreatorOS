import {
  InMemoryWorkerAdapter,
} from './in-memory-worker.adapter';

describe('InMemoryWorkerAdapter', () => {
  let adapter: InMemoryWorkerAdapter;

  beforeEach(() => {
    adapter = new InMemoryWorkerAdapter();
  });

  afterEach(async () => {
    await adapter.closeWorkers();
  });

  it('registers and lists workers', async () => {
    await adapter.registerWorker({
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 4,
      handler: jest.fn(),
    });

    expect(adapter.listWorkers()).toEqual([
      expect.objectContaining({
        queueName: 'workflow',
        workerName: 'workflow-worker',
        concurrency: 4,
      }),
    ]);
  });

  it('rejects duplicate worker names', async () => {
    const registration = {
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 1,
      handler: jest.fn(),
    };

    await adapter.registerWorker(registration);

    await expect(
      adapter.registerWorker(registration),
    ).rejects.toThrow('already registered');
  });

  it('executes registered worker handlers', async () => {
    const handler = jest.fn(
      async (context) => ({
        processed: context.payload.value,
      }),
    );

    await adapter.registerWorker({
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 1,
      handler,
    });

    const result = await adapter.execute<{
      processed: string;
    }>(
      'workflow-worker',
      {
        jobId: 'job-1',
        queueName: 'workflow',
        jobName: 'execute',
        payload: {
          value: 'done',
        },
        attempt: 1,
        metadata: {},
      },
    );

    expect(result).toEqual({
      processed: 'done',
    });
  });

  it('unregisters workers', async () => {
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

    expect(adapter.listWorkers()).toEqual([]);
  });
});
