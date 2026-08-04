import type {
  ClusterHealthSnapshot,
} from '../../models';
import {
  RedisClusterKeyFactory,
} from '../key-factory';
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
  RedisMembershipStore,
} from './redis-membership.store';
import {
  RedisSchedulerClaimStore,
} from './redis-scheduler-claim.store';

export class RedisClusterMonitoringService {
  constructor(
    private readonly client:
      RedisClusterStoreClient,
    private readonly keys:
      RedisClusterKeyFactory,
    private readonly membership:
      RedisMembershipStore,
    private readonly leaders:
      RedisLeaderElectionStore,
    private readonly ownership:
      RedisJobOwnershipStore,
    private readonly claims:
      RedisSchedulerClaimStore,
  ) {}

  async snapshot(
    now = new Date(),
  ): Promise<ClusterHealthSnapshot> {
    const nodes = await this.membership.list();
    const offline = await this.membership.offline();
    const leader = await this.leaders.get();
    const ownerships = await this.ownership.list();
    const claims = await this.claims.list();
    const activeLocks = (
      await this.scan(
        this.keys.locksPattern(),
      )
    ).length;

    const activeNodes = nodes.filter(
      (node) =>
        node.state === 'active' &&
        !offline.some(
          (offlineNode) =>
            offlineNode.nodeId === node.nodeId,
        ),
    ).length;

    const degradedNodes = nodes.filter(
      (node) => node.state === 'degraded',
    ).length;

    const drainingNodes = nodes.filter(
      (node) => node.state === 'draining',
    ).length;

    const warnings: string[] = [];

    if (!leader) {
      warnings.push(
        'Cluster has no active leader.',
      );
    }

    if (offline.length > 0) {
      warnings.push(
        `${offline.length} cluster node(s) are offline.`,
      );
    }

    const status =
      activeNodes === 0
        ? 'unhealthy'
        : warnings.length > 0 ||
            degradedNodes > 0 ||
            drainingNodes > 0
          ? 'degraded'
          : 'healthy';

    return {
      status,
      leaderNodeId: leader?.nodeId ?? null,
      totalNodes: nodes.length,
      activeNodes,
      degradedNodes,
      drainingNodes,
      offlineNodes: offline.length,
      activeLocks,
      activeOwnerships: ownerships.length,
      activeSchedulerClaims: claims.filter(
        (claim) => claim.completedAt === null,
      ).length,
      generatedAt: new Date(now),
      warnings,
    };
  }

  private async scan(
    pattern: string,
    count = 100,
  ): Promise<string[]> {
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
}
