import type {
  CapabilityHealthReportContract,
  CapabilityIdentifier,
  CapabilityLifecycleState,
  CapabilityManifestContract,
  CapabilityMetadata,
  CapabilityVersion,
} from '../../contracts';
import type {
  CapabilityExecutionContext,
  CapabilityProvider,
} from '../../interfaces';

export type CapabilityRuntimeInstanceStatus =
  | 'created'
  | 'initializing'
  | 'ready'
  | 'running'
  | 'suspended'
  | 'stopping'
  | 'stopped'
  | 'failed';

export interface CapabilityRuntimeInstance {
  readonly instanceId: string;
  readonly capabilityId: CapabilityIdentifier;
  readonly capabilityVersion: CapabilityVersion;
  readonly manifest: CapabilityManifestContract;
  readonly provider: CapabilityProvider;
  readonly context: CapabilityExecutionContext;
  readonly status: CapabilityRuntimeInstanceStatus;
  readonly lifecycleState: CapabilityLifecycleState;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastError?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface CapabilityRuntimeStartRequest {
  readonly capabilityId: CapabilityIdentifier;
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface CapabilityRuntimeStopRequest {
  readonly instanceId: string;
  readonly reason?: string;
  readonly correlationId?: string;
  readonly actorId?: string;
}

export interface CapabilityRuntimeOperationResult {
  readonly instanceId: string;
  readonly capabilityId: CapabilityIdentifier;
  readonly previousStatus: CapabilityRuntimeInstanceStatus;
  readonly currentStatus: CapabilityRuntimeInstanceStatus;
  readonly lifecycleState: CapabilityLifecycleState;
  readonly changed: boolean;
  readonly completedAt: string;
  readonly message?: string;
}

export interface CapabilityRuntimeHealthResult {
  readonly instanceId: string;
  readonly capabilityId: CapabilityIdentifier;
  readonly report: CapabilityHealthReportContract;
}