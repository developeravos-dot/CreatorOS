import type {
  ClusterMembershipEvent,
  ClusterNode,
} from '../../models';
import { RedisClusterKeyFactory } from '../key-factory';
import { RedisClusterSerializer } from '../serialization';
import type { RedisClusterStoreClient } from './redis-cluster-store-client';

export class RedisMembershipStore {
  constructor(
    private readonly client: RedisClusterStoreClient,
    private readonly keys: RedisClusterKeyFactory,
    private readonly serializer = new RedisClusterSerializer(),
  ) {}

  async register(node: ClusterNode, heartbeatTtlMs: number): Promise<ClusterNode> {
    this.positive(heartbeatTtlMs, 'heartbeatTtlMs');
    await this.client.set(
      this.keys.node(node.nodeId),
      this.serializer.serialize(node),
    );
    await this.client.set(
      this.keys.nodeHeartbeat(node.nodeId),
      this.serializer.serialize({
        nodeId: node.nodeId,
        instanceId: node.instanceId,
        heartbeatAt: node.lastHeartbeatAt,
      }),
      'PX',
      heartbeatTtlMs,
    );
    return this.serializer.clone(node);
  }

  async heartbeat(node: ClusterNode, heartbeatTtlMs: number): Promise<ClusterNode> {
    this.positive(heartbeatTtlMs, 'heartbeatTtlMs');
    if ((await this.client.exists(this.keys.node(node.nodeId))) === 0) {
      throw new Error(`Cluster node ${node.nodeId} is not registered.`);
    }
    return this.register(node, heartbeatTtlMs);
  }

  async get(nodeId: string): Promise<ClusterNode | null> {
    const payload = await this.client.get(this.keys.node(this.text(nodeId, 'nodeId')));
    return payload === null
      ? null
      : this.serializer.deserialize<ClusterNode>(payload);
  }

  async hasLiveHeartbeat(nodeId: string): Promise<boolean> {
    return (await this.client.exists(
      this.keys.nodeHeartbeat(this.text(nodeId, 'nodeId')),
    )) > 0;
  }

  async remove(nodeId: string): Promise<boolean> {
    const id = this.text(nodeId, 'nodeId');
    return (await this.client.del(
      this.keys.node(id),
      this.keys.nodeHeartbeat(id),
    )) > 0;
  }

  async list(count = 100): Promise<readonly ClusterNode[]> {
    const keys = await this.scan(this.keys.nodesPattern(), count);
    if (keys.length === 0) return [];
    const values = await this.client.mget(...keys);
    return values
      .filter((value): value is string => value !== null)
      .map((value) => this.serializer.deserialize<ClusterNode>(value))
      .sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  }

  async offline(count = 100): Promise<readonly ClusterNode[]> {
    const nodes = await this.list(count);
    const states = await Promise.all(nodes.map(async (node) => ({
      node,
      live: await this.hasLiveHeartbeat(node.nodeId),
    })));
    return states.filter((state) => !state.live).map((state) => state.node);
  }

  async appendEvent(
    event: Omit<ClusterMembershipEvent, 'sequence'>,
  ): Promise<ClusterMembershipEvent> {
    const sequence = await this.client.incr(this.keys.membershipSequence());
    const stored: ClusterMembershipEvent = {
      ...event,
      sequence,
      occurredAt: new Date(event.occurredAt),
      payload: this.serializer.clone(event.payload),
    };
    await this.client.set(
      this.keys.membershipEvent(sequence),
      this.serializer.serialize(stored),
    );
    return this.serializer.clone(stored);
  }

  async listEvents(count = 100): Promise<readonly ClusterMembershipEvent[]> {
    const keys = await this.scan(this.keys.membershipEventsPattern(), count);
    if (keys.length === 0) return [];
    const values = await this.client.mget(...keys);
    return values
      .filter((value): value is string => value !== null)
      .map((value) => this.serializer.deserialize<ClusterMembershipEvent>(value))
      .sort((a, b) => a.sequence - b.sequence);
  }

  private async scan(pattern: string, count: number): Promise<string[]> {
    this.positive(count, 'count');
    let cursor = '0';
    const result: string[] = [];
    do {
      const [next, keys] = await this.client.scan(
        cursor, 'MATCH', pattern, 'COUNT', count,
      );
      cursor = next;
      result.push(...keys);
    } while (cursor !== '0');
    return [...new Set(result)].sort();
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();
    if (!normalized) throw new Error(`${field} is required.`);
    return normalized;
  }

  private positive(value: number, field: string): void {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`${field} must be a positive integer.`);
    }
  }
}
