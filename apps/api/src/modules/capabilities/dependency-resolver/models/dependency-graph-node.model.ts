import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
  CapabilityMetadata,
  CapabilityVersion,
} from '../../contracts';

export interface DependencyGraphNodeSnapshot {
  readonly capabilityId: CapabilityIdentifier;
  readonly version: CapabilityVersion;
  readonly manifest: CapabilityManifestContract;
  readonly enabled: boolean;
  readonly metadata?: CapabilityMetadata;
}

export class DependencyGraphNodeModel {
  constructor(
    readonly capabilityId: CapabilityIdentifier,
    readonly version: CapabilityVersion,
    readonly manifest: CapabilityManifestContract,
    readonly enabled = true,
    readonly metadata?: CapabilityMetadata,
  ) {}

  snapshot(): DependencyGraphNodeSnapshot {
    return {
      capabilityId: this.capabilityId,
      version: this.version,
      manifest: this.manifest,
      enabled: this.enabled,
      metadata: this.metadata,
    };
  }
}