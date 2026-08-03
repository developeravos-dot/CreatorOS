import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  QueueWorkerRegistryService,
} from '../../../../../modules/queue-infrastructure';
import {
  WORKFLOW_EXECUTION_QUEUE,
  WORKFLOW_RETRY_QUEUE,
  WORKFLOW_STEP_QUEUE,
} from '../contracts';
import {
  WorkflowExecutionConsumer,
  WorkflowRetryConsumer,
  WorkflowStepConsumer,
} from '../consumers';
import {
  DistributedWorkerHeartbeatService,
  DistributedWorkerLeaseService,
} from '../runtime';

@Injectable()
export class DistributedWorkerCoordinatorService
  implements
    OnApplicationBootstrap,
    OnApplicationShutdown
{
  readonly ownerId =
    `creatoros-${process.pid}`;

  constructor(
    private readonly registry:
      QueueWorkerRegistryService,
    private readonly workflowConsumer:
      WorkflowExecutionConsumer,
    private readonly stepConsumer:
      WorkflowStepConsumer,
    private readonly retryConsumer:
      WorkflowRetryConsumer,
    private readonly leases:
      DistributedWorkerLeaseService,
    private readonly heartbeats:
      DistributedWorkerHeartbeatService,
  ) {}

  async onApplicationBootstrap():
    Promise<void> {
    await this.registerWorkers();
  }

  async registerWorkers(): Promise<void> {
    await this.registerWorker(
      'distributed-workflow-worker',
      WORKFLOW_EXECUTION_QUEUE,
      2,
      (context) =>
        this.workflowConsumer.consume(
          context as never,
        ),
    );

    await this.registerWorker(
      'distributed-step-worker',
      WORKFLOW_STEP_QUEUE,
      8,
      (context) =>
        this.stepConsumer.consume(
          context as never,
        ),
    );

    await this.registerWorker(
      'distributed-retry-worker',
      WORKFLOW_RETRY_QUEUE,
      4,
      (context) =>
        this.retryConsumer.consume(
          context as never,
        ),
    );
  }

  async onApplicationShutdown():
    Promise<void> {
    for (const worker of this.registry.list()) {
      if (
        worker.workerName.startsWith(
          'distributed-',
        )
      ) {
        await this.registry.unregister(
          worker.workerName,
        );

        this.leases.release(
          worker.workerName,
          this.ownerId,
        );

        this.heartbeats.remove(
          worker.workerName,
        );
      }
    }
  }

  getRuntimeMetrics() {
    return this.heartbeats.getMetrics();
  }

  private async registerWorker(
    workerName: string,
    queueName: string,
    concurrency: number,
    handler: Parameters<
      QueueWorkerRegistryService['register']
    >[0]['handler'],
  ): Promise<void> {
    if (this.registry.has(workerName)) {
      return;
    }

    this.leases.acquire(
      workerName,
      this.ownerId,
      30_000,
    );

    await this.registry.register({
      queueName,
      workerName,
      concurrency,
      handler,
    });

    this.heartbeats.record(
      workerName,
      this.ownerId,
      'running',
    );
  }
}
