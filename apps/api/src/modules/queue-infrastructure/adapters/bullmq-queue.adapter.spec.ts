import {
  mergeQueueInfrastructureConfiguration,
} from '../configuration';
import {
  RedisConnection,
} from '../redis';
import {
  BullMqJobLike,
  BullMqQueueAdapter,
  BullMqQueueLike,
} from './bullmq-queue.adapter';

describe('BullMqQueueAdapter', () => {
  let queue: BullMqQueueLike;
  let redis: jest.Mocked<RedisConnection>;

  beforeEach(() => {
    const jobs = new Map<string, BullMqJobLike>();

    queue = {
      name: 'creatoros:workflow',
      add: jest.fn(
        async (
          name: string,
          data: unknown,
          options = {},
        ) => {
          const job: BullMqJobLike = {
            id:
              String(
                (
                  options as {
                    jobId?: string;
                  }
                ).jobId ?? 'generated-job',
              ),
            name,
            data,
            attemptsMade: 0,
            opts: options,
            timestamp: Date.parse(
              '2026-08-04T00:00:00.000Z',
            ),
            getState: jest
              .fn()
              .mockResolvedValue('waiting'),
            remove: jest.fn().mockResolvedValue(
              undefined,
            ),
          };

          jobs.set(String(job.id), job);

          return job;
        },
      ),
      getJob: jest.fn(
        async (jobId: string) =>
          jobs.get(jobId),
      ),
      pause: jest.fn().mockResolvedValue(undefined),
      resume: jest.fn().mockResolvedValue(undefined),
      drain: jest.fn(
        async () => {
          jobs.clear();
        },
      ),
      getJobCounts: jest
        .fn()
        .mockResolvedValue({
          wait: 2,
          delayed: 1,
          failed: 0,
          completed: 0,
        }),
      close: jest.fn().mockResolvedValue(undefined),
    };

    redis = {
      configuration:
        mergeQueueInfrastructureConfiguration({})
          .redis,
      status: 'connected',
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest
        .fn()
        .mockResolvedValue(undefined),
      ping: jest.fn().mockResolvedValue(4),
      getHealth: jest.fn().mockResolvedValue({
        status: 'connected',
        connected: true,
        latencyMs: 4,
        checkedAt: new Date(
          '2026-08-04T00:00:00.000Z',
        ),
      }),
      duplicate: jest.fn(),
    };
  });

  it('adds and maps BullMQ jobs', async () => {
    const adapter = new BullMqQueueAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      redis,
      () => queue,
    );

    const job = await adapter.add(
      'workflow',
      'execute',
      {
        executionId: 'execution-1',
      },
      {
        jobId: 'job-1',
        attempts: 3,
        priority: 'high',
      },
    );

    expect(job).toEqual(
      expect.objectContaining({
        id: 'job-1',
        queueName: 'workflow',
        name: 'execute',
        status: 'waiting',
        maxAttempts: 3,
        priority: 'high',
      }),
    );

    expect(queue.add).toHaveBeenCalledWith(
      'execute',
      {
        executionId: 'execution-1',
      },
      expect.objectContaining({
        jobId: 'job-1',
        attempts: 3,
        priority: 5,
      }),
    );
  });

  it('reuses one BullMQ queue instance per queue name', async () => {
    const factory = jest.fn(() => queue);

    const adapter = new BullMqQueueAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      redis,
      factory,
    );

    await adapter.add('workflow', 'first', {});
    await adapter.add('workflow', 'second', {});

    expect(factory).toHaveBeenCalledTimes(1);
    expect(adapter.listQueueNames()).toEqual([
      'workflow',
    ]);
  });

  it('removes jobs', async () => {
    const adapter = new BullMqQueueAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      redis,
      () => queue,
    );

    await adapter.add(
      'workflow',
      'execute',
      {},
      {
        jobId: 'job-remove',
      },
    );

    await expect(
      adapter.removeJob(
        'workflow',
        'job-remove',
      ),
    ).resolves.toBe(true);
  });

  it('pauses, resumes and drains queues', async () => {
    const adapter = new BullMqQueueAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      redis,
      () => queue,
    );

    await adapter.pauseQueue('workflow');
    await adapter.resumeQueue('workflow');

    await expect(
      adapter.drainQueue('workflow'),
    ).resolves.toBe(3);

    expect(queue.pause).toHaveBeenCalled();
    expect(queue.resume).toHaveBeenCalled();
    expect(queue.drain).toHaveBeenCalledWith(true);
  });

  it('maps Redis health to BullMQ health', async () => {
    const configuration =
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      });

    redis.getHealth.mockResolvedValue({
      status: 'connected',
      connected: true,
      latencyMs:
        configuration.health.degradedLatencyMs,
      checkedAt: new Date(
        '2026-08-04T00:00:00.000Z',
      ),
    });

    const adapter = new BullMqQueueAdapter(
      configuration,
      redis,
      () => queue,
    );

    const health = await adapter.getHealth();

    expect(health).toEqual(
      expect.objectContaining({
        provider: 'bullmq',
        status: 'degraded',
        connected: true,
      }),
    );
  });

  it('closes queues and Redis connection', async () => {
    const adapter = new BullMqQueueAdapter(
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
      }),
      redis,
      () => queue,
    );

    await adapter.add('workflow', 'execute', {});
    await adapter.close();

    expect(queue.close).toHaveBeenCalledTimes(1);

    expect(
      redis.disconnect,
    ).toHaveBeenCalledTimes(1);
  });
});
