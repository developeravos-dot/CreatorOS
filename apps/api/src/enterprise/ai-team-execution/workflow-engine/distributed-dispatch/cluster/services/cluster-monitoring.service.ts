import {
  Injectable,
} from '@nestjs/common';

import type {
  ClusterHealthSnapshot,
  ClusterMetrics,
} from '../models';
import {
  ClusterJobOwnershipService,
  type ClusterJobOwnershipMetrics,
} from './cluster-job-ownership.service';
import {
  ClusterLeaderElectionService,
  type ClusterElectionMetrics,
} from './cluster-leader-election.service';
import {
  ClusterLockService,
  type ClusterLockMetrics,
} from './cluster-lock.service';
import {
  ClusterMembershipService,
  type ClusterMembershipMetrics,
} from './cluster-membership.service';
import {
  ClusterSchedulerService,
  type ClusterSchedulerMetrics,
} from './cluster-scheduler.service';

export interface ClusterMonitoringSnapshot {
  readonly health:
    ClusterHealthSnapshot;
  readonly metrics:
    ClusterMetrics;
  readonly membership:
    ClusterMembershipMetrics;
  readonly election:
    ClusterElectionMetrics;
  readonly locks:
    ClusterLockMetrics;
  readonly ownership:
    ClusterJobOwnershipMetrics;
  readonly scheduler:
    ClusterSchedulerMetrics;
  readonly generatedAt: Date;
}

@Injectable()
export class ClusterMonitoringService {
  constructor(
    private readonly membership:
      ClusterMembershipService,

    private readonly election:
      ClusterLeaderElectionService,

    private readonly locks:
      ClusterLockService,

    private readonly ownership:
      ClusterJobOwnershipService,

    private readonly scheduler:
      ClusterSchedulerService,
  ) {}

  collect(
    generatedAt =
      new Date(),
  ): ClusterMonitoringSnapshot {
    const now =
      new Date(generatedAt);

    const membership =
      this.membership.getMetrics(
        now,
      );

    const election =
      this.election.getMetrics(
        now,
      );

    const locks =
      this.locks.getMetrics(
        now,
      );

    const ownership =
      this.ownership.getMetrics(
        now,
      );

    const scheduler =
      this.scheduler.getMetrics(
        now,
      );

    const leader =
      this.election.getLeader(
        now,
      );

    const warnings =
      this.createWarnings({
        membership,
        election,
        locks,
        ownership,
        scheduler,
        leaderNodeId:
          leader?.nodeId ??
          null,
      });

    const health:
      ClusterHealthSnapshot = {
      status:
        this.resolveStatus(
          membership,
          scheduler,
          warnings,
          leader?.nodeId ??
          null,
        ),
      leaderNodeId:
        leader?.nodeId ??
        null,
      totalNodes:
        membership.registeredNodes,
      activeNodes:
        membership.activeNodes,
      degradedNodes:
        membership.degradedNodes,
      drainingNodes:
        membership.drainingNodes,
      offlineNodes:
        membership.offlineNodes,
      activeLocks:
        locks.activeLocks,
      activeOwnerships:
        ownership.activeOwnerships,
      activeSchedulerClaims:
        scheduler.activeClaims,
      generatedAt: now,
      warnings,
    };

    const metrics:
      ClusterMetrics = {
      nodeJoins:
        this.membership
          .listEvents()
          .filter(
            (event) =>
              event.type ===
              'node.joined',
          ).length,
      nodeRemovals:
        membership.removedNodes,
      leaderElections:
        election.elections,
      leaderFailovers:
        election.failovers,
      lockAcquisitions:
        locks.acquisitions,
      lockConflicts:
        locks.conflicts,
      ownershipAssignments:
        ownership.assignments,
      ownershipTransfers:
        ownership.transfers,
      ownershipRecoveries:
        ownership.recoveries,
      schedulerClaims:
        scheduler.claims,
      duplicateExecutionsPrevented:
        scheduler
          .duplicateExecutionsPrevented,
      collectedAt: now,
    };

    return {
      health:
        this.cloneHealth(
          health,
        ),
      metrics:
        this.cloneClusterMetrics(
          metrics,
        ),
      membership: {
        ...membership,
        collectedAt:
          new Date(
            membership.collectedAt,
          ),
      },
      election: {
        ...election,
        collectedAt:
          new Date(
            election.collectedAt,
          ),
      },
      locks: {
        ...locks,
        collectedAt:
          new Date(
            locks.collectedAt,
          ),
      },
      ownership: {
        ...ownership,
        collectedAt:
          new Date(
            ownership.collectedAt,
          ),
      },
      scheduler: {
        ...scheduler,
        collectedAt:
          new Date(
            scheduler.collectedAt,
          ),
      },
      generatedAt: now,
    };
  }

  private createWarnings(
    input: {
      readonly membership:
        ClusterMembershipMetrics;
      readonly election:
        ClusterElectionMetrics;
      readonly locks:
        ClusterLockMetrics;
      readonly ownership:
        ClusterJobOwnershipMetrics;
      readonly scheduler:
        ClusterSchedulerMetrics;
      readonly leaderNodeId:
        string | null;
    },
  ): readonly string[] {
    const warnings:
      string[] = [];

    if (
      input.membership
        .registeredNodes > 0 &&
      input.leaderNodeId === null
    ) {
      warnings.push(
        'cluster_leader_missing',
      );
    }

    if (
      input.membership
        .offlineNodes > 0
    ) {
      warnings.push(
        'cluster_nodes_offline',
      );
    }

    if (
      input.membership
        .degradedNodes > 0
    ) {
      warnings.push(
        'cluster_nodes_degraded',
      );
    }

    if (
      input.scheduler
        .leaderRejections > 0
    ) {
      warnings.push(
        'non_leader_schedule_attempts',
      );
    }

    if (
      input.scheduler
        .duplicateExecutionsPrevented > 0
    ) {
      warnings.push(
        'duplicate_schedule_attempts_detected',
      );
    }

    if (
      input.locks.conflicts > 0
    ) {
      warnings.push(
        'cluster_lock_conflicts_detected',
      );
    }

    if (
      input.ownership.conflicts > 0
    ) {
      warnings.push(
        'cluster_ownership_conflicts_detected',
      );
    }

    return warnings.sort();
  }

  private resolveStatus(
    membership:
      ClusterMembershipMetrics,
    scheduler:
      ClusterSchedulerMetrics,
    warnings:
      readonly string[],
    leaderNodeId:
      string | null,
  ): ClusterHealthSnapshot['status'] {
    if (
      membership.registeredNodes > 0 &&
      (
        leaderNodeId === null ||
        membership.activeNodes === 0
      )
    ) {
      return 'unhealthy';
    }

    if (
      membership.offlineNodes >
      membership.activeNodes
    ) {
      return 'unhealthy';
    }

    if (
      scheduler.leaderRejections > 0 ||
      warnings.length > 0
    ) {
      return 'degraded';
    }

    return 'healthy';
  }

  private cloneHealth(
    health:
      ClusterHealthSnapshot,
  ): ClusterHealthSnapshot {
    return {
      ...health,
      generatedAt:
        new Date(
          health.generatedAt,
        ),
      warnings: [
        ...health.warnings,
      ],
    };
  }

  private cloneClusterMetrics(
    metrics:
      ClusterMetrics,
  ): ClusterMetrics {
    return {
      ...metrics,
      collectedAt:
        new Date(
          metrics.collectedAt,
        ),
    };
  }
}