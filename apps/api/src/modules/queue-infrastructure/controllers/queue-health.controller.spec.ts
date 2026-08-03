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
  QueueWorkerRegistryService,
} from '../services';
import {
  QueueHealthController,
} from './queue-health.controller';

describe('QueueHealthController', () => {
  it('returns health and snapshots', async () => {
    const queueProvider =
      new InMemoryQueueAdapter();

    const workerProvider =
      new InMemoryWorkerAdapter();

    const moduleRef =
      await Test.createTestingModule({
        controllers: [
          QueueHealthController,
        ],
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

    const controller = moduleRef.get(
      QueueHealthController,
    );

    await expect(
      controller.getHealth(),
    ).resolves.toEqual(
      expect.objectContaining({
        status: 'healthy',
      }),
    );

    await expect(
      controller.getSnapshot(),
    ).resolves.toEqual(
      expect.objectContaining({
        provider: 'memory',
      }),
    );

    await queueProvider.close();
    await workerProvider.closeWorkers();
  });
});
