import type {
  CapabilityLifecycleState,
  CapabilityManifestContract,
  CapabilityMetadata,
  CapabilityValidationResultContract,
} from '../../contracts';

export interface CapabilityRegistryRecord {
  readonly manifest: CapabilityManifestContract;
  readonly state: CapabilityLifecycleState;
  readonly validation: CapabilityValidationResultContract;
  readonly registeredAt: string;
  readonly updatedAt: string;
  readonly metadata?: CapabilityMetadata;
}