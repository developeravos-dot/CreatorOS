import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createEmptyDistributedWorkerMetrics,
  DistributedWorkerHeartbeat,
  DistributedWorkerRuntimeMetrics,
  DistributedWorkerStatus,
} from '../models';
import {
  DistributedWorkerLeaseService,
} from './distributed-worker-lease.service';

@Injectable()
export class DistributedWorkerHeartbeatService {
  private readonly heartbeats =
    new Map<string, DistributedWorkerHeartbeat>();

  constructor(
    private readonly leases:
      DistributedWorkerLeaseService,
  ) {}

  record(
    workerName: string,
    ownerId: string,
    status: DistributedWorkerStatus,
    metrics: {
      activeJobs?: number;
      completedJobs?: number;
      failedJobs?: number;
      metadata?: Record<string, unknown>;
    } = {},
  ): DistributedWorkerHeartbeat {
    if (
      !this.leases.hasActiveLease(workerName)
    ) {
      throw new NotFoundException(
        `Worker ${workerName} does not have an active lease.`,
      );
    }

    const heartbeat: DistributedWorkerHeartbeat = {
      workerName,
      ownerId,
      status,
      activeJobs: metrics.activeJobs ?? 0,
      completedJobs:
        metrics.completedJobs ?? 0,
      failedJobs: metrics.failedJobs ?? 0,
      lastHeartbeatAt: new Date(),
      metadata: structuredClone(
        metrics.metadata ?? {},
      ),
    };

    this.heartbeats.set(
      workerName,
      this.cloneHeartbeat(heartbeat),
    );

    return this.cloneHeartbeat(heartbeat);
  }

  get(
    workerName: string,
  ): DistributedWorkerHeartbeat | null {
    const heartbeat =
      this.heartbeats.get(workerName);

    return heartbeat
      ? this.cloneHeartbeat(heartbeat)
      : null;
  }

  list(): DistributedWorkerHeartbeat[] {
    return [...this.heartbeats.values()]
      .map((heartbeat) =>
        this.cloneHeartbeat(heartbeat),
      )
      .sort((left, right) =>
        left.workerName.localeCompare(
          right.workerName,
        ),
      );
  }

  getMetrics():
    DistributedWorkerRuntimeMetrics {
    const metrics =
      createEmptyDistributedWorkerMetrics();

    const heartbeats = this.list();
    const leases = this.leases.list();

    metrics.registeredWorkers =
      heartbeats.length;

    metrics.runningWorkers =
      heartbeats.filter(
        (heartbeat) =>
          heartbeat.status === 'running',
      ).length;

    metrics.degradedWorkers =
      heartbeats.filter(
        (heartbeat) =>
          heartbeat.status === 'degraded' ||
          heartbeat.status === 'failed',
      ).length;

    metrics.stoppedWorkers =
      heartbeats.filter(
        (heartbeat) =>
          heartbeat.status === 'stopped',
      ).length;

    metrics.activeLeases = leases.length;

    metrics.activeJobs = heartbeats.reduce(
      (total, heartbeat) =>
        total + heartbeat.activeJobs,
      0,
    );

    metrics.completedJobs = heartbeats.reduce(
      (total, heartbeat) =>
        total + heartbeat.completedJobs,
      0,
    );

    metrics.failedJobs = heartbeats.reduce(
      (total, heartbeat) =>
        total + heartbeat.failedJobs,
      0,
    );

    return metrics;
  }

  remove(workerName: string): boolean {
    return this.heartbeats.delete(workerName);
  }

  clear(): void {
    this.heartbeats.clear();
  }

  private cloneHeartbeat(
    heartbeat: DistributedWorkerHeartbeat,
  ): DistributedWorkerHeartbeat {
    return {
      ...heartbeat,
      lastHeartbeatAt: new Date(
        heartbeat.lastHeartbeatAt,
      ),
      metadata: structuredClone(
        heartbeat.metadata,
      ),
    };
  }
}
