import type {
  RedisClusterStoreClient,
} from '../../distributed-dispatch/cluster/redis';
import type {
  DistributedExecutionLease,
  DistributedExecutionRecord,
} from '../models';
import {
  DistributedRuntimeKeyFactory,
} from './distributed-runtime-key-factory';

interface SerializedExecutionRecord
  extends Omit<
    DistributedExecutionRecord,
    | 'createdAt'
    | 'updatedAt'
    | 'startedAt'
    | 'completedAt'
  > {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt: string | null;
  readonly completedAt: string | null;
}

interface SerializedExecutionLease
  extends Omit<
    DistributedExecutionLease,
    'acquiredAt' | 'expiresAt' | 'releasedAt'
  > {
  readonly acquiredAt: string;
  readonly expiresAt: string;
  readonly releasedAt: string | null;
}

export class RedisExecutionRuntimeStore {
  constructor(
    private readonly client:
      RedisClusterStoreClient,
    private readonly keys =
      new DistributedRuntimeKeyFactory(),
  ) {}

  async saveExecution(
    execution: DistributedExecutionRecord,
  ): Promise<DistributedExecutionRecord> {
    await this.client.set(
      this.keys.execution(execution.executionId),
      JSON.stringify(
        this.serializeExecution(execution),
      ),
    );

    return this.cloneExecution(execution);
  }

  async getExecution(
    executionId: string,
  ): Promise<DistributedExecutionRecord | null> {
    const value = await this.client.get(
      this.keys.execution(executionId),
    );

    return value
      ? this.deserializeExecution(value)
      : null;
  }

  async listExecutions():
    Promise<readonly DistributedExecutionRecord[]> {
    const keys = await this.scanAll(
      this.keys.executionPattern(),
    );

    if (keys.length === 0) {
      return [];
    }

    const values = await this.client.mget(...keys);

    return values
      .filter(
        (value): value is string =>
          value !== null,
      )
      .map((value) =>
        this.deserializeExecution(value),
      )
      .sort((left, right) =>
        left.executionId.localeCompare(
          right.executionId,
        ),
      );
  }

  async acquireLease(
    lease: DistributedExecutionLease,
    ttlMs: number,
  ): Promise<boolean> {
    this.positive(ttlMs, 'ttlMs');

    const result = await this.client.set(
      this.keys.lease(lease.executionId),
      JSON.stringify(
        this.serializeLease(lease),
      ),
      'PX',
      ttlMs,
      'NX',
    );

    return result === 'OK';
  }

  async renewLease(
    lease: DistributedExecutionLease,
    ttlMs: number,
  ): Promise<boolean> {
    this.positive(ttlMs, 'ttlMs');

    const current = await this.getLease(
      lease.executionId,
    );

    if (
      !current ||
      current.workerId !== lease.workerId ||
      current.fencingToken !==
        lease.fencingToken
    ) {
      return false;
    }

    const result = await this.client.set(
      this.keys.lease(lease.executionId),
      JSON.stringify(
        this.serializeLease(lease),
      ),
      'PX',
      ttlMs,
      'XX',
    );

    return result === 'OK';
  }

  async releaseLease(
    executionId: string,
    workerId: string,
    fencingToken: number,
  ): Promise<boolean> {
    const current = await this.getLease(
      executionId,
    );

    if (
      !current ||
      current.workerId !== workerId ||
      current.fencingToken !== fencingToken
    ) {
      return false;
    }

    return (
      await this.client.del(
        this.keys.lease(executionId),
      )
    ) > 0;
  }

  async getLease(
    executionId: string,
  ): Promise<DistributedExecutionLease | null> {
    const value = await this.client.get(
      this.keys.lease(executionId),
    );

    return value
      ? this.deserializeLease(value)
      : null;
  }

  private async scanAll(
    pattern: string,
  ): Promise<string[]> {
    let cursor = '0';
    const keys: string[] = [];

    do {
      const [
        nextCursor,
        page,
      ] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );

      cursor = nextCursor;
      keys.push(...page);
    } while (cursor !== '0');

    return [...new Set(keys)].sort();
  }

  private serializeExecution(
    execution: DistributedExecutionRecord,
  ): SerializedExecutionRecord {
    return {
      ...execution,
      trace: {
        ...execution.trace,
      },
      payload: structuredClone(
        execution.payload,
      ),
      requiredCapabilities: [
        ...execution.requiredCapabilities,
      ],
      createdAt:
        execution.createdAt.toISOString(),
      updatedAt:
        execution.updatedAt.toISOString(),
      startedAt:
        execution.startedAt?.toISOString() ??
        null,
      completedAt:
        execution.completedAt?.toISOString() ??
        null,
    };
  }

  private deserializeExecution(
    value: string,
  ): DistributedExecutionRecord {
    const parsed = (
      JSON.parse(value)
    ) as SerializedExecutionRecord;

    return {
      ...parsed,
      trace: {
        ...parsed.trace,
      },
      payload: structuredClone(parsed.payload),
      requiredCapabilities: [
        ...parsed.requiredCapabilities,
      ],
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
      startedAt: parsed.startedAt
        ? new Date(parsed.startedAt)
        : null,
      completedAt: parsed.completedAt
        ? new Date(parsed.completedAt)
        : null,
    };
  }

  private serializeLease(
    lease: DistributedExecutionLease,
  ): SerializedExecutionLease {
    return {
      ...lease,
      acquiredAt:
        lease.acquiredAt.toISOString(),
      expiresAt:
        lease.expiresAt.toISOString(),
      releasedAt:
        lease.releasedAt?.toISOString() ??
        null,
    };
  }

  private deserializeLease(
    value: string,
  ): DistributedExecutionLease {
    const parsed = (
      JSON.parse(value)
    ) as SerializedExecutionLease;

    return {
      ...parsed,
      acquiredAt: new Date(
        parsed.acquiredAt,
      ),
      expiresAt: new Date(
        parsed.expiresAt,
      ),
      releasedAt: parsed.releasedAt
        ? new Date(parsed.releasedAt)
        : null,
    };
  }

  private cloneExecution(
    execution: DistributedExecutionRecord,
  ): DistributedExecutionRecord {
    return this.deserializeExecution(
      JSON.stringify(
        this.serializeExecution(execution),
      ),
    );
  }

  private positive(
    value: number,
    field: string,
  ): void {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(
        `${field} must be a positive integer.`,
      );
    }
  }
}
