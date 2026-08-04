import type {
  ClusterSchedulerClaim,
} from '../../models';
import {
  RedisClusterKeyFactory,
} from '../key-factory';
import {
  RedisClusterSerializer,
} from '../serialization';
import {
  RedisClusterTtl,
} from '../utilities';
import type {
  RedisClusterStoreClient,
} from './redis-cluster-store-client';

export class RedisSchedulerClaimStore {
  constructor(
    private readonly client: RedisClusterStoreClient,
    private readonly keys: RedisClusterKeyFactory,
    private readonly serializer = new RedisClusterSerializer(),
  ) {}

  async claim(input: {
    readonly scheduleId: string;
    readonly nodeId: string;
    readonly executionKey: string;
    readonly leaseDurationMs: number;
    readonly now?: Date;
  }): Promise<ClusterSchedulerClaim | null> {
    const now = new Date(input.now ?? new Date());
    const ttl = RedisClusterTtl.normalize(
      input.leaseDurationMs,
    );

    if (ttl === null) {
      throw new Error(
        'Scheduler claim lease duration is required.',
      );
    }

    const executionKey = this.text(
      input.executionKey,
      'executionKey',
    );

    const claim: ClusterSchedulerClaim = {
      scheduleId: this.text(
        input.scheduleId,
        'scheduleId',
      ),
      nodeId: this.text(input.nodeId, 'nodeId'),
      executionKey,
      fencingToken: await this.client.incr(
        this.keys.fencingSequence(),
      ),
      claimedAt: now,
      expiresAt: new Date(now.getTime() + ttl),
      completedAt: null,
    };

    const result = await this.client.set(
      this.keys.schedulerClaim(executionKey),
      this.serializer.serialize(claim),
      'PX',
      ttl,
      'NX',
    );

    return result === 'OK'
      ? this.serializer.clone(claim)
      : null;
  }

  async get(
    executionKey: string,
  ): Promise<ClusterSchedulerClaim | null> {
    const payload = await this.client.get(
      this.keys.schedulerClaim(
        this.text(executionKey, 'executionKey'),
      ),
    );

    return payload === null
      ? null
      : this.serializer.deserialize<
          ClusterSchedulerClaim
        >(payload);
  }

  async renew(
    executionKey: string,
    nodeId: string,
    fencingToken: number,
    leaseDurationMs: number,
    now = new Date(),
  ): Promise<ClusterSchedulerClaim> {
    const current = await this.get(executionKey);

    if (
      !current ||
      current.nodeId !== nodeId ||
      current.fencingToken !== fencingToken ||
      current.completedAt !== null
    ) {
      throw new Error(
        'Scheduler claim ownership mismatch.',
      );
    }

    const ttl = RedisClusterTtl.normalize(
      leaseDurationMs,
    );

    if (ttl === null) {
      throw new Error(
        'Scheduler claim lease duration is required.',
      );
    }

    const renewed: ClusterSchedulerClaim = {
      ...current,
      expiresAt: new Date(now.getTime() + ttl),
    };

    const result = await this.client.set(
      this.keys.schedulerClaim(current.executionKey),
      this.serializer.serialize(renewed),
      'PX',
      ttl,
      'XX',
    );

    if (result !== 'OK') {
      throw new Error(
        'Scheduler claim disappeared before renewal.',
      );
    }

    return this.serializer.clone(renewed);
  }

  async complete(
    executionKey: string,
    nodeId: string,
    fencingToken: number,
    now = new Date(),
  ): Promise<ClusterSchedulerClaim> {
    const current = await this.get(executionKey);

    if (
      !current ||
      current.nodeId !== nodeId ||
      current.fencingToken !== fencingToken
    ) {
      throw new Error(
        'Scheduler claim ownership mismatch.',
      );
    }

    const completed: ClusterSchedulerClaim = {
      ...current,
      completedAt: new Date(now),
    };

    const result = await this.client.set(
      this.keys.schedulerClaim(current.executionKey),
      this.serializer.serialize(completed),
      'XX',
    );

    if (result !== 'OK') {
      throw new Error(
        'Scheduler claim disappeared before completion.',
      );
    }

    return this.serializer.clone(completed);
  }

  async release(
    executionKey: string,
    nodeId: string,
    fencingToken: number,
  ): Promise<boolean> {
    const current = await this.get(executionKey);

    if (!current) {
      return false;
    }

    if (
      current.nodeId !== nodeId ||
      current.fencingToken !== fencingToken
    ) {
      throw new Error(
        'Scheduler claim ownership mismatch.',
      );
    }

    return (
      await this.client.del(
        this.keys.schedulerClaim(current.executionKey),
      )
    ) > 0;
  }

  async list(count = 100): Promise<
    readonly ClusterSchedulerClaim[]
  > {
    const keys = await this.scan(
      this.keys.schedulerClaimsPattern(),
      count,
    );

    if (keys.length === 0) {
      return [];
    }

    const payloads = await this.client.mget(...keys);

    return payloads
      .filter((value): value is string => value !== null)
      .map((value) =>
        this.serializer.deserialize<
          ClusterSchedulerClaim
        >(value),
      )
      .sort((a, b) =>
        a.executionKey.localeCompare(b.executionKey),
      );
  }

  private async scan(
    pattern: string,
    count: number,
  ): Promise<string[]> {
    this.positive(count, 'count');

    let cursor = '0';
    const discovered: string[] = [];

    do {
      const result = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        count,
      );

      cursor = result[0];
      discovered.push(...result[1]);
    } while (cursor !== '0');

    return [...new Set(discovered)].sort();
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error(`${field} is required.`);
    }

    return normalized;
  }

  private positive(value: number, field: string): void {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(
        `${field} must be a positive integer.`,
      );
    }
  }
}
