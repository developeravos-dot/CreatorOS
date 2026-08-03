import {
  Test,
} from '@nestjs/testing';
import {
  InMemoryWorkerAdapter,
} from '../adapters';
import {
  QUEUE_WORKER_PROVIDER,
} from '../providers';
import {
  QueueWorkerRegistryService,
} from './queue-worker-registry.service';

describe('QueueWorkerRegistryService', () => {
  it('registers and unregisters workers', async () => {
    const provider =
      new InMemoryWorkerAdapter();

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          QueueWorkerRegistryService,
          {
            provide: QUEUE_WORKER_PROVIDER,
            useValue: provider,
          },
        ],
      }).compile();

    const service = moduleRef.get(
      QueueWorkerRegistryService,
    );

    await service.register({
      queueName: 'workflow',
      workerName: 'workflow-worker',
      concurrency: 2,
      handler: jest.fn(),
    });

    expect(service.has('workflow-worker')).toBe(
      true,
    );

    expect(service.list()).toHaveLength(1);

    await expect(
      service.unregister('workflow-worker'),
    ).resolves.toBe(true);

    expect(service.has('workflow-worker')).toBe(
      false,
    );
  });

  it('closes workers during application shutdown', async () => {
    const provider =
      new InMemoryWorkerAdapter();

    const closeSpy = jest.spyOn(
      provider,
      'closeWorkers',
    );

    const service =
      new QueueWorkerRegistryService(provider);

    await service.onApplicationShutdown();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
