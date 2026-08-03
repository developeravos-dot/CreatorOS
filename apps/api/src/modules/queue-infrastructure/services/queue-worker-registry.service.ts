import {
  Inject,
  Injectable,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  QueueWorkerProvider,
  QueueWorkerRegistration,
} from '../contracts';
import {
  QUEUE_WORKER_PROVIDER,
} from '../providers';

@Injectable()
export class QueueWorkerRegistryService
  implements OnApplicationShutdown
{
  constructor(
    @Inject(QUEUE_WORKER_PROVIDER)
    private readonly workerProvider:
      QueueWorkerProvider,
  ) {}

  register(
    registration: QueueWorkerRegistration,
  ): Promise<void> {
    return this.workerProvider.registerWorker(
      registration,
    );
  }

  unregister(
    workerName: string,
  ): Promise<boolean> {
    return this.workerProvider.unregisterWorker(
      workerName,
    );
  }

  list(): QueueWorkerRegistration[] {
    return this.workerProvider.listWorkers();
  }

  has(workerName: string): boolean {
    return this.list().some(
      (worker) =>
        worker.workerName === workerName,
    );
  }

  async onApplicationShutdown(): Promise<void> {
    await this.workerProvider.closeWorkers();
  }
}
