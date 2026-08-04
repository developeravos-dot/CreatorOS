import type { ClusterLock } from '../../models';
import { RedisClusterKeyFactory } from '../key-factory';
import { RedisClusterSerializer } from '../serialization';
import { RedisClusterTtl } from '../utilities';
import type { RedisClusterStoreClient } from './redis-cluster-store-client';

export class RedisClusterLockStore {
  constructor(
    private readonly client: RedisClusterStoreClient,
    private readonly keys: RedisClusterKeyFactory,
    private readonly serializer = new RedisClusterSerializer(),
  ) {}

  async acquire(
    resourceKey: string,
    ownerNodeId: string,
    leaseDurationMs: number,
    now = new Date(),
  ): Promise<ClusterLock | null> {
    const ttl = RedisClusterTtl.normalize(leaseDurationMs);
    if (ttl === null) throw new Error('Lock lease duration is required.');
    const key = this.text(resourceKey, 'resourceKey');
    const lock: ClusterLock = {
      resourceKey: key,
      ownerNodeId: this.text(ownerNodeId, 'ownerNodeId'),
      fencingToken: await this.client.incr(this.keys.fencingSequence()),
      state: 'acquired',
      acquiredAt: new Date(now),
      renewedAt: new Date(now),
      expiresAt: new Date(now.getTime() + ttl),
      releasedAt: null,
    };
    const result = await this.client.set(
      this.keys.lock(key),
      this.serializer.serialize(lock),
      'PX', ttl, 'NX',
    );
    return result === 'OK' ? this.serializer.clone(lock) : null;
  }

  async get(resourceKey: string): Promise<ClusterLock | null> {
    const payload = await this.client.get(
      this.keys.lock(this.text(resourceKey, 'resourceKey')),
    );
    return payload === null
      ? null
      : this.serializer.deserialize<ClusterLock>(payload);
  }

  async renew(
    resourceKey: string,
    ownerNodeId: string,
    fencingToken: number,
    leaseDurationMs: number,
    now = new Date(),
  ): Promise<ClusterLock> {
    const current = await this.get(resourceKey);
    if (
      !current ||
      current.ownerNodeId !== ownerNodeId ||
      current.fencingToken !== fencingToken
    ) {
      throw new Error('Cluster lock ownership mismatch.');
    }
    const ttl = RedisClusterTtl.normalize(leaseDurationMs);
    if (ttl === null) throw new Error('Lock lease duration is required.');
    const renewed: ClusterLock = {
      ...current,
      state: 'renewed',
      renewedAt: new Date(now),
      expiresAt: new Date(now.getTime() + ttl),
    };
    const result = await this.client.set(
      this.keys.lock(current.resourceKey),
      this.serializer.serialize(renewed),
      'PX', ttl, 'XX',
    );
    if (result !== 'OK') {
      throw new Error('Cluster lock disappeared before renewal.');
    }
    return this.serializer.clone(renewed);
  }

  async release(
    resourceKey: string,
    ownerNodeId: string,
    fencingToken: number,
  ): Promise<boolean> {
    const current = await this.get(resourceKey);
    if (!current) return false;
    if (
      current.ownerNodeId !== ownerNodeId ||
      current.fencingToken !== fencingToken
    ) {
      throw new Error('Cluster lock ownership mismatch.');
    }
    return (await this.client.del(
      this.keys.lock(current.resourceKey),
    )) > 0;
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();
    if (!normalized) throw new Error(`${field} is required.`);
    return normalized;
  }
}
