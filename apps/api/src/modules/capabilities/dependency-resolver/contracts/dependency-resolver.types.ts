import type {
  CapabilityDependencyType,
  CapabilityIdentifier,
  CapabilityManifestContract,
  CapabilityMetadata,
  CapabilityVersion,
} from '../../contracts';

export type DependencyResolutionStatus =
  | 'pending'
  | 'resolved'
  | 'missing'
  | 'incompatible'
  | 'circular'
  | 'skipped';

export type DependencyGraphEdgeStatus =
  | 'unresolved'
  | 'resolved'
  | 'missing'
  | 'incompatible'
  | 'optional-missing';

export interface DependencyResolverCatalogEntry {
  readonly capabilityId: CapabilityIdentifier;
  readonly version: CapabilityVersion;
  readonly manifest: CapabilityManifestContract;
  readonly enabled?: boolean;
  readonly metadata?: CapabilityMetadata;
}

export interface DependencyResolutionRequest {
  readonly rootCapabilityId: CapabilityIdentifier;
  readonly catalog: readonly DependencyResolverCatalogEntry[];
  readonly includeOptional?: boolean;
  readonly enforcePeerDependencies?: boolean;
  readonly metadata?: CapabilityMetadata;
}

export interface DependencyResolutionIssue {
  readonly code: string;
  readonly message: string;
  readonly capabilityId: CapabilityIdentifier;
  readonly dependencyId?: CapabilityIdentifier;
  readonly dependencyType?: CapabilityDependencyType;
  readonly requiredVersionRange?: string;
  readonly availableVersion?: CapabilityVersion;
  readonly path?: readonly CapabilityIdentifier[];
}

export interface DependencyResolutionResult {
  readonly rootCapabilityId: CapabilityIdentifier;
  readonly status: DependencyResolutionStatus;
  readonly orderedCapabilityIds: readonly CapabilityIdentifier[];
  readonly issues: readonly DependencyResolutionIssue[];
  readonly resolvedAt: string;
}