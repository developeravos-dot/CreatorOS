import {
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  QueueHealthProvider,
  QueueProviderHealth,
} from '../contracts';
import {
  QueueSnapshot,
  QueueWorkerMetrics,
} from '../models';
import {
  QUEUE_HEALTH_PROVIDER,
} from '../providers';
import {
  QueueWorkerRegistryService,
} from './queue-worker-registry.service';

export interface QueueInfrastructureHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  provider: QueueProviderHealth;
  workers: QueueWorkerMetrics[];
  checkedAt: Date;
}

@Injectable()
export class QueueHealthService {
  constructor(
    @Inject(QUEUE_HEALTH_PROVIDER)
    private readonly healthProvider:
      QueueHealthProvider,
    private readonly workerRegistry:
      QueueWorkerRegistryService,
  ) {}

  async getHealth():
    Promise<QueueInfrastructureHealth> {
    const provider =
      await this.healthProvider.getHealth();

    const workers = this.workerRegistry
      .list()
      .map<QueueWorkerMetrics>(
        (registration) => ({
          workerName: registration.workerName,
          queueName: registration.queueName,
          concurrency:
            registration.concurrency,
          activeJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
          lastHeartbeatAt: null,
          status: 'running',
        }),
      );

    return {
      status: provider.status,
      provider,
      workers,
      checkedAt: new Date(),
    };
  }

  async getSnapshot(): Promise<QueueSnapshot> {
    const health = await this.getHealth();

    return {
      provider: health.provider.provider,
      queues: [],
      workers: health.workers,
      generatedAt: new Date(),
    };
  }
}
