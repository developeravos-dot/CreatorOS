import {
  BadRequestException,
} from '@nestjs/common';
import {
  mergeQueueInfrastructureConfiguration,
} from '../configuration';
import {
  QueueConfigurationValidatorService,
} from './queue-configuration-validator.service';

describe('QueueConfigurationValidatorService', () => {
  let service: QueueConfigurationValidatorService;

  beforeEach(() => {
    service =
      new QueueConfigurationValidatorService();
  });

  it('accepts the default configuration', () => {
    const configuration =
      mergeQueueInfrastructureConfiguration({});

    const result = service.validate(configuration);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects invalid Redis and worker settings', () => {
    const configuration =
      mergeQueueInfrastructureConfiguration({
        namespace: '',
        redis: {
          host: '',
          port: 70_000,
          database: -1,
          tls: false,
          connectTimeoutMs: 5_000,
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
        },
        worker: {
          defaultConcurrency: 0,
          lockDurationMs: 30_000,
          stalledIntervalMs: 30_000,
          maxStalledCount: 1,
          gracefulShutdownTimeoutMs: 15_000,
        },
      });

    const result = service.validate(configuration);

    expect(result.valid).toBe(false);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Queue namespace is required.',
        'Redis host is required.',
        'Redis port must be an integer between 1 and 65535.',
        'Redis database must be a non-negative integer.',
        'Worker concurrency must be a positive integer.',
      ]),
    );
  });

  it('throws for invalid configurations', () => {
    const configuration =
      mergeQueueInfrastructureConfiguration({
        health: {
          enabled: true,
          timeoutMs: 2_000,
          degradedLatencyMs: 2_000,
          unhealthyLatencyMs: 1_000,
        },
      });

    expect(() =>
      service.assertValid(configuration),
    ).toThrow(BadRequestException);
  });

  it('sanitizes Redis passwords', () => {
    const configuration =
      mergeQueueInfrastructureConfiguration({
        redis: {
          host: 'redis.internal',
          port: 6379,
          username: 'creatoros',
          password: 'super-secret-password',
          database: 0,
          tls: true,
          connectTimeoutMs: 5_000,
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
        },
      });

    const sanitized = service.sanitize(configuration);

    expect(sanitized.redis.password).toBe(
      '[REDACTED]',
    );

    expect(configuration.redis.password).toBe(
      'super-secret-password',
    );
  });
});
