import type {
  CapabilityDependencyType,
  CapabilityIdentifier,
  CapabilityMetadata,
} from '../../contracts';
import type {
  DependencyGraphEdgeStatus,
} from '../contracts/dependency-resolver.types';

export interface DependencyGraphEdgeSnapshot {
  readonly sourceCapabilityId: CapabilityIdentifier;
  readonly targetCapabilityId: CapabilityIdentifier;
  readonly dependencyType: CapabilityDependencyType;
  readonly versionRange: string;
  readonly status: DependencyGraphEdgeStatus;
  readonly reason?: string;
  readonly metadata?: CapabilityMetadata;
}

export class DependencyGraphEdgeModel {
  private currentStatus: DependencyGraphEdgeStatus;

  constructor(
    readonly sourceCapabilityId: CapabilityIdentifier,
    readonly targetCapabilityId: CapabilityIdentifier,
    readonly dependencyType: CapabilityDependencyType,
    readonly versionRange: string,
    status: DependencyGraphEdgeStatus = 'unresolved',
    readonly reason?: string,
    readonly metadata?: CapabilityMetadata,
  ) {
    this.currentStatus = status;
  }

  get status(): DependencyGraphEdgeStatus {
    return this.currentStatus;
  }

  updateStatus(status: DependencyGraphEdgeStatus): void {
    this.currentStatus = status;
  }

  snapshot(): DependencyGraphEdgeSnapshot {
    return {
      sourceCapabilityId: this.sourceCapabilityId,
      targetCapabilityId: this.targetCapabilityId,
      dependencyType: this.dependencyType,
      versionRange: this.versionRange,
      status: this.currentStatus,
      reason: this.reason,
      metadata: this.metadata,
    };
  }
}