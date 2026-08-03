import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  QueueJob,
  QueueJobOptions,
  QueueJobStatus,
  QueuePriority,
  QueueProvider,
  QueueProviderHealth,
} from '../contracts';

interface StoredQueue {
  paused: boolean;
  jobs: Map<string, QueueJob>;
}

const PRIORITY_ORDER:
  Record<QueuePriority, number> = {
    critical: 1,
    high: 2,
    normal: 3,
    low: 4,
  };

export class InMemoryQueueAdapter
  implements QueueProvider
{
  readonly kind = 'memory' as const;

  private readonly queues =
    new Map<string, StoredQueue>();

  private closed = false;

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
      this.normalizeRequired(queueName, 'queueName');

    const normalizedJobName =
      this.normalizeRequired(jobName, 'jobName');

    const queue = this.getOrCreateQueue(
      normalizedQueueName,
    );

    const jobId =
      options.jobId?.trim() || randomUUID();

    if (queue.jobs.has(jobId)) {
      throw new ConflictException(
        `Queue job ${jobId} already exists in ${normalizedQueueName}.`,
      );
    }

    const now = new Date();
    const delayMs = options.delayMs ?? 0;

    if (
      !Number.isSafeInteger(delayMs) ||
      delayMs < 0
    ) {
      throw new RangeError(
        'delayMs must be a non-negative safe integer.',
      );
    }

    const attempts = options.attempts ?? 1;

    if (
      !Number.isSafeInteger(attempts) ||
      attempts < 1
    ) {
      throw new RangeError(
        'attempts must be a positive safe integer.',
      );
    }

    const job: QueueJob<TPayload> = {
      id: jobId,
      queueName: normalizedQueueName,
      name: normalizedJobName,
      payload: this.cloneRecord(payload),
      status: delayMs > 0 ? 'delayed' : 'waiting',
      attemptsMade: 0,
      maxAttempts: attempts,
      priority: options.priority ?? 'normal',
      createdAt: now,
      processedAt: null,
      completedAt: null,
      failedAt: null,
      error: null,
      metadata: this.cloneRecord(
        options.metadata ?? {},
      ),
    };

    queue.jobs.set(
      job.id,
      this.cloneJob(job),
    );

    return this.cloneJob(job);
  }

  async getJob(
    queueName: string,
    jobId: string,
  ): Promise<QueueJob | null> {
    this.assertOpen();

    const queue = this.queues.get(queueName);

    if (!queue) {
      return null;
    }

    const job = queue.jobs.get(jobId);

    return job ? this.cloneJob(job) : null;
  }

  async removeJob(
    queueName: string,
    jobId: string,
  ): Promise<boolean> {
    this.assertOpen();

    return (
      this.queues.get(queueName)?.jobs.delete(jobId) ??
      false
    );
  }

  async pauseQueue(queueName: string): Promise<void> {
    this.assertOpen();

    this.getOrCreateQueue(queueName).paused = true;
  }

  async resumeQueue(queueName: string): Promise<void> {
    this.assertOpen();

    this.getOrCreateQueue(queueName).paused = false;
  }

  async drainQueue(queueName: string): Promise<number> {
    this.assertOpen();

    const queue = this.queues.get(queueName);

    if (!queue) {
      return 0;
    }

    const removableStatuses =
      new Set<QueueJobStatus>([
        'waiting',
        'delayed',
        'failed',
        'completed',
        'cancelled',
      ]);

    let removed = 0;

    for (const [jobId, job] of queue.jobs) {
      if (removableStatuses.has(job.status)) {
        queue.jobs.delete(jobId);
        removed += 1;
      }
    }

    return removed;
  }

  async getHealth(): Promise<QueueProviderHealth> {
    const startedAt = performance.now();

    return {
      provider: this.kind,
      status: this.closed
        ? 'unhealthy'
        : 'healthy',
      connected: !this.closed,
      latencyMs: Math.max(
        0,
        performance.now() - startedAt,
      ),
      checkedAt: new Date(),
      details: {
        queueCount: this.queues.size,
        jobCount: [...this.queues.values()].reduce(
          (total, queue) =>
            total + queue.jobs.size,
          0,
        ),
      },
    };
  }

  async close(): Promise<void> {
    this.closed = true;
    this.queues.clear();
  }

  listJobs(queueName: string): QueueJob[] {
    const queue = this.queues.get(queueName);

    if (!queue) {
      return [];
    }

    return [...queue.jobs.values()]
      .sort((left, right) => {
        const priorityDifference =
          PRIORITY_ORDER[left.priority] -
          PRIORITY_ORDER[right.priority];

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return (
          left.createdAt.getTime() -
          right.createdAt.getTime()
        );
      })
      .map((job) => this.cloneJob(job));
  }

  isPaused(queueName: string): boolean {
    return (
      this.queues.get(queueName)?.paused ?? false
    );
  }

  private getOrCreateQueue(
    queueName: string,
  ): StoredQueue {
    const normalizedQueueName =
      this.normalizeRequired(queueName, 'queueName');

    const existing =
      this.queues.get(normalizedQueueName);

    if (existing) {
      return existing;
    }

    const created: StoredQueue = {
      paused: false,
      jobs: new Map<string, QueueJob>(),
    };

    this.queues.set(normalizedQueueName, created);

    return created;
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new NotFoundException(
        'The in-memory queue provider is closed.',
      );
    }
  }

  private normalizeRequired(
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

  private cloneJob<TPayload>(
    job: QueueJob<TPayload>,
  ): QueueJob<TPayload> {
    return {
      ...job,
      payload: this.cloneValue(
        job.payload,
        new WeakSet<object>(),
      ) as TPayload,
      metadata: this.cloneRecord(job.metadata),
      error: job.error
        ? {
            ...job.error,
          }
        : null,
      createdAt: new Date(job.createdAt),
      processedAt: job.processedAt
        ? new Date(job.processedAt)
        : null,
      completedAt: job.completedAt
        ? new Date(job.completedAt)
        : null,
      failedAt: job.failedAt
        ? new Date(job.failedAt)
        : null,
    };
  }

  private cloneRecord<
    TValue extends Record<string, unknown>,
  >(
    value: TValue,
  ): TValue {
    return this.cloneValue(
      value,
      new WeakSet<object>(),
    ) as TValue;
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
}

