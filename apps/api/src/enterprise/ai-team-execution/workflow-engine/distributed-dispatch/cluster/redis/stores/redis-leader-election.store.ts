import type { ClusterLeader } from '../../models';
import { RedisClusterKeyFactory } from '../key-factory';
import { RedisClusterSerializer } from '../serialization';
import { RedisClusterTtl } from '../utilities';
import type { RedisClusterStoreClient } from './redis-cluster-store-client';

export class RedisLeaderElectionStore {
  constructor(
    private readonly client: RedisClusterStoreClient,
    private readonly keys: RedisClusterKeyFactory,
    private readonly serializer = new RedisClusterSerializer(),
  ) {}

  async elect(input: {
    readonly nodeId: string;
    readonly instanceId: string;
    readonly leaseDurationMs: number;
    readonly now?: Date;
  }): Promise<ClusterLeader | null> {
    const ttl = RedisClusterTtl.normalize(input.leaseDurationMs);
    if (ttl === null) throw new Error('Leader lease duration is required.');
    const now = new Date(input.now ?? new Date());
    const leader: ClusterLeader = {
      nodeId: this.text(input.nodeId, 'nodeId'),
      instanceId: this.text(input.instanceId, 'instanceId'),
      term: await this.client.incr(this.keys.leaderTerm()),
      electedAt: now,
      leaseExpiresAt: new Date(now.getTime() + ttl),
    };
    const result = await this.client.set(
      this.keys.leader(),
      this.serializer.serialize(leader),
      'PX', ttl, 'NX',
    );
    return result === 'OK' ? this.serializer.clone(leader) : null;
  }

  async get(): Promise<ClusterLeader | null> {
    const payload = await this.client.get(this.keys.leader());
    return payload === null
      ? null
      : this.serializer.deserialize<ClusterLeader>(payload);
  }

  async renew(
    nodeId: string,
    term: number,
    leaseDurationMs: number,
    now = new Date(),
  ): Promise<ClusterLeader> {
    const current = await this.get();
    if (!current || current.nodeId !== nodeId || current.term !== term) {
      throw new Error('Leader lease ownership mismatch.');
    }
    const ttl = RedisClusterTtl.normalize(leaseDurationMs);
    if (ttl === null) throw new Error('Leader lease duration is required.');
    const renewed: ClusterLeader = {
      ...current,
      leaseExpiresAt: new Date(now.getTime() + ttl),
    };
    const result = await this.client.set(
      this.keys.leader(),
      this.serializer.serialize(renewed),
      'PX', ttl, 'XX',
    );
    if (result !== 'OK') {
      throw new Error('Leader lease disappeared before renewal.');
    }
    return this.serializer.clone(renewed);
  }

  async revoke(nodeId: string, term: number): Promise<boolean> {
    const current = await this.get();
    if (!current) return false;
    if (current.nodeId !== nodeId || current.term !== term) {
      throw new Error('Leader lease ownership mismatch.');
    }
    return (await this.client.del(this.keys.leader())) > 0;
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();
    if (!normalized) throw new Error(`${field} is required.`);
    return normalized;
  }
}
