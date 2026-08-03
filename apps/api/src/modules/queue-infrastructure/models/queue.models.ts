import {
  QueueJobStatus,
  QueuePriority,
  QueueProviderKind,
} from '../contracts';

export interface QueueMetrics {
  queueName: string;
  waiting: number;
  delayed: number;
  active: number;
  completed: number;
  failed: number;
  paused: boolean;
  throughputPerMinute: number;
  averageProcessingTimeMs: number;
  collectedAt: Date;
}

export interface QueueWorkerMetrics {
  workerName: string;
  queueName: string;
  concurrency: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  lastHeartbeatAt: Date | null;
  status: 'starting' | 'running' | 'paused' | 'stopped' | 'failed';
}

export interface QueueEvent {
  id: string;
  queueName: string;
  jobId?: string;
  type:
    | 'job.added'
    | 'job.active'
    | 'job.completed'
    | 'job.failed'
    | 'job.delayed'
    | 'job.removed'
    | 'queue.paused'
    | 'queue.resumed'
    | 'worker.registered'
    | 'worker.unregistered'
    | 'provider.connected'
    | 'provider.disconnected';
  timestamp: Date;
  payload: Record<string, unknown>;
}

export interface QueueSnapshot {
  provider: QueueProviderKind;
  queues: QueueMetrics[];
  workers: QueueWorkerMetrics[];
  generatedAt: Date;
}

export interface QueueJobSummary {
  id: string;
  queueName: string;
  jobName: string;
  status: QueueJobStatus;
  priority: QueuePriority;
  attemptsMade: number;
  maxAttempts: number;
  createdAt: Date;
  completedAt: Date | null;
  failedAt: Date | null;
}

export function createEmptyQueueMetrics(
  queueName: string,
  collectedAt = new Date(),
): QueueMetrics {
  return {
    queueName,
    waiting: 0,
    delayed: 0,
    active: 0,
    completed: 0,
    failed: 0,
    paused: false,
    throughputPerMinute: 0,
    averageProcessingTimeMs: 0,
    collectedAt,
  };
}
