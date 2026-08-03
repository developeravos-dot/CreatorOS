import type {
  CapabilityMetadata,
  CapabilityPermission,
} from './capability.types';

export interface CapabilityResourceLimitsContract {
  readonly timeoutMs?: number;
  readonly maxConcurrency?: number;
  readonly maxMemoryMb?: number;
  readonly maxRetries?: number;
}

export interface CapabilitySecurityPolicyContract {
  readonly permissions: readonly CapabilityPermission[];
  readonly networkAccess?: boolean;
  readonly filesystemAccess?: boolean;
  readonly environmentAccess?: boolean;
  readonly processAccess?: boolean;
  readonly metadata?: CapabilityMetadata;
}

export interface CapabilityResourcePolicyContract {
  readonly limits?: CapabilityResourceLimitsContract;
  readonly security: CapabilitySecurityPolicyContract;
}