import type {
  CapabilityDependencyType,
  CapabilityIdentifier,
  CapabilityMetadata,
} from './capability.types';

export interface CapabilityDependencyContract {
  readonly capabilityId: CapabilityIdentifier;
  readonly versionRange: string;
  readonly type: CapabilityDependencyType;
  readonly reason?: string;
  readonly metadata?: CapabilityMetadata;
}