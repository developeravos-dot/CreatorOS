import type {
  DistributedExecutionRequest,
  DistributedExecutionState,
  DistributedWorkerRegistration,
  ExecutionTraceContext,
} from '../contracts';

export interface DistributedExecutionRecord {
  readonly executionId: string;
  readonly workflowId: string;
  readonly stepId: string;
  readonly state: DistributedExecutionState;
  readonly assignedWorkerId: string | null;
  readonly fencingToken: number | null;
  readonly attempt: number;
  readonly trace: ExecutionTraceContext;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly requiredCapabilities: readonly string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly startedAt: Date | null;
  readonly completedAt: Date | null;
  readonly lastError: string | null;
}

export interface DistributedWorkerRuntimeRecord {
  readonly workerId: string;
  readonly nodeId: string;
  readonly capabilities: readonly string[];
  readonly maximumConcurrency: number;
  readonly activeExecutionIds: readonly string[];
  readonly state: 'active' | 'draining' | 'offline';
  readonly registeredAt: Date;
  readonly lastHeartbeatAt: Date;
}

export interface DistributedExecutionLease {
  readonly executionId: string;
  readonly workerId: string;
  readonly fencingToken: number;
  readonly acquiredAt: Date;
  readonly expiresAt: Date;
  readonly releasedAt: Date | null;
}

export const createDistributedExecutionRecord = (
  request: DistributedExecutionRequest,
): DistributedExecutionRecord => {
  const now = new Date(request.createdAt ?? new Date());

  return {
    executionId: request.executionId,
    workflowId: request.workflowId,
    stepId: request.stepId,
    state: 'pending',
    assignedWorkerId: null,
    fencingToken: null,
    attempt: 0,
    trace: {
      correlationId: request.trace.correlationId,
      traceId: request.trace.traceId,
      parentTraceId: request.trace.parentTraceId,
    },
    payload: structuredClone(request.payload),
    requiredCapabilities: [...request.requiredCapabilities],
    createdAt: now,
    updatedAt: now,
    startedAt: null,
    completedAt: null,
    lastError: null,
  };
};

export const createDistributedWorkerRuntimeRecord = (
  registration: DistributedWorkerRegistration,
): DistributedWorkerRuntimeRecord => {
  const now = new Date(
    registration.registeredAt ?? new Date(),
  );

  return {
    workerId: registration.workerId,
    nodeId: registration.nodeId,
    capabilities: [...registration.capabilities],
    maximumConcurrency: registration.maximumConcurrency,
    activeExecutionIds: [],
    state: 'active',
    registeredAt: now,
    lastHeartbeatAt: now,
  };
};
