import {
  Injectable,
} from '@nestjs/common';

import type {
  ClusterSchedulerClaimInput,
} from '../contracts';
import type {
  ClusterSchedulerClaim,
} from '../models';
import {
  ClusterLeaderElectionService,
} from './cluster-leader-election.service';
import {
  ClusterLockService,
} from './cluster-lock.service';

export interface ClusterSchedulerMetrics {
  readonly claims: number;
  readonly completions: number;
  readonly releases: number;
  readonly expirations: number;
  readonly duplicateExecutionsPrevented: number;
  readonly leaderRejections: number;
  readonly activeClaims: number;
  readonly collectedAt: Date;
}

@Injectable()
export class ClusterSchedulerService {
  private readonly claims =
    new Map<
      string,
      ClusterSchedulerClaim
    >();

  private nextFencingToken = 1;

  private claimsCreated = 0;

  private completions = 0;

  private releases = 0;

  private expirations = 0;

  private duplicateExecutionsPrevented = 0;

  private leaderRejections = 0;

  constructor(
    private readonly leaderElection:
      ClusterLeaderElectionService,

    private readonly locks:
      ClusterLockService,
  ) {}

  claim(
    input:
      ClusterSchedulerClaimInput,
  ): ClusterSchedulerClaim {
    const scheduleId =
      this.requireText(
        input.scheduleId,
        'scheduleId',
      );

    const nodeId =
      this.requireText(
        input.nodeId,
        'nodeId',
      );

    const executionKey =
      this.requireText(
        input.executionKey,
        'executionKey',
      );

    const leaseDurationMs =
      this.requirePositiveInteger(
        input.leaseDurationMs,
        'leaseDurationMs',
      );

    const now =
      new Date(
        input.now ??
        new Date(),
      );

    if (
      !this.leaderElection.isLeader(
        nodeId,
        now,
      )
    ) {
      this.leaderRejections += 1;

      throw new Error(
        `Only the active cluster leader can claim schedule ${scheduleId}.`,
      );
    }

    this.expire(now);

    const existing =
      this.claims.get(
        executionKey,
      );

    if (
      existing &&
      existing.completedAt === null &&
      existing.expiresAt.getTime() >
        now.getTime()
    ) {
      this.duplicateExecutionsPrevented += 1;

      throw new Error(
        `Execution ${executionKey} is already claimed by node ${existing.nodeId}.`,
      );
    }

    const lock =
      this.locks.acquire({
        resourceKey:
          this.createLockKey(
            executionKey,
          ),
        ownerNodeId:
          nodeId,
        leaseDurationMs,
        now,
      });

    const claim:
      ClusterSchedulerClaim = {
      scheduleId,
      nodeId,
      executionKey,
      fencingToken:
        lock.fencingToken,
      claimedAt: now,
      expiresAt:
        new Date(
          now.getTime() +
          leaseDurationMs,
        ),
      completedAt: null,
    };

    this.claims.set(
      executionKey,
      this.cloneClaim(
        claim,
      ),
    );

    this.nextFencingToken =
      Math.max(
        this.nextFencingToken,
        lock.fencingToken + 1,
      );

    this.claimsCreated += 1;

    return this.cloneClaim(
      claim,
    );
  }

  renew(
    executionKey: string,
    nodeId: string,
    fencingToken: number,
    leaseDurationMs: number,
    now =
      new Date(),
  ): ClusterSchedulerClaim {
    const normalizedExecutionKey =
      this.requireText(
        executionKey,
        'executionKey',
      );

    const normalizedNodeId =
      this.requireText(
        nodeId,
        'nodeId',
      );

    const duration =
      this.requirePositiveInteger(
        leaseDurationMs,
        'leaseDurationMs',
      );

    const currentTime =
      new Date(now);

    const claim =
      this.requireActiveClaim(
        normalizedExecutionKey,
        currentTime,
      );

    this.assertClaimOwner(
      claim,
      normalizedNodeId,
      fencingToken,
    );

    if (
      !this.leaderElection.isLeader(
        normalizedNodeId,
        currentTime,
      )
    ) {
      this.leaderRejections += 1;

      throw new Error(
        `Node ${normalizedNodeId} is not the active cluster leader.`,
      );
    }

    this.locks.renew(
      this.createLockKey(
        normalizedExecutionKey,
      ),
      normalizedNodeId,
      fencingToken,
      duration,
      currentTime,
    );

    const renewed:
      ClusterSchedulerClaim = {
      ...claim,
      expiresAt:
        new Date(
          currentTime.getTime() +
          duration,
        ),
    };

    this.claims.set(
      normalizedExecutionKey,
      this.cloneClaim(
        renewed,
      ),
    );

    return this.cloneClaim(
      renewed,
    );
  }

  complete(
    executionKey: string,
    nodeId: string,
    fencingToken: number,
    now =
      new Date(),
  ): ClusterSchedulerClaim {
    const normalizedExecutionKey =
      this.requireText(
        executionKey,
        'executionKey',
      );

    const currentTime =
      new Date(now);

    const claim =
      this.requireActiveClaim(
        normalizedExecutionKey,
        currentTime,
      );

    this.assertClaimOwner(
      claim,
      this.requireText(
        nodeId,
        'nodeId',
      ),
      fencingToken,
    );

    this.locks.release(
      this.createLockKey(
        normalizedExecutionKey,
      ),
      claim.nodeId,
      fencingToken,
      currentTime,
    );

    const completed:
      ClusterSchedulerClaim = {
      ...claim,
      expiresAt:
        currentTime,
      completedAt:
        currentTime,
    };

    this.claims.set(
      normalizedExecutionKey,
      this.cloneClaim(
        completed,
      ),
    );

    this.completions += 1;

    return this.cloneClaim(
      completed,
    );
  }

  release(
    executionKey: string,
    nodeId: string,
    fencingToken: number,
    now =
      new Date(),
  ): boolean {
    const normalizedExecutionKey =
      this.requireText(
        executionKey,
        'executionKey',
      );

    const currentTime =
      new Date(now);

    const claim =
      this.requireActiveClaim(
        normalizedExecutionKey,
        currentTime,
      );

    this.assertClaimOwner(
      claim,
      this.requireText(
        nodeId,
        'nodeId',
      ),
      fencingToken,
    );

    this.locks.release(
      this.createLockKey(
        normalizedExecutionKey,
      ),
      claim.nodeId,
      fencingToken,
      currentTime,
    );

    const removed =
      this.claims.delete(
        normalizedExecutionKey,
      );

    if (removed) {
      this.releases += 1;
    }

    return removed;
  }

  expire(
    now =
      new Date(),
  ): readonly ClusterSchedulerClaim[] {
    const currentTime =
      new Date(now);

    const expired:
      ClusterSchedulerClaim[] = [];

    for (
      const [
        executionKey,
        claim,
      ]
      of this.claims
    ) {
      if (
        claim.completedAt !== null ||
        claim.expiresAt.getTime() >
          currentTime.getTime()
      ) {
        continue;
      }

      this.claims.delete(
        executionKey,
      );

      expired.push(
        this.cloneClaim(claim),
      );

      this.expirations += 1;
    }

    this.locks.expire(
      currentTime,
    );

    return expired;
  }

  get(
    executionKey: string,
    now =
      new Date(),
  ): ClusterSchedulerClaim | null {
    const normalizedExecutionKey =
      this.requireText(
        executionKey,
        'executionKey',
      );

    this.expire(now);

    const claim =
      this.claims.get(
        normalizedExecutionKey,
      );

    return claim
      ? this.cloneClaim(claim)
      : null;
  }

  list(
    now =
      new Date(),
  ): readonly ClusterSchedulerClaim[] {
    this.expire(now);

    return [
      ...this.claims.values(),
    ]
      .sort(
        (left, right) =>
          left.executionKey.localeCompare(
            right.executionKey,
          ),
      )
      .map(
        (claim) =>
          this.cloneClaim(claim),
      );
  }

  listActive(
    now =
      new Date(),
  ): readonly ClusterSchedulerClaim[] {
    const currentTime =
      new Date(now);

    return this.list(
      currentTime,
    ).filter(
      (claim) =>
        claim.completedAt === null &&
        claim.expiresAt.getTime() >
          currentTime.getTime(),
    );
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): ClusterSchedulerMetrics {
    const activeClaims =
      this.listActive(
        collectedAt,
      ).length;

    return {
      claims:
        this.claimsCreated,
      completions:
        this.completions,
      releases:
        this.releases,
      expirations:
        this.expirations,
      duplicateExecutionsPrevented:
        this.duplicateExecutionsPrevented,
      leaderRejections:
        this.leaderRejections,
      activeClaims,
      collectedAt:
        new Date(collectedAt),
    };
  }

  private requireActiveClaim(
    executionKey: string,
    now: Date,
  ): ClusterSchedulerClaim {
    this.expire(now);

    const claim =
      this.claims.get(
        executionKey,
      );

    if (
      !claim ||
      claim.completedAt !== null
    ) {
      throw new Error(
        `Active scheduler claim ${executionKey} was not found.`,
      );
    }

    return claim;
  }

  private assertClaimOwner(
    claim:
      ClusterSchedulerClaim,
    nodeId: string,
    fencingToken: number,
  ): void {
    if (
      claim.nodeId !== nodeId
    ) {
      throw new Error(
        `Node ${nodeId} does not own scheduler claim ${claim.executionKey}.`,
      );
    }

    if (
      claim.fencingToken !==
      fencingToken
    ) {
      throw new Error(
        `Invalid fencing token for scheduler claim ${claim.executionKey}.`,
      );
    }
  }

  private createLockKey(
    executionKey: string,
  ): string {
    return (
      'cluster-schedule:' +
      executionKey
    );
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        `${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private requirePositiveInteger(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isInteger(value) ||
      value < 1
    ) {
      throw new Error(
        `${fieldName} must be a positive integer.`,
      );
    }

    return value;
  }

  private cloneClaim(
    claim:
      ClusterSchedulerClaim,
  ): ClusterSchedulerClaim {
    return {
      ...claim,
      claimedAt:
        new Date(
          claim.claimedAt,
        ),
      expiresAt:
        new Date(
          claim.expiresAt,
        ),
      completedAt:
        claim.completedAt
          ? new Date(
              claim.completedAt,
            )
          : null,
    };
  }
}