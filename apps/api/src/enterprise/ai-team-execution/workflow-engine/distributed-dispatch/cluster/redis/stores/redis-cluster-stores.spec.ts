import type { ClusterNode } from '../../models';
import { RedisClusterKeyFactory } from '../key-factory';
import { RedisClusterNamespace } from '../namespace';
import { RedisClusterLockStore } from './redis-cluster-lock.store';
import type { RedisClusterStoreClient } from './redis-cluster-store-client';
import { RedisCoordinationStateStore } from './redis-coordination-state.store';
import { RedisLeaderElectionStore } from './redis-leader-election.store';
import { RedisMembershipStore } from './redis-membership.store';

class FakeRedisClient implements RedisClusterStoreClient {
  private readonly values = new Map<string, string>();
  private readonly counters = new Map<string, number>();

  async get(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async set(
    key: string,
    value: string,
    ...args: Array<string | number>
  ): Promise<string | null> {
    if (args.includes('NX') && this.values.has(key)) return null;
    if (args.includes('XX') && !this.values.has(key)) return null;
    this.values.set(key, value);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let removed = 0;
    for (const key of keys) {
      if (this.values.delete(key)) removed += 1;
    }
    return removed;
  }

  async exists(key: string): Promise<number> {
    return this.values.has(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const next = (this.counters.get(key) ?? 0) + 1;
    this.counters.set(key, next);
    return next;
  }

  async mget(...keys: string[]): Promise<Array<string | null>> {
    return keys.map((key) => this.values.get(key) ?? null);
  }

  async scan(
    _cursor: string,
    ...args: Array<string | number>
  ): Promise<[string, string[]]> {
    const index = args.indexOf('MATCH');
    const pattern = index >= 0 ? String(args[index + 1]) : '*';
    const prefix = pattern.endsWith('*')
      ? pattern.slice(0, -1)
      : pattern;
    return [
      '0',
      [...this.values.keys()]
        .filter((key) => key.startsWith(prefix))
        .sort(),
    ];
  }
}

describe('Redis cluster D2 stores', () => {
  function setup() {
    const client = new FakeRedisClient();
    const keys = new RedisClusterKeyFactory(
      new RedisClusterNamespace({
        application: 'creatoros',
        environment: 'test',
        clusterId: 'd2',
      }),
    );
    return {
      membership: new RedisMembershipStore(client, keys),
      leaders: new RedisLeaderElectionStore(client, keys),
      locks: new RedisClusterLockStore(client, keys),
      coordination: new RedisCoordinationStateStore(client, keys),
    };
  }

  function node(nodeId: string): ClusterNode {
    const now = new Date('2026-08-04T10:00:00.000Z');
    return {
      nodeId,
      instanceId: `${nodeId}-instance`,
      host: `${nodeId}.internal`,
      processId: 100,
      role: 'follower',
      state: 'active',
      term: 0,
      capabilities: {
        queues: ['workflow-step'],
        jobTypes: ['workflow.execute'],
        maximumConcurrency: 4,
        labels: {},
      },
      activeJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      memoryUsageBytes: null,
      cpuUsagePercent: null,
      joinedAt: now,
      lastHeartbeatAt: now,
      updatedAt: now,
      metadata: {},
    };
  }

  it('stores membership state', async () => {
    const runtime = setup();
    const value = node('node-a');
    await runtime.membership.register(value, 60_000);
    await expect(runtime.membership.get('node-a')).resolves.toEqual(value);
    await expect(
      runtime.membership.hasLiveHeartbeat('node-a'),
    ).resolves.toBe(true);
  });

  it('prevents duplicate leaders', async () => {
    const runtime = setup();
    const first = await runtime.leaders.elect({
      nodeId: 'node-a',
      instanceId: 'node-a-instance',
      leaseDurationMs: 60_000,
    });
    const second = await runtime.leaders.elect({
      nodeId: 'node-b',
      instanceId: 'node-b-instance',
      leaseDurationMs: 60_000,
    });
    expect(first?.nodeId).toBe('node-a');
    expect(second).toBeNull();
  });

  it('protects locks with fencing tokens', async () => {
    const runtime = setup();
    const first = await runtime.locks.acquire(
      'workflow:one',
      'node-a',
      60_000,
    );
    const second = await runtime.locks.acquire(
      'workflow:one',
      'node-b',
      60_000,
    );
    expect(first?.fencingToken).toBeGreaterThan(0);
    expect(second).toBeNull();
  });

  it('uses optimistic coordination versions', async () => {
    const runtime = setup();
    const first = await runtime.coordination.create(
      'cursor',
      { sequence: 1 },
      'node-a',
    );
    const second = await runtime.coordination.compareAndSet(
      'cursor',
      first.version,
      { sequence: 2 },
      'node-a',
    );
    expect(second.version).toBe(2);
    await expect(
      runtime.coordination.compareAndSet(
        'cursor',
        1,
        { sequence: 3 },
        'node-b',
      ),
    ).rejects.toThrow('version conflict');
  });
});
