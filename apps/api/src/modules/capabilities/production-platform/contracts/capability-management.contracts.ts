import type {
  CapabilityManifestContract,
} from '../../contracts';
import type {
  CapabilityRegistryRecord,
} from '../../registry-engine';

export type CapabilityManagementSortField =
  | 'id'
  | 'name'
  | 'domain'
  | 'version'
  | 'registeredAt'
  | 'updatedAt';

export type CapabilityManagementSortDirection =
  | 'asc'
  | 'desc';

export interface CapabilityManagementPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface CapabilityManagementRegistryResult {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    CapabilityManagementPagination;
  readonly records:
    readonly CapabilityRegistryRecord[];
}

export interface CapabilityManifestValidationResult {
  readonly capabilityId?: string;
  readonly valid: boolean;
  readonly issues: readonly {
    readonly code: string;
    readonly message: string;
    readonly path?: string;
  }[];
  readonly manifest?:
    CapabilityManifestContract;
  readonly validatedAt: string;
}

export interface BulkCapabilityOperationResult {
  readonly requested: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly results: readonly {
    readonly capabilityId: string;
    readonly successful: boolean;
    readonly error?: string;
  }[];
  readonly completedAt: string;
}