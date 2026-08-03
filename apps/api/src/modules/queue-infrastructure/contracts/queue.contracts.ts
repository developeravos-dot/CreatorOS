export type QueueJobStatus =
  | 'waiting'
  | 'delayed'
  | 'active'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'cancelled';

export type QueueProviderKind =
  | 'memory'
  | 'bullmq';

export type QueuePriority =
  | 'critical'
  | 'high'
  | 'normal'
  | 'low';

export interface QueueJobOptions {
  jobId?: string;
  delayMs?: number;
  priority?: QueuePriority;
  attempts?: number;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
  backoff?: QueueBackoffOptions;
  metadata?: Record<string, unknown>;
}

export interface QueueBackoffOptions {
  type: 'fixed' | 'exponential';
  delayMs: number;
}

export interface QueueJob<TPayload = Record<string, unknown>> {
  id: string;
  queueName: string;
  name: string;
  payload: TPayload;
  status: QueueJobStatus;
  attemptsMade: number;
  maxAttempts: number;
  priority: QueuePriority;
  createdAt: Date;
  processedAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  error: QueueJobError | null;
  metadata: Record<string, unknown>;
}

export interface QueueJobError {
  name: string;
  message: string;
  code?: string;
  stack?: string;
  retryable: boolean;
}

export interface QueueWorkerContext<
  TPayload = Record<string, unknown>,
> {
  jobId: string;
  queueName: string;
  jobName: string;
  payload: TPayload;
  attempt: number;
  metadata: Record<string, unknown>;
}

export type QueueWorkerHandler<
  TPayload = Record<string, unknown>,
  TResult = unknown,
> = (
  context: QueueWorkerContext<TPayload>,
) => Promise<TResult> | TResult;

export interface QueueWorkerRegistration {
  queueName: string;
  workerName: string;
  concurrency: number;
  handler: QueueWorkerHandler;
}

export interface QueueProvider {
  readonly kind: QueueProviderKind;

  add<TPayload extends Record<string, unknown>>(
    queueName: string,
    jobName: string,
    payload: TPayload,
    options?: QueueJobOptions,
  ): Promise<QueueJob<TPayload>>;

  getJob(
    queueName: string,
    jobId: string,
  ): Promise<QueueJob | null>;

  removeJob(
    queueName: string,
    jobId: string,
  ): Promise<boolean>;

  pauseQueue(queueName: string): Promise<void>;

  resumeQueue(queueName: string): Promise<void>;

  drainQueue(queueName: string): Promise<number>;

  close(): Promise<void>;
}

export interface QueueWorkerProvider {
  registerWorker(
    registration: QueueWorkerRegistration,
  ): Promise<void>;

  unregisterWorker(
    workerName: string,
  ): Promise<boolean>;

  listWorkers(): QueueWorkerRegistration[];

  closeWorkers(): Promise<void>;
}

export interface QueueHealthProvider {
  getHealth(): Promise<QueueProviderHealth>;
}

export interface QueueProviderHealth {
  provider: QueueProviderKind;
  status: 'healthy' | 'degraded' | 'unhealthy';
  connected: boolean;
  latencyMs: number;
  checkedAt: Date;
  details: Record<string, unknown>;
}
