import type {
  CapabilityServiceResolver,
} from '../../../../interfaces';

export interface MockSdkServiceResolution {
  readonly token: string | symbol;
  readonly required: boolean;
  readonly resolved: boolean;
}

export class MockSdkServiceContainer
  implements CapabilityServiceResolver
{
  private readonly services =
    new Map<string | symbol, unknown>();

  private readonly resolutions:
    MockSdkServiceResolution[] = [];

  constructor(
    initialServices:
      ReadonlyMap<string | symbol, unknown> =
        new Map(),
  ) {
    for (const [token, service] of initialServices) {
      this.services.set(token, service);
    }
  }

  register<TService>(
    token: string | symbol,
    service: TService,
  ): this {
    this.services.set(token, service);
    return this;
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
    const resolved =
      this.services.has(token);

    this.resolutions.push(
      Object.freeze({
        token,
        required: true,
        resolved,
      }),
    );

    if (!resolved) {
      throw new Error(
        `Mock SDK service "${String(token)}" was not found.`,
      );
    }

    return this.services.get(token) as TService;
  }

  resolveOptional<TService>(
    token: string | symbol,
  ): TService | undefined {
    const resolved =
      this.services.has(token);

    this.resolutions.push(
      Object.freeze({
        token,
        required: false,
        resolved,
      }),
    );

    return this.services.get(token) as
      | TService
      | undefined;
  }

  getResolutions():
    readonly MockSdkServiceResolution[] {
    return [...this.resolutions];
  }

  entries(): readonly (
    readonly [string | symbol, unknown]
  )[] {
    return [...this.services.entries()];
  }

  clear(): void {
    this.services.clear();
    this.resolutions.length = 0;
  }
}