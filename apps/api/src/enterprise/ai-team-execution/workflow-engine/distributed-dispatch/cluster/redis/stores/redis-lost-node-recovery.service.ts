import type {
  ClusterOwnership,
} from '../../models';
import {
  RedisJobOwnershipStore,
} from './redis-job-ownership.store';
import {
  RedisMembershipStore,
} from './redis-membership.store';

export interface RedisLostNodeRecoveryResult {
  readonly lostNodeId: string;
  readonly targetNodeId: string;
  readonly recoveredOwnerships:
    readonly ClusterOwnership[];
  readonly recoveredAt: Date;
}

export class RedisLostNodeRecoveryService {
  constructor(
    private readonly membership:
      RedisMembershipStore,
    private readonly ownership:
      RedisJobOwnershipStore,
  ) {}

  async recover(
    lostNodeId: string,
    targetNodeId: string,
    leaseDurationMs: number,
    now = new Date(),
  ): Promise<RedisLostNodeRecoveryResult> {
    const lost = this.text(
      lostNodeId,
      'lostNodeId',
    );

    const target = this.text(
      targetNodeId,
      'targetNodeId',
    );

    if (
      await this.membership.hasLiveHeartbeat(lost)
    ) {
      throw new Error(
        `Cluster node ${lost} still has a live heartbeat.`,
      );
    }

    const targetNode =
      await this.membership.get(target);

    if (
      !targetNode ||
      !(
        await this.membership.hasLiveHeartbeat(
          target,
        )
      )
    ) {
      throw new Error(
        `Recovery target node ${target} is unavailable.`,
      );
    }

    const current =
      await this.ownership.listByOwner(lost);

    const recovered: ClusterOwnership[] = [];

    for (const item of current) {
      recovered.push(
        await this.ownership.transfer(
          item.resourceType,
          item.resourceId,
          lost,
          target,
          leaseDurationMs,
          'recovered',
          now,
        ),
      );
    }

    return {
      lostNodeId: lost,
      targetNodeId: target,
      recoveredOwnerships: recovered,
      recoveredAt: new Date(now),
    };
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error(`${field} is required.`);
    }

    return normalized;
  }
}
