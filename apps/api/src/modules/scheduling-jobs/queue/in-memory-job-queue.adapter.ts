import {
  randomUUID,
} from 'node:crypto';

import {
  JOB_PRIORITY_RANK,
  type JobQueueConfiguration,
  type JobQueueMetrics,
} from '../models';
import type {
  DequeueJobQueueItemInput,
  EnqueueJobQueueItemInput,
  JobQueueAdapter,
  JobQueueItem,
  JobQueuePurgeInput,
} from './job-queue.adapter';

export class InMemoryJobQueueAdapter
  implements JobQueueAdapter {
  private readonly items =
    new Map<string, JobQueueItem>();

  private configuration:
    JobQueueConfiguration;

  constructor(
    readonly name: string,
    configuration?:
      Partial<JobQueueConfiguration>,
  ) {
    const normalizedName =
      name.trim();

    if (!normalizedName) {
      throw new Error(
        'Job queue name is required.',
      );
    }

    this.configuration = {
      driver: 'memory',
      concurrency:
        Math.max(
          1,
          Math.floor(
            configuration?.concurrency ??
            1,
          ),
        ),
      rateLimitPerSecond:
        configuration
          ?.rateLimitPerSecond,
      defaultPriority:
        configuration
          ?.defaultPriority ??
        'normal',
      paused:
        configuration?.paused ??
        false,
      removeCompletedJobs:
        configuration
          ?.removeCompletedJobs ??
        false,
      removeFailedJobs:
        configuration
          ?.removeFailedJobs ??
        false,
    };
  }

  configure(
    configuration:
      JobQueueConfiguration,
  ): void {
    if (
      configuration.driver !==
      'memory'
    ) {
      throw new Error(
        'InMemoryJobQueueAdapter requires the memory driver.',
      );
    }

    if (
      !Number.isInteger(
        configuration.concurrency,
      ) ||
      configuration.concurrency < 1
    ) {
      throw new Error(
        'Queue concurrency must be at least 1.',
      );
    }

    this.configuration = {
      ...configuration,
    };
  }

  getConfiguration():
    JobQueueConfiguration {
    return {
      ...this.configuration,
    };
  }

  enqueue(
    input:
      EnqueueJobQueueItemInput,
  ): JobQueueItem {
    const id =
      input.id?.trim() ||
      randomUUID();

    if (this.items.has(id)) {
      throw new Error(
        `Queue item ${id} already exists.`,
      );
    }

    const jobId =
      this.requireText(
        input.jobId,
        'jobId',
      );

    const executionId =
      this.requireText(
        input.executionId,
        'executionId',
      );

    const queueName =
      this.requireText(
        input.queueName,
        'queueName',
      );

    if (queueName !== this.name) {
      throw new Error(
        `Queue item targets ${queueName}, but adapter is ${this.name}.`,
      );
    }

    const now =
      new Date().toISOString();

    const delayMs =
      Math.max(
        0,
        Math.floor(
          input.delayMs ?? 0,
        ),
      );

    const item:
      JobQueueItem = {
        id,
        jobId,
        executionId,
        queueName,
        priority:
          input.priority ??
          this.configuration
            .defaultPriority,
        state:
          delayMs > 0
            ? 'delayed'
            : 'queued',
        payload:
          this.cloneRecord(
            input.payload,
          ),
        availableAt:
          new Date(
            Date.now() +
            delayMs,
          ).toISOString(),
        enqueuedAt: now,
        attemptsMade:
          Math.max(
            0,
            Math.floor(
              input.attemptsMade ??
              0,
            ),
          ),
        metadata:
          this.cloneRecord(
            input.metadata ?? {},
          ),
      };

    this.items.set(
      id,
      item,
    );

    return this.cloneItem(
      item,
    );
  }

  dequeue(
    input:
      DequeueJobQueueItemInput,
  ): JobQueueItem | undefined {
    if (this.configuration.paused) {
      return undefined;
    }

    const workerId =
      this.requireText(
        input.workerId,
        'workerId',
      );

    const now =
      this.normalizeDate(
        input.now ??
        new Date().toISOString(),
        'now',
      );

    const runningCount =
      [...this.items.values()]
        .filter(
          (item) =>
            item.state ===
            'running',
        ).length;

    if (
      runningCount >=
      this.configuration
        .concurrency
    ) {
      return undefined;
    }

    const candidate =
      this.getAvailableItems(
        now,
      )[0];

    if (!candidate) {
      return undefined;
    }

    const leaseDurationMs =
      Math.max(
        1,
        Math.floor(
          input.leaseDurationMs,
        ),
      );

    const dequeued:
      JobQueueItem = {
        ...candidate,
        state: 'running',
        dequeuedAt:
          new Date(now)
            .toISOString(),
        workerId,
        leaseExpiresAt:
          new Date(
            now +
            leaseDurationMs,
          ).toISOString(),
      };

    this.items.set(
      candidate.id,
      dequeued,
    );

    return this.cloneItem(
      dequeued,
    );
  }

  peek(
    now:
      string = new Date()
        .toISOString(),
  ): JobQueueItem | undefined {
    if (this.configuration.paused) {
      return undefined;
    }

    const timestamp =
      this.normalizeDate(
        now,
        'now',
      );

    const candidate =
      this.getAvailableItems(
        timestamp,
      )[0];

    return candidate
      ? this.cloneItem(
          candidate,
        )
      : undefined;
  }

  getById(
    itemId: string,
  ): JobQueueItem | undefined {
    const item =
      this.items.get(itemId);

    return item
      ? this.cloneItem(item)
      : undefined;
  }

  list():
    readonly JobQueueItem[] {
    return [
      ...this.items.values(),
    ]
      .sort(
        (left, right) =>
          left.enqueuedAt
            .localeCompare(
              right.enqueuedAt,
            ),
      )
      .map(
        (item) =>
          this.cloneItem(item),
      );
  }

  acknowledge(
    itemId: string,
  ): boolean {
    const item =
      this.items.get(itemId);

    if (!item) {
      return false;
    }

    if (
      item.state !== 'running'
    ) {
      throw new Error(
        `Queue item ${itemId} is not running.`,
      );
    }

    return this.items.delete(
      itemId,
    );
  }

  release(
    itemId: string,
    delayMs = 0,
  ): JobQueueItem {
    const item =
      this.requireItem(
        itemId,
      );

    if (
      item.state !== 'running'
    ) {
      throw new Error(
        `Queue item ${itemId} is not running.`,
      );
    }

    const normalizedDelay =
      Math.max(
        0,
        Math.floor(delayMs),
      );

    const now =
      new Date().toISOString();

    const released:
      JobQueueItem = {
        ...item,
        state:
          normalizedDelay > 0
            ? 'delayed'
            : 'queued',
        availableAt:
          new Date(
            Date.now() +
            normalizedDelay,
          ).toISOString(),
        dequeuedAt:
          undefined,
        workerId:
          undefined,
        leaseExpiresAt:
          undefined,
        attemptsMade:
          item.attemptsMade + 1,
        metadata: {
          ...item.metadata,
          releasedAt: now,
        },
      };

    this.items.set(
      itemId,
      released,
    );

    return this.cloneItem(
      released,
    );
  }

  remove(
    itemId: string,
  ): boolean {
    return this.items.delete(
      itemId,
    );
  }

  pause(): void {
    this.configuration = {
      ...this.configuration,
      paused: true,
    };
  }

  resume(): void {
    this.configuration = {
      ...this.configuration,
      paused: false,
    };
  }

  isPaused(): boolean {
    return this.configuration
      .paused;
  }

  purge(
    input:
      JobQueuePurgeInput = {},
  ): number {
    const states =
      new Set(
        input.states ?? [],
      );

    let removed = 0;

    for (
      const [id, item]
      of this.items
    ) {
      const stateMatch =
        states.size === 0 ||
        states.has(
          item.state,
        );

      const delayedAllowed =
        item.state !==
          'delayed' ||
        input.includeDelayed ===
          true ||
        states.has('delayed');

      const runningAllowed =
        item.state !==
          'running' ||
        input.includeRunning ===
          true ||
        states.has('running');

      if (
        stateMatch &&
        delayedAllowed &&
        runningAllowed
      ) {
        this.items.delete(id);
        removed += 1;
      }
    }

    return removed;
  }

  metrics():
    JobQueueMetrics {
    const items =
      [...this.items.values()];

    const waiting =
      items.filter(
        (item) =>
          item.state ===
            'queued' ||
          item.state ===
            'waiting',
      ).length;

    const delayed =
      items.filter(
        (item) =>
          item.state ===
          'delayed',
      ).length;

    const active =
      items.filter(
        (item) =>
          item.state ===
          'running',
      ).length;

    return {
      waiting,
      delayed,
      active,
      completed: 0,
      failed: 0,
      paused:
        this.configuration
          .paused
          ? 1
          : 0,
      total:
        items.length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.items.clear();
  }

  private getAvailableItems(
    nowTimestamp: number,
  ): readonly JobQueueItem[] {
    return [...this.items.values()]
      .filter(
        (item) => {
          if (
            item.state !==
              'queued' &&
            item.state !==
              'waiting' &&
            item.state !==
              'delayed'
          ) {
            return false;
          }

          return (
            new Date(
              item.availableAt,
            ).getTime() <=
            nowTimestamp
          );
        },
      )
      .sort(
        (left, right) => {
          const priorityDifference =
            JOB_PRIORITY_RANK[
              right.priority
            ] -
            JOB_PRIORITY_RANK[
              left.priority
            ];

          if (
            priorityDifference !==
            0
          ) {
            return priorityDifference;
          }

          const availability =
            left.availableAt
              .localeCompare(
                right.availableAt,
              );

          if (
            availability !== 0
          ) {
            return availability;
          }

          return left.enqueuedAt
            .localeCompare(
              right.enqueuedAt,
            );
        },
      );
  }

  private requireItem(
    itemId: string,
  ): JobQueueItem {
    const item =
      this.items.get(itemId);

    if (!item) {
      throw new Error(
        `Queue item ${itemId} was not found.`,
      );
    }

    return this.cloneItem(item);
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value?.trim();

    if (!normalized) {
      throw new Error(
        `Queue ${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private normalizeDate(
    value: string,
    fieldName: string,
  ): number {
    const timestamp =
      new Date(value).getTime();

    if (
      !Number.isFinite(
        timestamp,
      )
    ) {
      throw new Error(
        `Queue ${fieldName} must be a valid date.`,
      );
    }

    return timestamp;
  }

  private cloneRecord(
    record:
      Readonly<
        Record<string, unknown>
      >,
  ):
    Readonly<Record<string, unknown>> {
    return {
      ...record,
    };
  }

  private cloneItem(
    item:
      JobQueueItem,
  ): JobQueueItem {
    return {
      ...item,
      payload: {
        ...item.payload,
      },
      metadata: {
        ...item.metadata,
      },
    };
  }
}