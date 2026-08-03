import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
} from '../contracts';

export interface CapabilityManifestSource {
  discover(): Promise<readonly CapabilityManifestContract[]>;

  findById(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityManifestContract | undefined>;
}