export const DISTRIBUTED_EXECUTION_STATES = [
  'pending',
  'leased',
  'running',
  'succeeded',
  'failed',
  'retrying',
  'reassigned',
  'cancelled',
] as const;

export type DistributedExecutionState =
  (typeof DISTRIBUTED_EXECUTION_STATES)[number];

export interface ExecutionTraceContext {
  readonly correlationId: string;
  readonly traceId: string;
  readonly parentTraceId: string | null;
}

export interface DistributedExecutionRequest {
  readonly executionId: string;
  readonly workflowId: string;
  readonly stepId: string;
  readonly requiredCapabilities: readonly string[];
  readonly trace: ExecutionTraceContext;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly createdAt?: Date;
}

export interface DistributedWorkerRegistration {
  readonly workerId: string;
  readonly nodeId: string;
  readonly capabilities: readonly string[];
  readonly maximumConcurrency: number;
  readonly registeredAt?: Date;
}

export interface ExecutionLeaseRequest {
  readonly executionId: string;
  readonly workerId: string;
  readonly leaseDurationMs: number;
  readonly now?: Date;
}
