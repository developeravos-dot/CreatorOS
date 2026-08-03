import type {
  CapabilitySdkContextState,
} from '../../contracts';

export class SdkContextState
  implements CapabilitySdkContextState
{
  private readonly values: Map<string, unknown>;

  constructor(
    initialState:
      Readonly<Record<string, unknown>> = {},
  ) {
    this.values = new Map(
      Object.entries(initialState),
    );
  }

  get<TValue = unknown>(
    key: string,
  ): TValue | undefined {
    return this.values.get(key) as
      | TValue
      | undefined;
  }

  require<TValue = unknown>(
    key: string,
  ): TValue {
    if (!this.values.has(key)) {
      throw new Error(
        `Required SDK state value "${key}" was not found.`,
      );
    }

    return this.values.get(key) as TValue;
  }

  set<TValue = unknown>(
    key: string,
    value: TValue,
  ): void {
    this.values.set(key, value);
  }

  has(key: string): boolean {
    return this.values.has(key);
  }

  delete(key: string): boolean {
    return this.values.delete(key);
  }

  clear(): void {
    this.values.clear();
  }

  snapshot(): Readonly<Record<string, unknown>> {
    return Object.freeze(
      Object.fromEntries(this.values.entries()),
    );
  }
}