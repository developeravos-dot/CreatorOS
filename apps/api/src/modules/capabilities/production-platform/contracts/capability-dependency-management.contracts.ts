import type {
  DependencyResolutionStatus,
} from '../../dependency-resolver';

export interface DependencyAnalysisSummary {
  readonly rootCapabilityId: string;
  readonly status:
    DependencyResolutionStatus;
  readonly executable: boolean;
  readonly orderedCapabilities: number;
  readonly totalIssues: number;
  readonly missingDependencies: number;
  readonly optionalMissingDependencies: number;
  readonly incompatibleVersions: number;
  readonly circularDependencies: number;
  readonly generatedAt: string;
}

export interface BulkDependencyAnalysisItemResult {
  readonly rootCapabilityId: string;
  readonly successful: boolean;
  readonly status?:
    DependencyResolutionStatus;
  readonly executable?: boolean;
  readonly orderedCapabilityIds?:
    readonly string[];
  readonly issues?: readonly unknown[];
  readonly error?: string;
}

export interface BulkDependencyAnalysisResult {
  readonly requested: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly resolved: number;
  readonly incompatible: number;
  readonly circular: number;
  readonly pending: number;
  readonly results:
    readonly BulkDependencyAnalysisItemResult[];
  readonly completedAt: string;
}