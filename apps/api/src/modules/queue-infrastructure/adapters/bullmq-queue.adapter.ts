import {
  Job,
  JobsOptions,
  Queue,
  QueueOptions,
} from 'bullmq';
import {
  QueueInfrastructureConfiguration,
} from '../configuration';
import {
  QueueJob,
  QueueJobOptions,
  QueueJobStatus,
  QueuePriority,
  QueueProvider,
  QueueProviderHealth,
} from '../contracts';
import {
  RedisConnection,
} from '../redis';

export interface BullMqJobLike {
  id?: string;
  name: string;
  data: unknown;
  attemptsMade: number;
  opts: JobsOptions;
  timestamp: number;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
  stacktrace?: string[];
  getState(): Promise<string>;
  remove(): Promise<void>;
}

export interface BullMqQueueLike {
  name: string;

  add(
    name: string,
    data: unknown,
    options?: JobsOptions,
  ): Promise<BullMqJobLike>;

  getJob(
    jobId: string,
  ): Promise<BullMqJobLike | undefined>;

  pause(): Promise<void>;

  resume(): Promise<void>;

  drain(delayed?: boolean): Promise<void>;

  getJobCounts(
    ...types: string[]
  ): Promise<Record<string, number>>;

  close(): Promise<void>;
}

export type BullMqQueueFactory = (
  queueName: string,
  options: QueueOptions,
) => BullMqQueueLike;

const PRIORITY_TO_NUMBER:
  Record<QueuePriority, number> = {
    critical: 1,
    high: 5,
    normal: 10,
    low: 20,
  };

const NUMBER_TO_PRIORITY = (
  value: number | undefined,
): QueuePriority => {
  if (value === undefined || value >= 15) {
    return value === undefined ? 'normal' : 'low';
  }

  if (value <= 1) {
    return 'critical';
  }

  if (value <= 5) {
    return 'high';
  }

  return 'normal';
};

export class BullMqQueueAdapter
  implements QueueProvider
{
  readonly kind = 'bullmq' as const;

  private readonly queues =
    new Map<string, BullMqQueueLike>();

  private closed = false;

  constructor(
    private readonly configuration:
      QueueInfrastructureConfiguration,
    private readonly redisConnection:
      RedisConnection,
    private readonly queueFactory:
      BullMqQueueFactory =
        BullMqQueueAdapter.createQueue,
  ) {}

  async add<
    TPayload extends Record<string, unknown>,
  >(
    queueName: string,
    jobName: string,
    payload: TPayload,
    options: QueueJobOptions = {},
  ): Promise<QueueJob<TPayload>> {
    this.assertOpen();

    const normalizedQueueName =
      this.requireName(queueName, 'queueName');

    const normalizedJobName =
      this.requireName(jobName, 'jobName');

    const queue = this.getOrCreateQueue(
      normalizedQueueName,
    );

    const mergedOptions =
      this.toBullMqOptions(options);

    const job = await queue.add(
      normalizedJobName,
      this.cloneRecord(payload),
      mergedOptions,
    );

    return this.mapJob<TPayload>(
      normalizedQueueName,
      job,
    );
  }

  async getJob(
    queueName: string,
    jobId: string,
  ): Promise<QueueJob | null> {
    this.assertOpen();

    const queue = this.getOrCreateQueue(
      this.requireName(queueName, 'queueName'),
    );

    const job = await queue.getJob(
      this.requireName(jobId, 'jobId'),
    );

    return job
      ? this.mapJob(queueName, job)
      : null;
  }

  async removeJob(
    queueName: string,
    jobId: string,
  ): Promise<boolean> {
    this.assertOpen();

    const queue = this.getOrCreateQueue(
      this.requireName(queueName, 'queueName'),
    );

    const job = await queue.getJob(
      this.requireName(jobId, 'jobId'),
    );

    if (!job) {
      return false;
    }

    await job.remove();

    return true;
  }

  async pauseQueue(queueName: string): Promise<void> {
    this.assertOpen();

    await this.getOrCreateQueue(
      this.requireName(queueName, 'queueName'),
    ).pause();
  }

  async resumeQueue(queueName: string): Promise<void> {
    this.assertOpen();

    await this.getOrCreateQueue(
      this.requireName(queueName, 'queueName'),
    ).resume();
  }

  async drainQueue(queueName: string): Promise<number> {
    this.assertOpen();

    const queue = this.getOrCreateQueue(
      this.requireName(queueName, 'queueName'),
    );

    const before = await queue.getJobCounts(
      'wait',
      'delayed',
      'failed',
      'completed',
    );

    await queue.drain(true);

    return Object.values(before).reduce(
      (total, count) => total + count,
      0,
    );
  }

  async getHealth(): Promise<QueueProviderHealth> {
    const health =
      await this.redisConnection.getHealth();

    let status:
      QueueProviderHealth['status'] = 'healthy';

    if (!health.connected) {
      status = 'unhealthy';
    }
    else if (
      health.latencyMs >=
      this.configuration.health.unhealthyLatencyMs
    ) {
      status = 'unhealthy';
    }
    else if (
      health.latencyMs >=
      this.configuration.health.degradedLatencyMs
    ) {
      status = 'degraded';
    }

    return {
      provider: this.kind,
      status,
      connected: health.connected,
      latencyMs: health.latencyMs,
      checkedAt: health.checkedAt,
      details: {
        redisStatus: health.status,
        queueCount: this.queues.size,
        ...(health.error
          ? {
              error: health.error,
            }
          : {}),
      },
    };
  }

  async close(): Promise<void> {
    if (this.closed) {
      return;
    }

    this.closed = true;

    const queues = [...this.queues.values()];

    this.queues.clear();

    await Promise.all(
      queues.map((queue) => queue.close()),
    );

    await this.redisConnection.disconnect();
  }

  listQueueNames(): string[] {
    return [...this.queues.keys()].sort();
  }

  private getOrCreateQueue(
    queueName: string,
  ): BullMqQueueLike {
    const existing = this.queues.get(queueName);

    if (existing) {
      return existing;
    }

    const queue = this.queueFactory(
      this.namespacedQueueName(queueName),
      {
        connection: {
          host: this.configuration.redis.host,
          port: this.configuration.redis.port,
          db: this.configuration.redis.database,
          username:
            this.configuration.redis.username,
          password:
            this.configuration.redis.password,
          connectTimeout:
            this.configuration.redis
              .connectTimeoutMs,
          maxRetriesPerRequest:
            this.configuration.redis
              .maxRetriesPerRequest,
          enableReadyCheck:
            this.configuration.redis
              .enableReadyCheck,
          ...(this.configuration.redis.tls
            ? {
                tls: {},
              }
            : {}),
        },
        prefix: this.configuration.namespace,
        defaultJobOptions: {
          attempts:
            this.configuration
              .defaultJobOptions.attempts,
          backoff: {
            type:
              this.configuration
                .defaultJobOptions.backoff.type,
            delay:
              this.configuration
                .defaultJobOptions.backoff.delayMs,
          },
          removeOnComplete:
            this.configuration
              .defaultJobOptions.removeOnComplete,
          removeOnFail:
            this.configuration
              .defaultJobOptions.removeOnFail,
        },
      },
    );

    this.queues.set(queueName, queue);

    return queue;
  }

  private toBullMqOptions(
    options: QueueJobOptions,
  ): JobsOptions {
    return {
      ...(options.jobId
        ? {
            jobId: options.jobId,
          }
        : {}),
      ...(options.delayMs !== undefined
        ? {
            delay: options.delayMs,
          }
        : {}),
      priority:
        PRIORITY_TO_NUMBER[
          options.priority ?? 'normal'
        ],
      attempts:
        options.attempts ??
        this.configuration.defaultJobOptions
          .attempts,
      backoff: options.backoff
        ? {
            type: options.backoff.type,
            delay: options.backoff.delayMs,
          }
        : {
            type:
              this.configuration
                .defaultJobOptions.backoff.type,
            delay:
              this.configuration
                .defaultJobOptions.backoff.delayMs,
          },
      removeOnComplete:
        options.removeOnComplete ??
        this.configuration.defaultJobOptions
          .removeOnComplete,
      removeOnFail:
        options.removeOnFail ??
        this.configuration.defaultJobOptions
          .removeOnFail,
    };
  }

  private async mapJob<TPayload>(
    queueName: string,
    job: BullMqJobLike,
  ): Promise<QueueJob<TPayload>> {
    const state = await job.getState();

    const status =
      this.mapJobStatus(state);

    const attempts =
      typeof job.opts.attempts === 'number'
        ? job.opts.attempts
        : 1;

    return {
      id: String(job.id ?? ''),
      queueName,
      name: job.name,
      payload: this.cloneValue(
        job.data,
        new WeakSet<object>(),
      ) as TPayload,
      status,
      attemptsMade: job.attemptsMade,
      maxAttempts: attempts,
      priority: NUMBER_TO_PRIORITY(
        typeof job.opts.priority === 'number'
          ? job.opts.priority
          : undefined,
      ),
      createdAt: new Date(job.timestamp),
      processedAt:
        typeof job.processedOn === 'number'
          ? new Date(job.processedOn)
          : null,
      completedAt:
        status === 'completed' &&
        typeof job.finishedOn === 'number'
          ? new Date(job.finishedOn)
          : null,
      failedAt:
        status === 'failed' &&
        typeof job.finishedOn === 'number'
          ? new Date(job.finishedOn)
          : null,
      error: job.failedReason
        ? {
            name: 'BullMqJobError',
            message: job.failedReason,
            stack: job.stacktrace?.join('\n'),
            retryable:
              job.attemptsMade < attempts,
          }
        : null,
      metadata: {},
    };
  }

  private mapJobStatus(
    state: string,
  ): QueueJobStatus {
    switch (state) {
      case 'waiting':
      case 'waiting-children':
        return 'waiting';

      case 'delayed':
        return 'delayed';

      case 'active':
        return 'active';

      case 'completed':
        return 'completed';

      case 'failed':
        return 'failed';

      case 'paused':
        return 'paused';

      default:
        return 'waiting';
    }
  }

  private namespacedQueueName(
    queueName: string,
  ): string {
    return `${this.configuration.namespace}:${queueName}`;
  }

  private requireName(
    value: string,
    fieldName: string,
  ): string {
    if (
      typeof value !== 'string' ||
      value.trim().length === 0
    ) {
      throw new TypeError(
        `${fieldName} is required.`,
      );
    }

    return value.trim();
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new Error(
        'The BullMQ queue provider is closed.',
      );
    }
  }

  private cloneRecord(
    value: Record<string, unknown>,
  ): Record<string, unknown> {
    return this.cloneValue(
      value,
      new WeakSet<object>(),
    ) as Record<string, unknown>;
  }

  private cloneValue(
    value: unknown,
    visited: WeakSet<object>,
  ): unknown {
    if (
      value === null ||
      value === undefined ||
      typeof value !== 'object'
    ) {
      return value;
    }

    if (value instanceof Date) {
      return new Date(value);
    }

    if (visited.has(value)) {
      return '[Circular]';
    }

    visited.add(value);

    if (Array.isArray(value)) {
      return value.map((entry) =>
        this.cloneValue(entry, visited),
      );
    }

    const cloned: Record<string, unknown> = {};

    for (
      const [key, entry] of Object.entries(value)
    ) {
      cloned[key] = this.cloneValue(
        entry,
        visited,
      );
    }

    return cloned;
  }

  static createQueue(
    queueName: string,
    options: QueueOptions,
  ): BullMqQueueLike {
    return new Queue(
      queueName,
      options,
    ) as unknown as BullMqQueueLike;
  }
}

void Job;
