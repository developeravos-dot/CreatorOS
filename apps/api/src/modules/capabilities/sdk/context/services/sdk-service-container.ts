import type {
  CapabilityServiceResolver,
} from '../../../interfaces';

export class SdkServiceContainer
  implements CapabilityServiceResolver
{
  private readonly services:
    Map<string | symbol, unknown>;

  constructor(
    initialServices:
      ReadonlyMap<string | symbol, unknown> =
        new Map(),
  ) {
    this.services = new Map(initialServices);
  }

  register<TService>(
    token: string | symbol,
    service: TService,
  ): void {
    this.services.set(token, service);
  }

  unregister(
    token: string | symbol,
  ): boolean {
    return this.services.delete(token);
  }

  has(token: string | symbol): boolean {
    return this.services.has(token);
  }

  resolve<TService>(
    token: string | symbol,
  ): TService {
    if (!this.services.has(token)) {
      throw new Error(
        `SDK service "${String(token)}" was not found.`,
      );
    }

    return this.services.get(token) as TService;
  }

  resolveOptional<TService>(
    token: string | symbol,
  ): TService | undefined {
    return this.services.get(token) as
      | TService
      | undefined;
  }

  entries(): readonly (
    readonly [string | symbol, unknown]
  )[] {
    return [...this.services.entries()];
  }
}