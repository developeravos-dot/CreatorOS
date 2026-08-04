import type {
  ClusterNode,
} from '../../models';
import {
  RedisClusterKeyFactory,
} from '../key-factory';
import {
  RedisClusterNamespace,
} from '../namespace';
import {
  RedisClusterMonitoringService,
} from './redis-cluster-monitoring.service';
import {
  RedisClusterLockStore,
} from './redis-cluster-lock.store';
import type {
  RedisClusterStoreClient,
} from './redis-cluster-store-client';
import {
  RedisJobOwnershipStore,
} from './redis-job-ownership.store';
import {
  RedisLeaderElectionStore,
} from './redis-leader-election.store';
import {
  RedisLostNodeRecoveryService,
} from './redis-lost-node-recovery.service';
import {
  RedisMembershipStore,
} from './redis-membership.store';
import {
  RedisSchedulerClaimStore,
} from './redis-scheduler-claim.store';

class FakeRedisClient
  implements RedisClusterStoreClient
{
  private readonly values =
    new Map<string, string>();

  private readonly counters =
    new Map<string, number>();

  async get(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async set(
    key: string,
    value: string,
    ...args: Array<string | number>
  ): Promise<string | null> {
    if (args.includes('NX') && this.values.has(key)) {
      return null;
    }

    if (args.includes('XX') && !this.values.has(key)) {
      return null;
    }

    this.values.set(key, value);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let removed = 0;

    for (const key of keys) {
      if (this.values.delete(key)) {
        removed += 1;
      }
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

  async mget(
    ...keys: string[]
  ): Promise<Array<string | null>> {
    return keys.map((key) =>
      this.values.get(key) ?? null,
    );
  }

  async scan(
    _cursor: string,
    ...args: Array<string | number>
  ): Promise<[string, string[]]> {
    const matchIndex = args.indexOf('MATCH');

    const pattern =
      matchIndex >= 0
        ? String(args[matchIndex + 1])
        : '*';

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

  removeKey(key: string): void {
    this.values.delete(key);
  }
}

describe('Redis cluster D3 stores', () => {
  function node(nodeId: string): ClusterNode {
    const now = new Date(
      '2026-08-04T10:00:00.000Z',
    );

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

  function setup() {
    const client = new FakeRedisClient();

    const keys = new RedisClusterKeyFactory(
      new RedisClusterNamespace({
        application: 'creatoros',
        environment: 'test',
        clusterId: 'd3',
      }),
    );

    const membership = new RedisMembershipStore(
      client,
      keys,
    );

    const leaders = new RedisLeaderElectionStore(
      client,
      keys,
    );

    const locks = new RedisClusterLockStore(
      client,
      keys,
    );

    const ownership = new RedisJobOwnershipStore(
      client,
      keys,
    );

    const claims = new RedisSchedulerClaimStore(
      client,
      keys,
    );

    return {
      client,
      keys,
      membership,
      leaders,
      locks,
      ownership,
      claims,
      recovery: new RedisLostNodeRecoveryService(
        membership,
        ownership,
      ),
      monitoring:
        new RedisClusterMonitoringService(
          client,
          keys,
          membership,
          leaders,
          ownership,
          claims,
        ),
    };
  }

  it('prevents duplicate scheduler execution', async () => {
    const runtime = setup();

    const first = await runtime.claims.claim({
      scheduleId: 'schedule-one',
      nodeId: 'node-a',
      executionKey: 'schedule-one:run-one',
      leaseDurationMs: 60_000,
    });

    const duplicate = await runtime.claims.claim({
      scheduleId: 'schedule-one',
      nodeId: 'node-b',
      executionKey: 'schedule-one:run-one',
      leaseDurationMs: 60_000,
    });

    expect(first).not.toBeNull();
    expect(duplicate).toBeNull();
  });

  it('assigns and transfers job ownership', async () => {
    const runtime = setup();

    const assigned = await runtime.ownership.assign({
      resourceType: 'workflow-execution',
      resourceId: 'execution-one',
      ownerNodeId: 'node-a',
      leaseDurationMs: 60_000,
    });

    expect(assigned?.state).toBe('assigned');

    const transferred =
      await runtime.ownership.transfer(
        'workflow-execution',
        'execution-one',
        'node-a',
        'node-b',
        60_000,
      );

    expect(transferred.state).toBe('transferred');
    expect(transferred.ownerNodeId).toBe('node-b');
  });

  it('recovers ownership from a lost node', async () => {
    const runtime = setup();

    await runtime.membership.register(
      node('node-a'),
      60_000,
    );

    await runtime.membership.register(
      node('node-b'),
      60_000,
    );

    await runtime.ownership.assign({
      resourceType: 'workflow-execution',
      resourceId: 'execution-one',
      ownerNodeId: 'node-a',
      leaseDurationMs: 60_000,
    });

    runtime.client.removeKey(
      runtime.keys.nodeHeartbeat('node-a'),
    );

    const result = await runtime.recovery.recover(
      'node-a',
      'node-b',
      60_000,
    );

    expect(result.recoveredOwnerships).toHaveLength(1);
    expect(
      result.recoveredOwnerships[0]?.state,
    ).toBe('recovered');
    expect(
      result.recoveredOwnerships[0]?.ownerNodeId,
    ).toBe('node-b');
  });

  it('produces global Redis cluster health', async () => {
    const runtime = setup();

    await runtime.membership.register(
      node('node-a'),
      60_000,
    );

    await runtime.leaders.elect({
      nodeId: 'node-a',
      instanceId: 'node-a-instance',
      leaseDurationMs: 60_000,
    });

    await runtime.locks.acquire(
      'workflow:one',
      'node-a',
      60_000,
    );

    await runtime.ownership.assign({
      resourceType: 'workflow-execution',
      resourceId: 'execution-one',
      ownerNodeId: 'node-a',
      leaseDurationMs: 60_000,
    });

    await runtime.claims.claim({
      scheduleId: 'schedule-one',
      nodeId: 'node-a',
      executionKey: 'schedule-one:run-one',
      leaseDurationMs: 60_000,
    });

    const snapshot =
      await runtime.monitoring.snapshot();

    expect(snapshot.status).toBe('healthy');
    expect(snapshot.leaderNodeId).toBe('node-a');
    expect(snapshot.activeLocks).toBe(1);
    expect(snapshot.activeOwnerships).toBe(1);
    expect(snapshot.activeSchedulerClaims).toBe(1);
  });
});
