export interface RedisClusterNamespaceInput {
  readonly application: string;
  readonly environment: string;
  readonly clusterId: string;
  readonly version?: string;
}

export class RedisClusterNamespace {
  readonly application: string;

  readonly environment: string;

  readonly clusterId: string;

  readonly version: string;

  readonly prefix: string;

  constructor(
    input:
      RedisClusterNamespaceInput,
  ) {
    this.application =
      RedisClusterNamespace.normalizeSegment(
        input.application,
        'application',
      );

    this.environment =
      RedisClusterNamespace.normalizeSegment(
        input.environment,
        'environment',
      );

    this.clusterId =
      RedisClusterNamespace.normalizeSegment(
        input.clusterId,
        'clusterId',
      );

    this.version =
      RedisClusterNamespace.normalizeSegment(
        input.version ?? 'v1',
        'version',
      );

    this.prefix = [
      this.application,
      this.environment,
      this.clusterId,
      'cluster',
      this.version,
    ].join(':');
  }

  qualify(
    ...segments:
      readonly string[]
  ): string {
    if (segments.length === 0) {
      return this.prefix;
    }

    return [
      this.prefix,
      ...segments.map(
        (segment, index) =>
          RedisClusterNamespace
            .normalizeSegment(
              segment,
              `segment[${index}]`,
            ),
      ),
    ].join(':');
  }

  pattern(
    ...segments:
      readonly string[]
  ): string {
    return this.qualify(...segments) + ':*';
  }

  contains(
    key: string,
  ): boolean {
    return (
      key === this.prefix ||
      key.startsWith(
        `${this.prefix}:`,
      )
    );
  }

  strip(
    key: string,
  ): string {
    if (!this.contains(key)) {
      throw new Error(
        `Redis key ${key} does not belong to namespace ${this.prefix}.`,
      );
    }

    if (key === this.prefix) {
      return '';
    }

    return key.slice(
      this.prefix.length + 1,
    );
  }

  static normalizeSegment(
    value: string,
    fieldName = 'segment',
  ): string {
    const normalized =
      value
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9._-]+/g,
          '-',
        )
        .replace(
          /^[-._]+|[-._]+$/g,
          '',
        );

    if (!normalized) {
      throw new Error(
        `${fieldName} must contain at least one valid character.`,
      );
    }

    if (normalized.includes(':')) {
      throw new Error(
        `${fieldName} cannot contain a Redis namespace separator.`,
      );
    }

    return normalized;
  }
}
