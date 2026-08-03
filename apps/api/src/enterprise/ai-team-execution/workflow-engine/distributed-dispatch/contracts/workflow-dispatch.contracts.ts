import {
  QueuePriority,
} from '../../../../../modules/queue-infrastructure';

export const WORKFLOW_EXECUTION_QUEUE =
  'workflow-execution';

export const WORKFLOW_STEP_QUEUE =
  'workflow-step-execution';

export const WORKFLOW_RETRY_QUEUE =
  'workflow-retry';

export type WorkflowDispatchKind =
  | 'workflow'
  | 'step'
  | 'retry';

export interface WorkflowExecutionJobPayload
  extends Record<string, unknown> {
  dispatchId?: string;
  executionId: string;
  workflowId: string;
  requestedAt: string;
  requestedBy?: string;
  maxSteps?: number;
  stopOnFailure?: boolean;
  correlationId?: string;
}

export interface WorkflowStepJobPayload
  extends Record<string, unknown> {
  dispatchId?: string;
  executionId: string;
  workflowId: string;
  stepId: string;
  attempt: number;
  requestedAt: string;
  correlationId?: string;
}

export interface WorkflowRetryJobPayload
  extends Record<string, unknown> {
  dispatchId?: string;
  executionId: string;
  workflowId: string;
  stepId: string;
  retryAttempt: number;
  scheduleId: string;
  requestedAt: string;
  correlationId?: string;
}

export interface WorkflowDispatchOptions {
  delayMs?: number;
  priority?: QueuePriority;
  attempts?: number;
  idempotencyKey?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowDispatchRequest {
  kind: WorkflowDispatchKind;
  payload:
    | WorkflowExecutionJobPayload
    | WorkflowStepJobPayload
    | WorkflowRetryJobPayload;
  options?: WorkflowDispatchOptions;
}

export interface WorkflowDispatchResult {
  dispatchId: string;
  queueName: string;
  jobId: string;
  kind: WorkflowDispatchKind;
  status: 'queued' | 'duplicate';
  idempotencyKey: string;
  createdAt: Date;
}

