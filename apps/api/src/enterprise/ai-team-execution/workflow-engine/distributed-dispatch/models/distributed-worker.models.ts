export type DistributedWorkerStatus =
  | 'registered'
  | 'starting'
  | 'running'
  | 'degraded'
  | 'stopped'
  | 'failed';

export interface DistributedWorkerLease {
  workerName: string;
  ownerId: string;
  acquiredAt: Date;
  renewedAt: Date;
  expiresAt: Date;
  leaseDurationMs: number;
}

export interface DistributedWorkerHeartbeat {
  workerName: string;
  ownerId: string;
  status: DistributedWorkerStatus;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  lastHeartbeatAt: Date;
  metadata: Record<string, unknown>;
}

export interface DistributedWorkerRuntimeMetrics {
  registeredWorkers: number;
  runningWorkers: number;
  degradedWorkers: number;
  stoppedWorkers: number;
  activeLeases: number;
  expiredLeases: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  collectedAt: Date;
}

export function createEmptyDistributedWorkerMetrics(
  collectedAt = new Date(),
): DistributedWorkerRuntimeMetrics {
  return {
    registeredWorkers: 0,
    runningWorkers: 0,
    degradedWorkers: 0,
    stoppedWorkers: 0,
    activeLeases: 0,
    expiredLeases: 0,
    activeJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    collectedAt,
  };
}
