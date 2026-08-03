import {
  QueueBackoffOptions,
  QueueProviderKind,
} from '../contracts';

export interface RedisConnectionConfiguration {
  host: string;
  port: number;
  username?: string;
  password?: string;
  database: number;
  tls: boolean;
  connectTimeoutMs: number;
  maxRetriesPerRequest: number | null;
  enableReadyCheck: boolean;
  keyPrefix?: string;
}

export interface QueueDefaultJobConfiguration {
  attempts: number;
  backoff: QueueBackoffOptions;
  removeOnComplete: boolean | number;
  removeOnFail: boolean | number;
}

export interface QueueInfrastructureConfiguration {
  provider: QueueProviderKind;
  namespace: string;
  redis: RedisConnectionConfiguration;
  defaultJobOptions: QueueDefaultJobConfiguration;
  worker: {
    defaultConcurrency: number;
    lockDurationMs: number;
    stalledIntervalMs: number;
    maxStalledCount: number;
    gracefulShutdownTimeoutMs: number;
  };
  health: {
    enabled: boolean;
    timeoutMs: number;
    degradedLatencyMs: number;
    unhealthyLatencyMs: number;
  };
}

export const DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION:
  QueueInfrastructureConfiguration = {
    provider: 'memory',
    namespace: 'creatoros',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      database: 0,
      tls: false,
      connectTimeoutMs: 5_000,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delayMs: 1_000,
      },
      removeOnComplete: 1_000,
      removeOnFail: 5_000,
    },
    worker: {
      defaultConcurrency: 4,
      lockDurationMs: 30_000,
      stalledIntervalMs: 30_000,
      maxStalledCount: 1,
      gracefulShutdownTimeoutMs: 15_000,
    },
    health: {
      enabled: true,
      timeoutMs: 2_000,
      degradedLatencyMs: 250,
      unhealthyLatencyMs: 1_000,
    },
  };

export function mergeQueueInfrastructureConfiguration(
  partial: Partial<QueueInfrastructureConfiguration>,
): QueueInfrastructureConfiguration {
  return {
    ...DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION,
    ...partial,
    redis: {
      ...DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION.redis,
      ...(partial.redis ?? {}),
    },
    defaultJobOptions: {
      ...DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION.defaultJobOptions,
      ...(partial.defaultJobOptions ?? {}),
      backoff: {
        ...DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION
          .defaultJobOptions.backoff,
        ...(partial.defaultJobOptions?.backoff ?? {}),
      },
    },
    worker: {
      ...DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION.worker,
      ...(partial.worker ?? {}),
    },
    health: {
      ...DEFAULT_QUEUE_INFRASTRUCTURE_CONFIGURATION.health,
      ...(partial.health ?? {}),
    },
  };
}
