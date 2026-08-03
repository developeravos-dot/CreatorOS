import type {
  CapabilityManifestContract,
} from '../../contracts';
import type {
  CapabilityRegistryRecord,
} from '../../registry-engine';

export interface CapabilityRegistryDomainSummary {
  readonly domain: string;
  readonly capabilities: number;
}

export interface CapabilityRegistryStateSummary {
  readonly state: string;
  readonly capabilities: number;
}

export interface CapabilityRegistryVersionSummary {
  readonly version: string;
  readonly capabilities: number;
}

export interface CapabilityRegistryAdministrationOverview {
  readonly totalCapabilities: number;
  readonly validCapabilities: number;
  readonly invalidCapabilities: number;
  readonly domains:
    readonly CapabilityRegistryDomainSummary[];
  readonly states:
    readonly CapabilityRegistryStateSummary[];
  readonly versions:
    readonly CapabilityRegistryVersionSummary[];
  readonly oldestRegistration?: string;
  readonly newestRegistration?: string;
  readonly generatedAt: string;
}

export interface CapabilityRegistryConsistencyReport {
  readonly consistent: boolean;
  readonly manifestCount: number;
  readonly recordCount: number;
  readonly duplicateCapabilityIds:
    readonly string[];
  readonly missingManifestRecords:
    readonly string[];
  readonly invalidRecords:
    readonly {
      readonly capabilityId: string;
      readonly issues: number;
    }[];
  readonly checkedAt: string;
}

export interface CapabilityRegistrySnapshot {
  readonly schemaVersion: '1.0.0';
  readonly exportedAt: string;
  readonly count: number;
  readonly manifests:
    readonly CapabilityManifestContract[];
  readonly records:
    readonly CapabilityRegistryRecord[];
}

export interface CapabilityRegistryBulkItemResult {
  readonly capabilityId: string;
  readonly successful: boolean;
  readonly error?: string;
}

export interface CapabilityRegistryBulkOperationResult {
  readonly requested: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly results:
    readonly CapabilityRegistryBulkItemResult[];
  readonly completedAt: string;
}

export interface CapabilityRegistryClearResult {
  readonly cleared: true;
  readonly removedCapabilities: number;
  readonly stoppedRuntimeInstances: number;
  readonly completedAt: string;
}