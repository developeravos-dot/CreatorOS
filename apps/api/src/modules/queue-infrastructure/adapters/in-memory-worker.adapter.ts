import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  QueueWorkerProvider,
  QueueWorkerRegistration,
} from '../contracts';

export class InMemoryWorkerAdapter
  implements QueueWorkerProvider
{
  private readonly workers =
    new Map<string, QueueWorkerRegistration>();

  private closed = false;

  async registerWorker(
    registration: QueueWorkerRegistration,
  ): Promise<void> {
    this.assertOpen();
    this.validateRegistration(registration);

    if (
      this.workers.has(registration.workerName)
    ) {
      throw new ConflictException(
        `Queue worker ${registration.workerName} is already registered.`,
      );
    }

    this.workers.set(
      registration.workerName,
      this.cloneRegistration(registration),
    );
  }

  async unregisterWorker(
    workerName: string,
  ): Promise<boolean> {
    this.assertOpen();

    return this.workers.delete(workerName);
  }

  listWorkers(): QueueWorkerRegistration[] {
    return [...this.workers.values()]
      .sort((left, right) =>
        left.workerName.localeCompare(
          right.workerName,
        ),
      )
      .map((registration) =>
        this.cloneRegistration(registration),
      );
  }

  async closeWorkers(): Promise<void> {
    this.closed = true;
    this.workers.clear();
  }

  async execute<TResult = unknown>(
    workerName: string,
    context: Parameters<
      QueueWorkerRegistration['handler']
    >[0],
  ): Promise<TResult> {
    this.assertOpen();

    const registration =
      this.workers.get(workerName);

    if (!registration) {
      throw new NotFoundException(
        `Queue worker ${workerName} was not found.`,
      );
    }

    return await registration.handler(
      this.cloneContext(context),
    ) as TResult;
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

  private cloneRegistration(
    registration: QueueWorkerRegistration,
  ): QueueWorkerRegistration {
    return {
      ...registration,
    };
  }

  private cloneContext(
    context: Parameters<
      QueueWorkerRegistration['handler']
    >[0],
  ): Parameters<
    QueueWorkerRegistration['handler']
  >[0] {
    return {
      ...context,
      payload: this.cloneRecord(
        context.payload,
      ),
      metadata: this.cloneRecord(
        context.metadata,
      ),
    };
  }

  private cloneRecord<
    TValue extends Record<string, unknown>,
  >(
    value: TValue,
  ): TValue {
    return structuredClone(value);
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new Error(
        'The in-memory worker provider is closed.',
      );
    }
  }
}
