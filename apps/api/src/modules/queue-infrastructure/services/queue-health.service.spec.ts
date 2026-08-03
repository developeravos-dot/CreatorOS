import {
  Test,
} from '@nestjs/testing';
import {
  InMemoryQueueAdapter,
  InMemoryWorkerAdapter,
} from '../adapters';
import {
  QUEUE_HEALTH_PROVIDER,
  QUEUE_WORKER_PROVIDER,
} from '../providers';
import {
  QueueHealthService,
} from './queue-health.service';
import {
  QueueWorkerRegistryService,
} from './queue-worker-registry.service';

describe('QueueHealthService', () => {
  it('returns provider and worker health', async () => {
    const queueProvider =
      new InMemoryQueueAdapter();

    const workerProvider =
      new InMemoryWorkerAdapter();

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          QueueHealthService,
          QueueWorkerRegistryService,
          {
            provide: QUEUE_HEALTH_PROVIDER,
            useValue: queueProvider,
          },
          {
            provide: QUEUE_WORKER_PROVIDER,
            useValue: workerProvider,
          },
        ],
      }).compile();

    const registry = moduleRef.get(
      QueueWorkerRegistryService,
    );

    await registry.register({
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 4,
      handler: jest.fn(),
    });

    const service = moduleRef.get(
      QueueHealthService,
    );

    const health = await service.getHealth();

    expect(health.status).toBe('healthy');

    expect(health.provider).toEqual(
      expect.objectContaining({
        provider: 'memory',
        connected: true,
      }),
    );

    expect(health.workers).toEqual([
      expect.objectContaining({
        workerName: 'workflow-worker',
        concurrency: 4,
        status: 'running',
      }),
    ]);

    await queueProvider.close();
    await workerProvider.closeWorkers();
  });

  it('returns a queue infrastructure snapshot', async () => {
    const queueProvider =
      new InMemoryQueueAdapter();

    const workerProvider =
      new InMemoryWorkerAdapter();

    const service = new QueueHealthService(
      queueProvider,
      new QueueWorkerRegistryService(
        workerProvider,
      ),
    );

    const snapshot =
      await service.getSnapshot();

    expect(snapshot.provider).toBe('memory');
    expect(snapshot.queues).toEqual([]);
    expect(snapshot.workers).toEqual([]);

    await queueProvider.close();
    await workerProvider.closeWorkers();
  });
});
