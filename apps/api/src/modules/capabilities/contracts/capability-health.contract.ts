import type {
  CapabilityHealthStatus,
  CapabilityIdentifier,
  CapabilityMetadata,
  CapabilityVersion,
} from './capability.types';

export interface CapabilityHealthCheckContract {
  readonly name: string;
  readonly status: CapabilityHealthStatus;
  readonly message?: string;
  readonly durationMs?: number;
  readonly checkedAt: string;
  readonly metadata?: CapabilityMetadata;
}

export interface CapabilityHealthReportContract {
  readonly capabilityId: CapabilityIdentifier;
  readonly version: CapabilityVersion;
  readonly status: CapabilityHealthStatus;
  readonly checks: readonly CapabilityHealthCheckContract[];
  readonly generatedAt: string;
}