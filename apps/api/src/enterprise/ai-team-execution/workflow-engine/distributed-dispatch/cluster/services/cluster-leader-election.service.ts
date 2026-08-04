import {
  Injectable,
} from '@nestjs/common';

import type {
  ClusterElectionRequest,
} from '../contracts';
import type {
  ClusterLeader,
  ClusterMembershipEvent,
} from '../models';
import {
  ClusterMembershipService,
} from './cluster-membership.service';

export interface ClusterElectionMetrics {
  readonly elections: number;
  readonly renewals: number;
  readonly revocations: number;
  readonly failovers: number;
  readonly rejectedElections: number;
  readonly currentTerm: number;
  readonly collectedAt: Date;
}

@Injectable()
export class ClusterLeaderElectionService {
  private leader:
    ClusterLeader | null = null;

  private currentTerm = 0;

  private elections = 0;

  private renewals = 0;

  private revocations = 0;

  private failovers = 0;

  private rejectedElections = 0;

  private readonly events:
    ClusterMembershipEvent[] = [];

  private nextSequence = 1;

  constructor(
    private readonly membership:
      ClusterMembershipService,
  ) {}

  elect(
    request:
      ClusterElectionRequest,
    leaseDurationMs = 30_000,
  ): ClusterLeader {
    this.validateLeaseDuration(
      leaseDurationMs,
    );

    if (
      !Number.isInteger(
        request.term,
      ) ||
      request.term <=
      this.currentTerm
    ) {
      this.rejectedElections += 1;

      throw new Error(
        `Election term must be greater than current term ${this.currentTerm}.`,
      );
    }

    const candidateNodeId =
      this.requireText(
        request.candidateNodeId,
        'candidateNodeId',
      );

    const eligibleNodeIds =
      new Set(
        request.eligibleNodeIds
          .map(
            (nodeId) =>
              nodeId.trim(),
          )
          .filter(Boolean),
      );

    if (
      !eligibleNodeIds.has(
        candidateNodeId,
      )
    ) {
      this.rejectedElections += 1;

      throw new Error(
        `Candidate ${candidateNodeId} is not eligible for election.`,
      );
    }

    const candidate =
      this.membership.require(
        candidateNodeId,
      );

    if (
      candidate.state !== 'active'
    ) {
      this.rejectedElections += 1;

      throw new Error(
        `Candidate ${candidateNodeId} is not active.`,
      );
    }

    const now =
      new Date(
        request.now ??
        new Date(),
      );

    const previousLeader =
      this.getActiveLeader(now);

    if (
      previousLeader &&
      previousLeader.nodeId !==
      candidateNodeId
    ) {
      this.membership.setRole(
        previousLeader.nodeId,
        'follower',
        request.term,
        now,
      );

      this.failovers += 1;

      this.appendEvent(
        'leader.revoked',
        previousLeader.nodeId,
        request.term,
        now,
        {
          replacementNodeId:
            candidateNodeId,
        },
      );
    }

    for (
      const node
      of this.membership.list()
    ) {
      if (
        node.nodeId ===
        candidateNodeId ||
        node.role !== 'leader'
      ) {
        continue;
      }

      this.membership.setRole(
        node.nodeId,
        'follower',
        request.term,
        now,
      );
    }

    const electedNode =
      this.membership.setRole(
        candidateNodeId,
        'leader',
        request.term,
        now,
      );

    const leader:
      ClusterLeader = {
      nodeId:
        electedNode.nodeId,
      instanceId:
        electedNode.instanceId,
      term:
        request.term,
      electedAt: now,
      leaseExpiresAt:
        new Date(
          now.getTime() +
          leaseDurationMs,
        ),
    };

    this.leader =
      this.cloneLeader(leader);

    this.currentTerm =
      request.term;

    this.elections += 1;

    this.appendEvent(
      'leader.elected',
      candidateNodeId,
      request.term,
      now,
      {
        leaseDurationMs,
      },
    );

    return this.cloneLeader(
      leader,
    );
  }

  electDeterministically(
    term: number,
    eligibleNodeIds:
      readonly string[],
    leaseDurationMs = 30_000,
    now =
      new Date(),
  ): ClusterLeader {
    const eligibleNodes =
      this.membership
        .list()
        .filter(
          (node) =>
            eligibleNodeIds.includes(
              node.nodeId,
            ) &&
            node.state === 'active',
        )
        .sort(
          (left, right) => {
            const capacityDifference =
              right.capabilities
                .maximumConcurrency -
              left.capabilities
                .maximumConcurrency;

            if (
              capacityDifference !== 0
            ) {
              return capacityDifference;
            }

            return left.nodeId.localeCompare(
              right.nodeId,
            );
          },
        );

    const candidate =
      eligibleNodes[0];

    if (!candidate) {
      this.rejectedElections += 1;

      throw new Error(
        'No active eligible cluster node is available.',
      );
    }

    return this.elect(
      {
        candidateNodeId:
          candidate.nodeId,
        term,
        eligibleNodeIds,
        now,
      },
      leaseDurationMs,
    );
  }

  renew(
    nodeId: string,
    term: number,
    leaseDurationMs = 30_000,
    now =
      new Date(),
  ): ClusterLeader {
    this.validateLeaseDuration(
      leaseDurationMs,
    );

    const normalizedNodeId =
      this.requireText(
        nodeId,
        'nodeId',
      );

    const currentTime =
      new Date(now);

    const leader =
      this.getActiveLeader(
        currentTime,
      );

    if (!leader) {
      throw new Error(
        'There is no active leader to renew.',
      );
    }

    if (
      leader.nodeId !==
      normalizedNodeId
    ) {
      throw new Error(
        `Node ${normalizedNodeId} is not the current leader.`,
      );
    }

    if (leader.term !== term) {
      throw new Error(
        `Leader term mismatch. Expected ${leader.term}; received ${term}.`,
      );
    }

    const member =
      this.membership.require(
        normalizedNodeId,
      );

    if (
      member.state !== 'active' ||
      member.role !== 'leader'
    ) {
      throw new Error(
        `Leader node ${normalizedNodeId} is not active.`,
      );
    }

    const renewed:
      ClusterLeader = {
      ...leader,
      leaseExpiresAt:
        new Date(
          currentTime.getTime() +
          leaseDurationMs,
        ),
    };

    this.leader =
      this.cloneLeader(renewed);

    this.renewals += 1;

    return this.cloneLeader(
      renewed,
    );
  }

  revoke(
    reason = 'manual',
    now =
      new Date(),
  ): ClusterLeader | null {
    const currentTime =
      new Date(now);

    const leader =
      this.leader;

    if (!leader) {
      return null;
    }

    const member =
      this.membership.get(
        leader.nodeId,
      );

    if (
      member &&
      member.state !== 'removed'
    ) {
      this.membership.setRole(
        leader.nodeId,
        'follower',
        Math.max(
          leader.term,
          member.term,
        ),
        currentTime,
      );
    }

    this.appendEvent(
      'leader.revoked',
      leader.nodeId,
      leader.term,
      currentTime,
      {
        reason,
      },
    );

    this.leader = null;
    this.revocations += 1;

    return this.cloneLeader(
      leader,
    );
  }

  failover(
    eligibleNodeIds:
      readonly string[],
    leaseDurationMs = 30_000,
    now =
      new Date(),
  ): ClusterLeader {
    const currentTime =
      new Date(now);

    const previousLeader =
      this.leader;

    const excludedLeaderId =
      previousLeader?.nodeId ??
      null;

    if (previousLeader) {
      this.revoke(
        'failover',
        currentTime,
      );
    }

    const candidates =
      eligibleNodeIds.filter(
        (nodeId) =>
          nodeId !==
          excludedLeaderId,
      );

    const elected =
      this.electDeterministically(
        this.currentTerm + 1,
        candidates,
        leaseDurationMs,
        currentTime,
      );

    if (previousLeader) {
      this.failovers += 1;
    }

    return elected;
  }

  getLeader(
    now =
      new Date(),
  ): ClusterLeader | null {
    return this.getActiveLeader(
      new Date(now),
    );
  }

  isLeader(
    nodeId: string,
    now =
      new Date(),
  ): boolean {
    const leader =
      this.getLeader(now);

    return (
      leader?.nodeId ===
      this.requireText(
        nodeId,
        'nodeId',
      )
    );
  }

  listEvents():
    readonly ClusterMembershipEvent[] {
    return this.events.map(
      (event) => ({
        ...event,
        occurredAt:
          new Date(
            event.occurredAt,
          ),
        payload: {
          ...event.payload,
        },
      }),
    );
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): ClusterElectionMetrics {
    return {
      elections:
        this.elections,
      renewals:
        this.renewals,
      revocations:
        this.revocations,
      failovers:
        this.failovers,
      rejectedElections:
        this.rejectedElections,
      currentTerm:
        this.currentTerm,
      collectedAt:
        new Date(collectedAt),
    };
  }

  private getActiveLeader(
    now: Date,
  ): ClusterLeader | null {
    if (!this.leader) {
      return null;
    }

    if (
      this.leader
        .leaseExpiresAt
        .getTime() <=
      now.getTime()
    ) {
      const expired =
        this.leader;

      const member =
        this.membership.get(
          expired.nodeId,
        );

      if (
        member &&
        member.state !== 'removed'
      ) {
        this.membership.setRole(
          expired.nodeId,
          'follower',
          expired.term,
          now,
        );
      }

      this.appendEvent(
        'leader.revoked',
        expired.nodeId,
        expired.term,
        now,
        {
          reason:
            'lease_expired',
        },
      );

      this.leader = null;
      this.revocations += 1;

      return null;
    }

    const member =
      this.membership.get(
        this.leader.nodeId,
      );

    if (
      !member ||
      member.state !== 'active' ||
      member.role !== 'leader'
    ) {
      this.leader = null;

      return null;
    }

    return this.cloneLeader(
      this.leader,
    );
  }

  private appendEvent(
    type:
      | 'leader.elected'
      | 'leader.revoked',
    nodeId: string,
    term: number,
    occurredAt: Date,
    payload:
      Readonly<Record<string, unknown>>,
  ): void {
    this.events.push({
      sequence:
        this.nextSequence,
      type,
      nodeId,
      term,
      occurredAt:
        new Date(occurredAt),
      payload: {
        ...payload,
      },
    });

    this.nextSequence += 1;
  }

  private validateLeaseDuration(
    value: number,
  ): void {
    if (
      !Number.isInteger(value) ||
      value < 1
    ) {
      throw new Error(
        'Leader lease duration must be a positive integer.',
      );
    }
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

  private cloneLeader(
    leader:
      ClusterLeader,
  ): ClusterLeader {
    return {
      ...leader,
      electedAt:
        new Date(
          leader.electedAt,
        ),
      leaseExpiresAt:
        new Date(
          leader.leaseExpiresAt,
        ),
    };
  }
}