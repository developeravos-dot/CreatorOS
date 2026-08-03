import {
  DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION,
  mergeQueueInfrastructureConfiguration,
} from './queue-configuration';

describe('queue configuration', () => {
  it('provides safe defaults', () => {
    expect(
      DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION.provider,
    ).toBe('memory');

    expect(
      DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION.redis.port,
    ).toBe(6379);

    expect(
      DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION
        .defaultJobOptions.attempts,
    ).toBe(3);
  });

  it('deep merges partial configuration', () => {
    const configuration =
      mergeQueueInfrastructureConfiguration({
        provider: 'bullmq',
        namespace: 'creatoros-test',
        redis: {
          host: 'redis.internal',
          port: 6380,
          database: 2,
          tls: true,
          connectTimeoutMs: 10_000,
          maxRetriesPerRequest: 3,
          enableReadyCheck: false,
        },
        worker: {
          defaultConcurrency: 8,
          lockDurationMs: 60_000,
          stalledIntervalMs: 15_000,
          maxStalledCount: 2,
          gracefulShutdownTimeoutMs: 20_000,
        },
      });

    expect(configuration.provider).toBe('bullmq');
    expect(configuration.redis.host).toBe(
      'redis.internal',
    );
    expect(configuration.worker.defaultConcurrency).toBe(
      8,
    );

    expect(configuration.health.enabled).toBe(true);
  });
});
