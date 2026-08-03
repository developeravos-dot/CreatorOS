import type {
  CapabilityConfigurationReader,
} from '../../../../interfaces';

export class MockSdkConfigurationReader
  implements CapabilityConfigurationReader
{
  private readonly values =
    new Map<string, unknown>();

  private readonly reads:
    string[] = [];

  constructor(
    initialValues:
      Readonly<Record<string, unknown>> = {},
  ) {
    this.seed(initialValues);
  }

  get<TValue = unknown>(
    key: string,
  ): TValue | undefined {
    this.reads.push(key);

    return this.values.get(key) as
      | TValue
      | undefined;
  }

  require<TValue = unknown>(
    key: string,
  ): TValue {
    this.reads.push(key);

    if (!this.values.has(key)) {
      throw new Error(
        `Required mock SDK configuration "${key}" was not found.`,
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
  ): this {
    this.values.set(key, value);
    return this;
  }

  delete(key: string): boolean {
    return this.values.delete(key);
  }

  seed(
    values:
      Readonly<Record<string, unknown>>,
  ): this {
    for (const [key, value] of Object.entries(values)) {
      this.values.set(key, value);
    }

    return this;
  }

  getReads(): readonly string[] {
    return [...this.reads];
  }

  snapshot():
    Readonly<Record<string, unknown>> {
    return Object.freeze(
      Object.fromEntries(
        this.values.entries(),
      ),
    );
  }

  clear(): void {
    this.values.clear();
    this.reads.length = 0;
  }
}