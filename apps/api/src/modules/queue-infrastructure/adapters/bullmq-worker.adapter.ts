import {
  Job,
  Worker,
  WorkerOptions,
} from 'bullmq';
import {
  QueueInfrastructureConfiguration,
} from '../configuration';
import {
  QueueWorkerContext,
  QueueWorkerProvider,
  QueueWorkerRegistration,
} from '../contracts';

export interface BullMqWorkerLike {
  name: string;
  close(force?: boolean): Promise<void>;
  pause(doNotWaitActive?: boolean): Promise<void>;
  resume(): void;
  isRunning(): boolean;
}

export type BullMqWorkerFactory = (
  queueName: string,
  processor: (
    job: Job,
  ) => Promise<unknown>,
  options: WorkerOptions,
) => BullMqWorkerLike;

interface StoredWorker {
  registration: QueueWorkerRegistration;
  worker: BullMqWorkerLike;
}

export class BullMqWorkerAdapter
  implements QueueWorkerProvider
{
  private readonly workers =
    new Map<string, StoredWorker>();

  private closed = false;

  constructor(
    private readonly configuration:
      QueueInfrastructureConfiguration,
    private readonly workerFactory:
      BullMqWorkerFactory =
        BullMqWorkerAdapter.createWorker,
  ) {}

  async registerWorker(
    registration: QueueWorkerRegistration,
  ): Promise<void> {
    this.assertOpen();
    this.validateRegistration(registration);

    if (
      this.workers.has(registration.workerName)
    ) {
      throw new Error(
        `Queue worker ${registration.workerName} is already registered.`,
      );
    }

    const worker = this.workerFactory(
      this.namespacedQueueName(
        registration.queueName,
      ),
      async (job) => {
        const context: QueueWorkerContext = {
          jobId: String(job.id ?? ''),
          queueName: registration.queueName,
          jobName: job.name,
          payload:
            typeof job.data === 'object' &&
            job.data !== null
              ? structuredClone(job.data)
              : {},
          attempt: job.attemptsMade + 1,
          metadata: {},
        };

        return registration.handler(context);
      },
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
        concurrency: registration.concurrency,
        lockDuration:
          this.configuration.worker.lockDurationMs,
        stalledInterval:
          this.configuration.worker
            .stalledIntervalMs,
        maxStalledCount:
          this.configuration.worker
            .maxStalledCount,
      },
    );

    this.workers.set(
      registration.workerName,
      {
        registration: {
          ...registration,
        },
        worker,
      },
    );
  }

  async unregisterWorker(
    workerName: string,
  ): Promise<boolean> {
    this.assertOpen();

    const stored = this.workers.get(workerName);

    if (!stored) {
      return false;
    }

    await stored.worker.close();

    return this.workers.delete(workerName);
  }

  listWorkers(): QueueWorkerRegistration[] {
    return [...this.workers.values()]
      .map(({ registration }) => ({
        ...registration,
      }))
      .sort((left, right) =>
        left.workerName.localeCompare(
          right.workerName,
        ),
      );
  }

  async closeWorkers(): Promise<void> {
    if (this.closed) {
      return;
    }

    this.closed = true;

    const workers = [...this.workers.values()];

    this.workers.clear();

    await Promise.all(
      workers.map(({ worker }) =>
        worker.close(),
      ),
    );
  }

  getWorker(
    workerName: string,
  ): BullMqWorkerLike | null {
    return (
      this.workers.get(workerName)?.worker ??
      null
    );
  }

  private validateRegistration(
    registration: QueueWorkerRegistration,
  ): void {
    if (!registration.queueName?.trim()) {
      throw new TypeError(
        'Worker queueName is required.',
      );
    }

    if (!registration.workerName?.trim()) {
      throw new TypeError(
        'Worker workerName is required.',
      );
    }

    if (
      !Number.isSafeInteger(
        registration.concurrency,
      ) ||
      registration.concurrency < 1
    ) {
      throw new RangeError(
        'Worker concurrency must be a positive integer.',
      );
    }

    if (
      typeof registration.handler !== 'function'
    ) {
      throw new TypeError(
        'Worker handler must be a function.',
      );
    }
  }

  private namespacedQueueName(
    queueName: string,
  ): string {
    return `${this.configuration.namespace}:${queueName}`;
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new Error(
        'The BullMQ worker provider is closed.',
      );
    }
  }

  static createWorker(
    queueName: string,
    processor: (
      job: Job,
    ) => Promise<unknown>,
    options: WorkerOptions,
  ): BullMqWorkerLike {
    return new Worker(
      queueName,
      processor,
      options,
    ) as unknown as BullMqWorkerLike;
  }
}
