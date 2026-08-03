import type {
  CapabilityEntrypointContract,
  CapabilityRuntime,
} from '../../contracts';
import type {
  CapabilityProvider,
} from '../../interfaces';

export interface CapabilityRuntimeAdapter {
  readonly runtime: CapabilityRuntime;

  supports(entrypoint: CapabilityEntrypointContract): boolean;

  load(
    entrypoint: CapabilityEntrypointContract,
  ): Promise<CapabilityProvider>;

  unload?(
    provider: CapabilityProvider,
  ): Promise<void>;
}