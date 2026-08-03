import type {
  CapabilityResourcePolicyContract,
  CapabilityRuntime,
} from '../contracts';

export const createDefaultCapabilityPolicy =
  (): CapabilityResourcePolicyContract => ({
    limits: {
      timeoutMs: 30_000,
      maxConcurrency: 1,
      maxMemoryMb: 256,
      maxRetries: 0,
    },
    security: {
      permissions: [],
      networkAccess: false,
      filesystemAccess: false,
      environmentAccess: false,
      processAccess: false,
    },
  });

export const DEFAULT_CAPABILITY_RUNTIME: CapabilityRuntime =
  'node';