import type {
  ClusterOwnership,
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

export class RedisJobOwnershipStore {
  constructor(
    private readonly client: RedisClusterStoreClient,
    private readonly keys: RedisClusterKeyFactory,
    private readonly serializer = new RedisClusterSerializer(),
  ) {}

  async assign(input: {
    readonly resourceType: string;
    readonly resourceId: string;
    readonly ownerNodeId: string;
    readonly leaseDurationMs: number;
    readonly metadata?: Readonly<Record<string, unknown>>;
    readonly now?: Date;
  }): Promise<ClusterOwnership | null> {
    const now = new Date(input.now ?? new Date());
    const ttl = RedisClusterTtl.normalize(
      input.leaseDurationMs,
    );

    if (ttl === null) {
      throw new Error(
        'Ownership lease duration is required.',
      );
    }

    const resourceType = this.text(
      input.resourceType,
      'resourceType',
    );

    const resourceId = this.text(
      input.resourceId,
      'resourceId',
    );

    const ownership: ClusterOwnership = {
      resourceType,
      resourceId,
      ownerNodeId: this.text(
        input.ownerNodeId,
        'ownerNodeId',
      ),
      previousOwnerNodeId: null,
      fencingToken: await this.client.incr(
        this.keys.fencingSequence(),
      ),
      state: 'assigned',
      assignedAt: now,
      renewedAt: now,
      expiresAt: new Date(now.getTime() + ttl),
      releasedAt: null,
      metadata: this.serializer.clone(
        input.metadata ?? {},
      ),
    };

    const result = await this.client.set(
      this.keys.ownership(resourceType, resourceId),
      this.serializer.serialize(ownership),
      'PX',
      ttl,
      'NX',
    );

    return result === 'OK'
      ? this.serializer.clone(ownership)
      : null;
  }

  async get(
    resourceType: string,
    resourceId: string,
  ): Promise<ClusterOwnership | null> {
    const payload = await this.client.get(
      this.keys.ownership(
        this.text(resourceType, 'resourceType'),
        this.text(resourceId, 'resourceId'),
      ),
    );

    return payload === null
      ? null
      : this.serializer.deserialize<
          ClusterOwnership
        >(payload);
  }

  async renew(
    resourceType: string,
    resourceId: string,
    ownerNodeId: string,
    fencingToken: number,
    leaseDurationMs: number,
    now = new Date(),
  ): Promise<ClusterOwnership> {
    const current = await this.get(
      resourceType,
      resourceId,
    );

    if (
      !current ||
      current.ownerNodeId !== ownerNodeId ||
      current.fencingToken !== fencingToken ||
      current.releasedAt !== null
    ) {
      throw new Error(
        'Cluster ownership mismatch.',
      );
    }

    const ttl = RedisClusterTtl.normalize(
      leaseDurationMs,
    );

    if (ttl === null) {
      throw new Error(
        'Ownership lease duration is required.',
      );
    }

    const renewed: ClusterOwnership = {
      ...current,
      state: 'renewed',
      renewedAt: new Date(now),
      expiresAt: new Date(now.getTime() + ttl),
      releasedAt: null,
    };

    const result = await this.client.set(
      this.keys.ownership(
        current.resourceType,
        current.resourceId,
      ),
      this.serializer.serialize(renewed),
      'PX',
      ttl,
      'XX',
    );

    if (result !== 'OK') {
      throw new Error(
        'Cluster ownership disappeared before renewal.',
      );
    }

    return this.serializer.clone(renewed);
  }

  async transfer(
    resourceType: string,
    resourceId: string,
    currentOwnerNodeId: string,
    newOwnerNodeId: string,
    leaseDurationMs: number,
    state: 'transferred' | 'recovered' = 'transferred',
    now = new Date(),
  ): Promise<ClusterOwnership> {
    const current = await this.get(
      resourceType,
      resourceId,
    );

    if (
      !current ||
      current.ownerNodeId !== currentOwnerNodeId
    ) {
      throw new Error(
        'Cluster ownership transfer mismatch.',
      );
    }

    const ttl = RedisClusterTtl.normalize(
      leaseDurationMs,
    );

    if (ttl === null) {
      throw new Error(
        'Ownership lease duration is required.',
      );
    }

    const transferred: ClusterOwnership = {
      ...current,
      ownerNodeId: this.text(
        newOwnerNodeId,
        'newOwnerNodeId',
      ),
      previousOwnerNodeId: current.ownerNodeId,
      fencingToken: await this.client.incr(
        this.keys.fencingSequence(),
      ),
      state,
      renewedAt: new Date(now),
      expiresAt: new Date(now.getTime() + ttl),
      releasedAt: null,
    };

    const result = await this.client.set(
      this.keys.ownership(
        current.resourceType,
        current.resourceId,
      ),
      this.serializer.serialize(transferred),
      'PX',
      ttl,
      'XX',
    );

    if (result !== 'OK') {
      throw new Error(
        'Cluster ownership disappeared before transfer.',
      );
    }

    return this.serializer.clone(transferred);
  }

  async release(
    resourceType: string,
    resourceId: string,
    ownerNodeId: string,
    fencingToken: number,
  ): Promise<boolean> {
    const current = await this.get(
      resourceType,
      resourceId,
    );

    if (!current) {
      return false;
    }

    if (
      current.ownerNodeId !== ownerNodeId ||
      current.fencingToken !== fencingToken
    ) {
      throw new Error(
        'Cluster ownership mismatch.',
      );
    }

    return (
      await this.client.del(
        this.keys.ownership(
          current.resourceType,
          current.resourceId,
        ),
      )
    ) > 0;
  }

  async list(
    resourceType?: string,
    count = 100,
  ): Promise<readonly ClusterOwnership[]> {
    const keys = await this.scan(
      this.keys.ownershipPattern(resourceType),
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
          ClusterOwnership
        >(value),
      )
      .sort((a, b) =>
        `${a.resourceType}:${a.resourceId}`.localeCompare(
          `${b.resourceType}:${b.resourceId}`,
        ),
      );
  }

  async listByOwner(
    ownerNodeId: string,
    count = 100,
  ): Promise<readonly ClusterOwnership[]> {
    const owner = this.text(
      ownerNodeId,
      'ownerNodeId',
    );

    return (await this.list(undefined, count)).filter(
      (item) => item.ownerNodeId === owner,
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
