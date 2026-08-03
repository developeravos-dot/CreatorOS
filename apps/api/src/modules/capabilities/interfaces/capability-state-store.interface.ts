import type {
  CapabilityIdentifier,
  CapabilityLifecycleState,
  CapabilityMetadata,
} from '../contracts';

export interface CapabilityStateSnapshot {
  readonly capabilityId: CapabilityIdentifier;
  readonly state: CapabilityLifecycleState;
  readonly updatedAt: string;
  readonly reason?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface CapabilityStateStore {
  load(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityStateSnapshot | undefined>;

  save(snapshot: CapabilityStateSnapshot): Promise<void>;

  delete(capabilityId: CapabilityIdentifier): Promise<void>;
}