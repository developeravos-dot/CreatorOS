import { RedisClusterKeyFactory } from '../key-factory';
import { RedisClusterSerializer } from '../serialization';
import { RedisClusterTtl } from '../utilities';
import type { RedisClusterStoreClient } from './redis-cluster-store-client';

export interface RedisCoordinationStateRecord<TValue = unknown> {
  readonly key: string;
  readonly value: TValue;
  readonly version: number;
  readonly ownerNodeId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expiresAt: Date | null;
}

export class RedisCoordinationStateStore {
  constructor(
    private readonly client: RedisClusterStoreClient,
    private readonly keys: RedisClusterKeyFactory,
    private readonly serializer = new RedisClusterSerializer(),
  ) {}

  async get<TValue>(
    key: string,
  ): Promise<RedisCoordinationStateRecord<TValue> | null> {
    const payload = await this.client.get(
      this.keys.coordinationState(this.text(key, 'key')),
    );
    return payload === null
      ? null
      : this.serializer.deserialize<
          RedisCoordinationStateRecord<TValue>
        >(payload);
  }

  async create<TValue>(
    key: string,
    value: TValue,
    ownerNodeId: string,
    ttlMs?: number,
    now = new Date(),
  ): Promise<RedisCoordinationStateRecord<TValue>> {
    const normalizedKey = this.text(key, 'key');
    const ttl = RedisClusterTtl.normalize(ttlMs);
    const record: RedisCoordinationStateRecord<TValue> = {
      key: normalizedKey,
      value: this.serializer.clone(value),
      version: 1,
      ownerNodeId: this.text(ownerNodeId, 'ownerNodeId'),
      createdAt: new Date(now),
      updatedAt: new Date(now),
      expiresAt: ttl === null ? null : new Date(now.getTime() + ttl),
    };
    const args: Array<string | number> = ['NX'];
    if (ttl !== null) args.unshift('PX', ttl);
    const result = await this.client.set(
      this.keys.coordinationState(normalizedKey),
      this.serializer.serialize(record),
      ...args,
    );
    if (result !== 'OK') {
      throw new Error(`Coordination state ${normalizedKey} already exists.`);
    }
    return this.serializer.clone(record);
  }

  async compareAndSet<TValue>(
    key: string,
    expectedVersion: number,
    value: TValue,
    ownerNodeId: string,
    ttlMs?: number,
    now = new Date(),
  ): Promise<RedisCoordinationStateRecord<TValue>> {
    const current = await this.get<unknown>(key);
    if (!current) {
      throw new Error(`Coordination state ${key} does not exist.`);
    }
    if (current.version !== expectedVersion) {
      throw new Error(`Coordination state ${key} version conflict.`);
    }
    const ttl = RedisClusterTtl.normalize(ttlMs);
    const updated: RedisCoordinationStateRecord<TValue> = {
      key: current.key,
      value: this.serializer.clone(value),
      version: current.version + 1,
      ownerNodeId: this.text(ownerNodeId, 'ownerNodeId'),
      createdAt: new Date(current.createdAt),
      updatedAt: new Date(now),
      expiresAt: ttl === null
        ? current.expiresAt
        : new Date(now.getTime() + ttl),
    };
    const args: Array<string | number> = ['XX'];
    if (updated.expiresAt !== null) {
      args.unshift(
        'PX',
        RedisClusterTtl.requireFuture(updated.expiresAt, now),
      );
    }
    const result = await this.client.set(
      this.keys.coordinationState(current.key),
      this.serializer.serialize(updated),
      ...args,
    );
    if (result !== 'OK') {
      throw new Error(
        `Coordination state ${key} disappeared before update.`,
      );
    }
    return this.serializer.clone(updated);
  }

  async delete(key: string, expectedVersion?: number): Promise<boolean> {
    const current = await this.get(key);
    if (!current) return false;
    if (
      expectedVersion !== undefined &&
      current.version !== expectedVersion
    ) {
      throw new Error(`Coordination state ${key} version conflict.`);
    }
    return (await this.client.del(
      this.keys.coordinationState(current.key),
    )) > 0;
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();
    if (!normalized) throw new Error(`${field} is required.`);
    return normalized;
  }
}
