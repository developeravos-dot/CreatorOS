import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
} from '../contracts';

export interface CapabilityRegistry {
  register(
    manifest: CapabilityManifestContract,
  ): Promise<CapabilityManifestContract>;

  unregister(capabilityId: CapabilityIdentifier): Promise<void>;

  get(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityManifestContract | undefined>;

  has(capabilityId: CapabilityIdentifier): Promise<boolean>;

  list(): Promise<readonly CapabilityManifestContract[]>;
}