export class RedisClusterTtl {
  static normalize(
    ttlMs:
      number | null | undefined,
  ): number | null {
    if (
      ttlMs === undefined ||
      ttlMs === null
    ) {
      return null;
    }

    if (
      !Number.isInteger(ttlMs) ||
      ttlMs < 1
    ) {
      throw new Error(
        'Redis TTL must be a positive integer in milliseconds.',
      );
    }

    return ttlMs;
  }

  static expiresAt(
    ttlMs:
      number | null | undefined,
    now =
      new Date(),
  ): Date | null {
    const normalized =
      this.normalize(ttlMs);

    if (normalized === null) {
      return null;
    }

    return new Date(
      now.getTime() +
      normalized,
    );
  }

  static remaining(
    expiresAt:
      Date | null | undefined,
    now =
      new Date(),
  ): number | null {
    if (
      expiresAt === undefined ||
      expiresAt === null
    ) {
      return null;
    }

    if (
      Number.isNaN(
        expiresAt.getTime(),
      )
    ) {
      throw new Error(
        'Redis expiration date is invalid.',
      );
    }

    return Math.max(
      0,
      expiresAt.getTime() -
      now.getTime(),
    );
  }

  static isExpired(
    expiresAt:
      Date | null | undefined,
    now =
      new Date(),
  ): boolean {
    const remaining =
      this.remaining(
        expiresAt,
        now,
      );

    return (
      remaining !== null &&
      remaining === 0
    );
  }

  static toRedisMilliseconds(
    expiresAt:
      Date | null | undefined,
    now =
      new Date(),
  ): number | null {
    const remaining =
      this.remaining(
        expiresAt,
        now,
      );

    if (remaining === null) {
      return null;
    }

    return Math.max(
      1,
      remaining,
    );
  }

  static requireFuture(
    expiresAt: Date,
    now =
      new Date(),
  ): number {
    const remaining =
      this.remaining(
        expiresAt,
        now,
      );

    if (
      remaining === null ||
      remaining < 1
    ) {
      throw new Error(
        'Redis expiration must be in the future.',
      );
    }

    return remaining;
  }
}