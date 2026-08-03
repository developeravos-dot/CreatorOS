import type { CapabilityDependencyContract } from './capability-dependency.contract';
import type { CapabilityEntrypointContract } from './capability-entrypoint.contract';
import type { CapabilityResourcePolicyContract } from './capability-resource-policy.contract';
import type {
  CapabilityDomain,
  CapabilityIdentifier,
  CapabilityKind,
  CapabilityManifestSchemaVersion,
  CapabilityMetadata,
  CapabilityTag,
  CapabilityVersion,
} from './capability.types';

export interface CapabilityPublisherContract {
  readonly name: string;
  readonly organization?: string;
  readonly email?: string;
  readonly website?: string;
}

export interface CapabilityCompatibilityContract {
  readonly creatorOsVersion?: string;
  readonly nodeVersion?: string;
  readonly operatingSystems?: readonly string[];
  readonly architectures?: readonly string[];
}

export interface CapabilityManifestContract {
  readonly schemaVersion: CapabilityManifestSchemaVersion;

  readonly id: CapabilityIdentifier;
  readonly name: string;
  readonly version: CapabilityVersion;
  readonly description: string;

  readonly domain: CapabilityDomain;
  readonly kind: CapabilityKind;

  readonly publisher: CapabilityPublisherContract;
  readonly entrypoint: CapabilityEntrypointContract;

  readonly dependencies: readonly CapabilityDependencyContract[];
  readonly policy: CapabilityResourcePolicyContract;

  readonly compatibility?: CapabilityCompatibilityContract;
  readonly tags?: readonly CapabilityTag[];
  readonly metadata?: CapabilityMetadata;
}