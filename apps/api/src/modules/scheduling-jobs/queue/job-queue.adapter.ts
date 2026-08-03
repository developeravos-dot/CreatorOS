import type {
  JobPriority,
  JobQueueConfiguration,
  JobQueueMetrics,
  JobState,
} from '../models';

export interface JobQueueItem {
  readonly id: string;
  readonly jobId: string;
  readonly executionId: string;
  readonly queueName: string;
  readonly priority:
    JobPriority;
  readonly state:
    Extract<
      JobState,
      | 'queued'
      | 'waiting'
      | 'delayed'
      | 'running'
    >;
  readonly payload:
    Readonly<Record<string, unknown>>;
  readonly availableAt: string;
  readonly enqueuedAt: string;
  readonly dequeuedAt?: string;
  readonly workerId?: string;
  readonly leaseExpiresAt?: string;
  readonly attemptsMade: number;
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface EnqueueJobQueueItemInput {
  readonly id?: string;
  readonly jobId: string;
  readonly executionId: string;
  readonly queueName: string;
  readonly priority:
    JobPriority;
  readonly payload:
    Readonly<Record<string, unknown>>;
  readonly delayMs?: number;
  readonly attemptsMade?: number;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
}

export interface DequeueJobQueueItemInput {
  readonly workerId: string;
  readonly leaseDurationMs: number;
  readonly now?: string;
}

export interface JobQueuePurgeInput {
  readonly states?:
    readonly JobQueueItem['state'][];
  readonly includeDelayed?: boolean;
  readonly includeRunning?: boolean;
}

export interface JobQueueAdapter {
  readonly name: string;

  configure(
    configuration:
      JobQueueConfiguration,
  ): void;

  getConfiguration():
    JobQueueConfiguration;

  enqueue(
    input:
      EnqueueJobQueueItemInput,
  ): JobQueueItem;

  dequeue(
    input:
      DequeueJobQueueItemInput,
  ): JobQueueItem | undefined;

  peek(
    now?: string,
  ): JobQueueItem | undefined;

  getById(
    itemId: string,
  ): JobQueueItem | undefined;

  list():
    readonly JobQueueItem[];

  acknowledge(
    itemId: string,
  ): boolean;

  release(
    itemId: string,
    delayMs?: number,
  ): JobQueueItem;

  remove(
    itemId: string,
  ): boolean;

  pause(): void;

  resume(): void;

  isPaused(): boolean;

  purge(
    input?:
      JobQueuePurgeInput,
  ): number;

  metrics():
    JobQueueMetrics;

  clear(): void;
}