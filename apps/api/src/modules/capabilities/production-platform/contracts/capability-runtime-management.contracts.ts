import type {
  CapabilityRuntimeInstance,
  CapabilityRuntimeOperationResult,
} from '../../runtime-engine';

export interface RuntimeManagementPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface RuntimeManagementListResult {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    RuntimeManagementPagination;
  readonly instances:
    readonly CapabilityRuntimeInstance[];
}

export interface RuntimeManagementMetrics {
  readonly totalInstances: number;
  readonly createdInstances: number;
  readonly initializingInstances: number;
  readonly runningInstances: number;
  readonly stoppingInstances: number;
  readonly stoppedInstances: number;
  readonly failedInstances: number;
  readonly uniqueCapabilities: number;
  readonly generatedAt: string;
}

export interface RuntimeRestartResult {
  readonly previousInstanceId: string;
  readonly newInstanceId: string;
  readonly capabilityId: string;
  readonly stopResult:
    CapabilityRuntimeOperationResult;
  readonly startResult:
    CapabilityRuntimeOperationResult;
  readonly restartedAt: string;
}

export interface BulkRuntimeStopResult {
  readonly requested: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly results: readonly {
    readonly instanceId: string;
    readonly successful: boolean;
    readonly result?:
      CapabilityRuntimeOperationResult;
    readonly error?: string;
  }[];
  readonly completedAt: string;
}