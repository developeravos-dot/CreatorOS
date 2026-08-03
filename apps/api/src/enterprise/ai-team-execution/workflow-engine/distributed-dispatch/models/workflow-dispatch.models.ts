import {
  WorkflowDispatchKind,
} from '../contracts';

export type WorkflowDispatchStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'duplicate';

export interface WorkflowDispatchRecord {
  id: string;
  kind: WorkflowDispatchKind;
  executionId: string;
  workflowId: string;
  stepId: string | null;
  queueName: string;
  queueJobId: string;
  idempotencyKey: string;
  correlationId: string | null;
  status: WorkflowDispatchStatus;
  attempts: number;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface WorkflowDispatchMetrics {
  pending: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
  duplicate: number;
  total: number;
  collectedAt: Date;
}

export function createEmptyWorkflowDispatchMetrics(
  collectedAt = new Date(),
): WorkflowDispatchMetrics {
  return {
    pending: 0,
    queued: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    duplicate: 0,
    total: 0,
    collectedAt,
  };
}
