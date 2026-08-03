import {
  DistributedWorkerCoordinatorService,
} from './distributed-worker-coordinator.service';

describe('DistributedWorkerCoordinatorService', () => {
  it('registers workflow, step and retry workers', async () => {
    const registrations: unknown[] = [];

    const registry = {
      has: jest.fn().mockReturnValue(false),
      register: jest.fn(
        async (registration) => {
          registrations.push(registration);
        },
      ),
      list: jest.fn().mockReturnValue([]),
      unregister: jest.fn(),
    };

    const workflowConsumer = {
      consume: jest.fn(),
    };

    const stepConsumer = {
      consume: jest.fn(),
    };

    const retryConsumer = {
      consume: jest.fn(),
    };

    const leases = {
      acquire: jest.fn(),
      release: jest.fn(),
    };

    const heartbeats = {
      record: jest.fn(),
      remove: jest.fn(),
      getMetrics: jest.fn().mockReturnValue({
        registeredWorkers: 3,
      }),
    };

    const service =
      new DistributedWorkerCoordinatorService(
        registry as never,
        workflowConsumer as never,
        stepConsumer as never,
        retryConsumer as never,
        leases as never,
        heartbeats as never,
      );

    await service.registerWorkers();

    expect(registry.register).toHaveBeenCalledTimes(
      3,
    );

    expect(registrations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workerName:
            'distributed-workflow-worker',
          queueName: 'workflow-execution',
          concurrency: 2,
        }),
        expect.objectContaining({
          workerName:
            'distributed-step-worker',
          queueName:
            'workflow-step-execution',
          concurrency: 8,
        }),
        expect.objectContaining({
          workerName:
            'distributed-retry-worker',
          queueName: 'workflow-retry',
          concurrency: 4,
        }),
      ]),
    );

    expect(leases.acquire).toHaveBeenCalledTimes(
      3,
    );

    expect(
      heartbeats.record,
    ).toHaveBeenCalledTimes(3);
  });

  it('does not duplicate registered workers', async () => {
    const registry = {
      has: jest.fn().mockReturnValue(true),
      register: jest.fn(),
      list: jest.fn().mockReturnValue([]),
      unregister: jest.fn(),
    };

    const service =
      new DistributedWorkerCoordinatorService(
        registry as never,
        { consume: jest.fn() } as never,
        { consume: jest.fn() } as never,
        { consume: jest.fn() } as never,
        {
          acquire: jest.fn(),
          release: jest.fn(),
        } as never,
        {
          record: jest.fn(),
          remove: jest.fn(),
          getMetrics: jest.fn(),
        } as never,
      );

    await service.registerWorkers();

    expect(registry.register).not.toHaveBeenCalled();
  });
});
