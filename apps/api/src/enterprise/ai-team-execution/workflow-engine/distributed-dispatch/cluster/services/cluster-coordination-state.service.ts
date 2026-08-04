import {
  Injectable,
} from '@nestjs/common';

export interface ClusterCoordinationStateEntry {
  readonly key: string;
  readonly version: number;
  readonly value: unknown;
  readonly ownerNodeId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expiresAt: Date | null;
}

export interface SetClusterCoordinationStateInput {
  readonly key: string;
  readonly value: unknown;
  readonly ownerNodeId?: string;
  readonly expectedVersion?: number;
  readonly ttlMs?: number;
  readonly now?: Date;
}

export interface ClusterCoordinationStateMetrics {
  readonly activeEntries: number;
  readonly writes: number;
  readonly deletes: number;
  readonly conflicts: number;
  readonly expirations: number;
  readonly collectedAt: Date;
}

@Injectable()
export class ClusterCoordinationStateService {
  private readonly entries =
    new Map<
      string,
      ClusterCoordinationStateEntry
    >();

  private writes = 0;

  private deletes = 0;

  private conflicts = 0;

  private expirations = 0;

  set(
    input:
      SetClusterCoordinationStateInput,
  ): ClusterCoordinationStateEntry {
    const key =
      this.requireText(
        input.key,
        'key',
      );

    const now =
      new Date(
        input.now ??
        new Date(),
      );

    this.expireKey(
      key,
      now,
    );

    const existing =
      this.entries.get(key);

    if (
      input.expectedVersion !==
      undefined &&
      input.expectedVersion !==
        (
          existing?.version ??
          0
        )
    ) {
      this.conflicts += 1;

      throw new Error(
        `Coordination state version conflict for ${key}.`,
      );
    }

    const ttlMs =
      input.ttlMs === undefined
        ? null
        : this.requirePositiveInteger(
            input.ttlMs,
            'ttlMs',
          );

    const entry:
      ClusterCoordinationStateEntry = {
      key,
      version:
        (
          existing?.version ??
          0
        ) + 1,
      value:
        this.cloneValue(
          input.value,
        ),
      ownerNodeId:
        input.ownerNodeId ===
        undefined
          ? (
              existing?.ownerNodeId ??
              null
            )
          : this.requireText(
              input.ownerNodeId,
              'ownerNodeId',
            ),
      createdAt:
        existing?.createdAt ??
        now,
      updatedAt:
        now,
      expiresAt:
        ttlMs === null
          ? null
          : new Date(
              now.getTime() +
              ttlMs,
            ),
    };

    this.entries.set(
      key,
      this.cloneEntry(entry),
    );

    this.writes += 1;

    return this.cloneEntry(
      entry,
    );
  }

  compareAndSet(
    key: string,
    expectedVersion: number,
    value: unknown,
    ownerNodeId?: string,
    now =
      new Date(),
  ): ClusterCoordinationStateEntry {
    return this.set({
      key,
      value,
      ownerNodeId,
      expectedVersion,
      now,
    });
  }

  get(
    key: string,
    now =
      new Date(),
  ): ClusterCoordinationStateEntry | null {
    const normalizedKey =
      this.requireText(
        key,
        'key',
      );

    this.expireKey(
      normalizedKey,
      new Date(now),
    );

    const entry =
      this.entries.get(
        normalizedKey,
      );

    return entry
      ? this.cloneEntry(entry)
      : null;
  }

  delete(
    key: string,
    expectedVersion?: number,
    now =
      new Date(),
  ): boolean {
    const normalizedKey =
      this.requireText(
        key,
        'key',
      );

    this.expireKey(
      normalizedKey,
      new Date(now),
    );

    const entry =
      this.entries.get(
        normalizedKey,
      );

    if (!entry) {
      return false;
    }

    if (
      expectedVersion !== undefined &&
      expectedVersion !==
      entry.version
    ) {
      this.conflicts += 1;

      throw new Error(
        `Coordination state version conflict for ${normalizedKey}.`,
      );
    }

    const removed =
      this.entries.delete(
        normalizedKey,
      );

    if (removed) {
      this.deletes += 1;
    }

    return removed;
  }

  expire(
    now =
      new Date(),
  ): number {
    const currentTime =
      new Date(now);

    let expired = 0;

    for (
      const key
      of this.entries.keys()
    ) {
      if (
        this.expireKey(
          key,
          currentTime,
        )
      ) {
        expired += 1;
      }
    }

    return expired;
  }

  list(
    now =
      new Date(),
  ): readonly ClusterCoordinationStateEntry[] {
    this.expire(now);

    return [
      ...this.entries.values(),
    ]
      .sort(
        (left, right) =>
          left.key.localeCompare(
            right.key,
          ),
      )
      .map(
        (entry) =>
          this.cloneEntry(entry),
      );
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): ClusterCoordinationStateMetrics {
    this.expire(
      collectedAt,
    );

    return {
      activeEntries:
        this.entries.size,
      writes:
        this.writes,
      deletes:
        this.deletes,
      conflicts:
        this.conflicts,
      expirations:
        this.expirations,
      collectedAt:
        new Date(collectedAt),
    };
  }

  private expireKey(
    key: string,
    now: Date,
  ): boolean {
    const entry =
      this.entries.get(key);

    if (
      !entry ||
      entry.expiresAt === null ||
      entry.expiresAt.getTime() >
        now.getTime()
    ) {
      return false;
    }

    this.entries.delete(key);
    this.expirations += 1;

    return true;
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        `${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private requirePositiveInteger(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isInteger(value) ||
      value < 1
    ) {
      throw new Error(
        `${fieldName} must be a positive integer.`,
      );
    }

    return value;
  }

  private cloneEntry(
    entry:
      ClusterCoordinationStateEntry,
  ): ClusterCoordinationStateEntry {
    return {
      ...entry,
      value:
        this.cloneValue(
          entry.value,
        ),
      createdAt:
        new Date(
          entry.createdAt,
        ),
      updatedAt:
        new Date(
          entry.updatedAt,
        ),
      expiresAt:
        entry.expiresAt
          ? new Date(
              entry.expiresAt,
            )
          : null,
    };
  }

  private cloneValue(
    value: unknown,
  ): unknown {
    if (
      value === null ||
      typeof value !== 'object'
    ) {
      return value;
    }

    if (value instanceof Date) {
      return new Date(value);
    }

    if (Array.isArray(value)) {
      return value.map(
        (item) =>
          this.cloneValue(item),
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
          this.cloneValue(item),
        ],
      ),
    );
  }
}