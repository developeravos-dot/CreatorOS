import type {
  CapabilityIdentifier,
  CapabilityMetadata,
} from '../../contracts';
import type {
  DependencyResolutionIssue,
} from '../contracts';

export type DependencyResolutionPlanStepType =
  | 'validate'
  | 'install'
  | 'initialize'
  | 'activate';

export interface DependencyResolutionPlanStep {
  readonly sequence: number;
  readonly capabilityId: CapabilityIdentifier;
  readonly type: DependencyResolutionPlanStepType;
  readonly dependsOn: readonly CapabilityIdentifier[];
}

export interface DependencyResolutionPlanSnapshot {
  readonly rootCapabilityId: CapabilityIdentifier;
  readonly executable: boolean;
  readonly orderedCapabilityIds:
    readonly CapabilityIdentifier[];
  readonly steps: readonly DependencyResolutionPlanStep[];
  readonly issues: readonly DependencyResolutionIssue[];
  readonly generatedAt: string;
  readonly metadata?: CapabilityMetadata;
}

export class DependencyResolutionPlanModel {
  constructor(
    readonly rootCapabilityId: CapabilityIdentifier,
    readonly orderedCapabilityIds:
      readonly CapabilityIdentifier[],
    readonly steps:
      readonly DependencyResolutionPlanStep[],
    readonly issues:
      readonly DependencyResolutionIssue[],
    readonly generatedAt = new Date().toISOString(),
    readonly metadata?: CapabilityMetadata,
  ) {}

  get executable(): boolean {
    return !this.issues.some(
      (issue) =>
        issue.code === 'DEPENDENCY_MISSING' ||
        issue.code ===
          'DEPENDENCY_VERSION_INCOMPATIBLE' ||
        issue.code === 'DEPENDENCY_CIRCULAR',
    );
  }

  snapshot(): DependencyResolutionPlanSnapshot {
    return {
      rootCapabilityId: this.rootCapabilityId,
      executable: this.executable,
      orderedCapabilityIds:
        this.orderedCapabilityIds,
      steps: this.steps,
      issues: this.issues,
      generatedAt: this.generatedAt,
      metadata: this.metadata,
    };
  }
}