import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
} from '../contracts';
import type { CapabilityLifecycle } from './capability-lifecycle.interface';

export interface CapabilityProvider {
  readonly manifest: CapabilityManifestContract;
  readonly lifecycle: CapabilityLifecycle;
}

export interface CapabilityProviderFactory {
  create(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityProvider>;
}

export interface CapabilityProviderResolver {
  has(capabilityId: CapabilityIdentifier): boolean;

  resolve(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityProvider>;
}