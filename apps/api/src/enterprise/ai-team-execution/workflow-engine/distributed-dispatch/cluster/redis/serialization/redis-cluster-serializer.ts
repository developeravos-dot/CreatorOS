const TYPE_FIELD =
  '__creatorosRedisType';

interface TaggedDate {
  readonly __creatorosRedisType:
    'date';
  readonly value: string;
}

interface TaggedBigInt {
  readonly __creatorosRedisType:
    'bigint';
  readonly value: string;
}

interface TaggedUndefined {
  readonly __creatorosRedisType:
    'undefined';
}

type TaggedValue =
  | TaggedDate
  | TaggedBigInt
  | TaggedUndefined;

export class RedisClusterSerializer {
  serialize(
    value: unknown,
  ): string {
    const encoded =
      this.encode(
        value,
        new WeakSet<object>(),
      );

    return JSON.stringify(
      encoded,
    );
  }

  deserialize<TValue>(
    payload: string,
  ): TValue {
    if (
      typeof payload !== 'string' ||
      payload.length === 0
    ) {
      throw new Error(
        'Redis serialization payload is required.',
      );
    }

    let parsed: unknown;

    try {
      parsed =
        JSON.parse(payload);
    } catch {
      throw new Error(
        'Redis serialization payload is not valid JSON.',
      );
    }

    return this.decode(
      parsed,
    ) as TValue;
  }

  clone<TValue>(
    value: TValue,
  ): TValue {
    return this.deserialize<TValue>(
      this.serialize(value),
    );
  }

  private encode(
    value: unknown,
    visited:
      WeakSet<object>,
  ): unknown {
    if (value === undefined) {
      return {
        [TYPE_FIELD]:
          'undefined',
      } satisfies TaggedUndefined;
    }

    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      if (
        typeof value === 'number' &&
        !Number.isFinite(value)
      ) {
        throw new Error(
          'Redis serialization does not support non-finite numbers.',
        );
      }

      return value;
    }

    if (
      typeof value === 'bigint'
    ) {
      return {
        [TYPE_FIELD]:
          'bigint',
        value:
          value.toString(),
      } satisfies TaggedBigInt;
    }

    if (
      typeof value === 'function' ||
      typeof value === 'symbol'
    ) {
      throw new Error(
        `Redis serialization does not support ${typeof value} values.`,
      );
    }

    if (value instanceof Date) {
      if (
        Number.isNaN(
          value.getTime(),
        )
      ) {
        throw new Error(
          'Redis serialization does not support invalid dates.',
        );
      }

      return {
        [TYPE_FIELD]:
          'date',
        value:
          value.toISOString(),
      } satisfies TaggedDate;
    }

    if (
      typeof value !== 'object'
    ) {
      return value;
    }

    if (visited.has(value)) {
      throw new Error(
        'Redis serialization does not support circular references.',
      );
    }

    visited.add(value);

    try {
      if (Array.isArray(value)) {
        return value.map(
          (item) =>
            this.encode(
              item,
              visited,
            ),
        );
      }

      const prototype =
        Object.getPrototypeOf(
          value,
        );

      if (
        prototype !==
          Object.prototype &&
        prototype !== null
      ) {
        throw new Error(
          'Redis serialization supports only plain objects, arrays, dates and primitive values.',
        );
      }

      return Object.fromEntries(
        Object.entries(
          value as Record<
            string,
            unknown
          >,
        ).map(
          ([key, item]) => [
            key,
            this.encode(
              item,
              visited,
            ),
          ],
        ),
      );
    } finally {
      visited.delete(value);
    }
  }

  private decode(
    value: unknown,
  ): unknown {
    if (
      value === null ||
      typeof value !== 'object'
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(
        (item) =>
          this.decode(item),
      );
    }

    const record =
      value as Record<
        string,
        unknown
      >;

    const taggedType =
      record[TYPE_FIELD];

    if (
      taggedType === 'date' &&
      typeof record.value ===
        'string'
    ) {
      const date =
        new Date(
          record.value,
        );

      if (
        Number.isNaN(
          date.getTime(),
        )
      ) {
        throw new Error(
          'Redis serialization contains an invalid date.',
        );
      }

      return date;
    }

    if (
      taggedType === 'bigint' &&
      typeof record.value ===
        'string'
    ) {
      return BigInt(
        record.value,
      );
    }

    if (
      taggedType ===
      'undefined'
    ) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(record).map(
        ([key, item]) => [
          key,
          this.decode(item),
        ],
      ),
    );
  }
}