import type {
  CapabilityEntrypointContract,
  CapabilityRuntime,
} from '../../contracts';
import type {
  CapabilityProvider,
} from '../../interfaces';
import type {
  CapabilityRuntimeAdapter,
} from '../contracts';

export class InMemoryCapabilityRuntimeAdapter
  implements CapabilityRuntimeAdapter
{
  readonly runtime: CapabilityRuntime = 'node';

  private readonly providers =
    new Map<string, CapabilityProvider>();

  registerProvider(
    modulePath: string,
    provider: CapabilityProvider,
  ): void {
    this.providers.set(modulePath, provider);
  }

  supports(
    entrypoint: CapabilityEntrypointContract,
  ): boolean {
    return (
      entrypoint.runtime === this.runtime &&
      this.providers.has(entrypoint.module)
    );
  }

  async load(
    entrypoint: CapabilityEntrypointContract,
  ): Promise<CapabilityProvider> {
    const provider =
      this.providers.get(entrypoint.module);

    if (!provider) {
      throw new Error(
        `No in-memory capability provider is registered for "${entrypoint.module}".`,
      );
    }

    return provider;
  }

  async unload(): Promise<void> {
    return;
  }
}