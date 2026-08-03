import type {
  CapabilityConfigurationReader,
} from '../../../interfaces';

export class SdkConfigurationReader
  implements CapabilityConfigurationReader
{
  private readonly values: Map<string, unknown>;

  constructor(
    initialValues:
      Readonly<Record<string, unknown>> = {},
  ) {
    this.values = new Map(
      Object.entries(initialValues),
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
        `Required SDK configuration "${key}" was not found.`,
      );
    }

    return this.values.get(key) as TValue;
  }

  has(key: string): boolean {
    return this.values.has(key);
  }

  set<TValue = unknown>(
    key: string,
    value: TValue,
  ): void {
    this.values.set(key, value);
  }

  merge(
    values: Readonly<Record<string, unknown>>,
  ): void {
    for (const [key, value] of Object.entries(values)) {
      this.values.set(key, value);
    }
  }

  snapshot(): Readonly<Record<string, unknown>> {
    return Object.freeze(
      Object.fromEntries(this.values.entries()),
    );
  }
}