import {
  Injectable,
} from '@nestjs/common';

import type {
  AssignClusterOwnershipInput,
} from '../contracts';
import type {
  ClusterOwnership,
} from '../models';
import {
  ClusterLockService,
} from './cluster-lock.service';
import {
  ClusterMembershipService,
} from './cluster-membership.service';

export interface ClusterJobOwnershipMetrics {
  readonly assignments: number;
  readonly renewals: number;
  readonly transfers: number;
  readonly releases: number;
  readonly expirations: number;
  readonly recoveries: number;
  readonly conflicts: number;
  readonly activeOwnerships: number;
  readonly collectedAt: Date;
}

@Injectable()
export class ClusterJobOwnershipService {
  private readonly ownerships =
    new Map<string, ClusterOwnership>();

  private assignments = 0;

  private renewals = 0;

  private transfers = 0;

  private releases = 0;

  private expirations = 0;

  private recoveries = 0;

  private conflicts = 0;

  constructor(
    private readonly membership:
      ClusterMembershipService,

    private readonly locks:
      ClusterLockService,
  ) {}

  assign(
    input:
      AssignClusterOwnershipInput,
  ): ClusterOwnership {
    const resourceType =
      this.requireText(
        input.resourceType,
        'resourceType',
      );

    const resourceId =
      this.requireText(
        input.resourceId,
        'resourceId',
      );

    const ownerNodeId =
      this.requireText(
        input.ownerNodeId,
        'ownerNodeId',
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

    this.assertAssignableNode(
      ownerNodeId,
    );

    const ownershipKey =
      this.createOwnershipKey(
        resourceType,
        resourceId,
      );

    this.expireKey(
      ownershipKey,
      now,
    );

    const existing =
      this.ownerships.get(
        ownershipKey,
      );

    if (
      existing &&
      this.isActive(existing, now)
    ) {
      if (
        existing.ownerNodeId ===
        ownerNodeId
      ) {
        return this.renew(
          resourceType,
          resourceId,
          ownerNodeId,
          existing.fencingToken,
          leaseDurationMs,
          now,
        );
      }

      this.conflicts += 1;

      throw new Error(
        `Resource ${resourceType}:${resourceId} is owned by node ${existing.ownerNodeId}.`,
      );
    }

    const lock =
      this.locks.acquire({
        resourceKey:
          this.createLockKey(
            resourceType,
            resourceId,
          ),
        ownerNodeId,
        leaseDurationMs,
        now,
      });

    const ownership:
      ClusterOwnership = {
      resourceType,
      resourceId,
      ownerNodeId,
      previousOwnerNodeId:
        existing?.ownerNodeId ??
        null,
      fencingToken:
        lock.fencingToken,
      state: 'assigned',
      assignedAt: now,
      renewedAt: now,
      expiresAt:
        new Date(
          now.getTime() +
          leaseDurationMs,
        ),
      releasedAt: null,
      metadata:
        this.cloneRecord(
          input.metadata ?? {},
        ),
    };

    this.ownerships.set(
      ownershipKey,
      this.cloneOwnership(
        ownership,
      ),
    );

    this.assignments += 1;

    return this.cloneOwnership(
      ownership,
    );
  }

  renew(
    resourceType: string,
    resourceId: string,
    ownerNodeId: string,
    fencingToken: number,
    leaseDurationMs: number,
    now =
      new Date(),
  ): ClusterOwnership {
    const ownershipKey =
      this.createOwnershipKey(
        this.requireText(
          resourceType,
          'resourceType',
        ),
        this.requireText(
          resourceId,
          'resourceId',
        ),
      );

    const normalizedOwnerNodeId =
      this.requireText(
        ownerNodeId,
        'ownerNodeId',
      );

    const duration =
      this.requirePositiveInteger(
        leaseDurationMs,
        'leaseDurationMs',
      );

    const currentTime =
      new Date(now);

    this.assertAssignableNode(
      normalizedOwnerNodeId,
    );

    this.expireKey(
      ownershipKey,
      currentTime,
    );

    const ownership =
      this.requireActiveOwnership(
        ownershipKey,
        currentTime,
      );

    this.assertOwner(
      ownership,
      normalizedOwnerNodeId,
      fencingToken,
    );

    this.locks.renew(
      this.createLockKey(
        ownership.resourceType,
        ownership.resourceId,
      ),
      normalizedOwnerNodeId,
      fencingToken,
      duration,
      currentTime,
    );

    const renewed:
      ClusterOwnership = {
      ...ownership,
      state: 'renewed',
      renewedAt:
        currentTime,
      expiresAt:
        new Date(
          currentTime.getTime() +
          duration,
        ),
    };

    this.ownerships.set(
      ownershipKey,
      this.cloneOwnership(
        renewed,
      ),
    );

    this.renewals += 1;

    return this.cloneOwnership(
      renewed,
    );
  }

  transfer(
    resourceType: string,
    resourceId: string,
    currentOwnerNodeId: string,
    fencingToken: number,
    newOwnerNodeId: string,
    leaseDurationMs: number,
    now =
      new Date(),
  ): ClusterOwnership {
    const normalizedResourceType =
      this.requireText(
        resourceType,
        'resourceType',
      );

    const normalizedResourceId =
      this.requireText(
        resourceId,
        'resourceId',
      );

    const normalizedCurrentOwner =
      this.requireText(
        currentOwnerNodeId,
        'currentOwnerNodeId',
      );

    const normalizedNewOwner =
      this.requireText(
        newOwnerNodeId,
        'newOwnerNodeId',
      );

    if (
      normalizedCurrentOwner ===
      normalizedNewOwner
    ) {
      throw new Error(
        'Ownership transfer requires a different destination node.',
      );
    }

    const duration =
      this.requirePositiveInteger(
        leaseDurationMs,
        'leaseDurationMs',
      );

    const currentTime =
      new Date(now);

    this.assertAssignableNode(
      normalizedNewOwner,
    );

    const ownershipKey =
      this.createOwnershipKey(
        normalizedResourceType,
        normalizedResourceId,
      );

    const existing =
      this.requireActiveOwnership(
        ownershipKey,
        currentTime,
      );

    this.assertOwner(
      existing,
      normalizedCurrentOwner,
      fencingToken,
    );

    this.locks.release(
      this.createLockKey(
        normalizedResourceType,
        normalizedResourceId,
      ),
      normalizedCurrentOwner,
      fencingToken,
      currentTime,
    );

    const newLock =
      this.locks.acquire({
        resourceKey:
          this.createLockKey(
            normalizedResourceType,
            normalizedResourceId,
          ),
        ownerNodeId:
          normalizedNewOwner,
        leaseDurationMs:
          duration,
        now:
          currentTime,
      });

    const transferred:
      ClusterOwnership = {
      ...existing,
      ownerNodeId:
        normalizedNewOwner,
      previousOwnerNodeId:
        normalizedCurrentOwner,
      fencingToken:
        newLock.fencingToken,
      state: 'transferred',
      assignedAt:
        currentTime,
      renewedAt:
        currentTime,
      expiresAt:
        new Date(
          currentTime.getTime() +
          duration,
        ),
      releasedAt: null,
    };

    this.ownerships.set(
      ownershipKey,
      this.cloneOwnership(
        transferred,
      ),
    );

    this.transfers += 1;

    return this.cloneOwnership(
      transferred,
    );
  }

  release(
    resourceType: string,
    resourceId: string,
    ownerNodeId: string,
    fencingToken: number,
    now =
      new Date(),
  ): ClusterOwnership {
    const normalizedResourceType =
      this.requireText(
        resourceType,
        'resourceType',
      );

    const normalizedResourceId =
      this.requireText(
        resourceId,
        'resourceId',
      );

    const ownershipKey =
      this.createOwnershipKey(
        normalizedResourceType,
        normalizedResourceId,
      );

    const currentTime =
      new Date(now);

    const existing =
      this.requireActiveOwnership(
        ownershipKey,
        currentTime,
      );

    this.assertOwner(
      existing,
      this.requireText(
        ownerNodeId,
        'ownerNodeId',
      ),
      fencingToken,
    );

    this.locks.release(
      this.createLockKey(
        normalizedResourceType,
        normalizedResourceId,
      ),
      existing.ownerNodeId,
      fencingToken,
      currentTime,
    );

    const released:
      ClusterOwnership = {
      ...existing,
      state: 'released',
      renewedAt:
        currentTime,
      expiresAt:
        currentTime,
      releasedAt:
        currentTime,
    };

    this.ownerships.set(
      ownershipKey,
      this.cloneOwnership(
        released,
      ),
    );

    this.releases += 1;

    return this.cloneOwnership(
      released,
    );
  }

  recover(
    resourceType: string,
    resourceId: string,
    newOwnerNodeId: string,
    leaseDurationMs: number,
    now =
      new Date(),
  ): ClusterOwnership {
    const normalizedResourceType =
      this.requireText(
        resourceType,
        'resourceType',
      );

    const normalizedResourceId =
      this.requireText(
        resourceId,
        'resourceId',
      );

    const normalizedNewOwner =
      this.requireText(
        newOwnerNodeId,
        'newOwnerNodeId',
      );

    const duration =
      this.requirePositiveInteger(
        leaseDurationMs,
        'leaseDurationMs',
      );

    const currentTime =
      new Date(now);

    this.assertAssignableNode(
      normalizedNewOwner,
    );

    const ownershipKey =
      this.createOwnershipKey(
        normalizedResourceType,
        normalizedResourceId,
      );

    const existing =
      this.ownerships.get(
        ownershipKey,
      );

    if (
      existing &&
      this.isActive(
        existing,
        currentTime,
      )
    ) {
      const existingOwner =
        this.membership.get(
          existing.ownerNodeId,
        );

      if (
        existingOwner &&
        existingOwner.state !== 'offline' &&
        existingOwner.state !== 'removed'
      ) {
        this.conflicts += 1;

        throw new Error(
          `Active owner ${existing.ownerNodeId} is still available.`,
        );
      }

      const lock =
        this.locks.get(
          this.createLockKey(
            normalizedResourceType,
            normalizedResourceId,
          ),
          currentTime,
        );

      if (
        lock &&
        (
          lock.state === 'acquired' ||
          lock.state === 'renewed'
        )
      ) {
        this.locks.release(
          lock.resourceKey,
          lock.ownerNodeId,
          lock.fencingToken,
          currentTime,
        );
      }
    }

    this.expireKey(
      ownershipKey,
      currentTime,
    );

    const newLock =
      this.locks.acquire({
        resourceKey:
          this.createLockKey(
            normalizedResourceType,
            normalizedResourceId,
          ),
        ownerNodeId:
          normalizedNewOwner,
        leaseDurationMs:
          duration,
        now:
          currentTime,
      });

    const recovered:
      ClusterOwnership = {
      resourceType:
        normalizedResourceType,
      resourceId:
        normalizedResourceId,
      ownerNodeId:
        normalizedNewOwner,
      previousOwnerNodeId:
        existing?.ownerNodeId ??
        null,
      fencingToken:
        newLock.fencingToken,
      state: 'recovered',
      assignedAt:
        currentTime,
      renewedAt:
        currentTime,
      expiresAt:
        new Date(
          currentTime.getTime() +
          duration,
        ),
      releasedAt: null,
      metadata:
        this.cloneRecord(
          existing?.metadata ??
          {},
        ),
    };

    this.ownerships.set(
      ownershipKey,
      this.cloneOwnership(
        recovered,
      ),
    );

    this.recoveries += 1;

    return this.cloneOwnership(
      recovered,
    );
  }

  recoverLostNode(
    lostNodeId: string,
    replacementNodeId: string,
    leaseDurationMs: number,
    now =
      new Date(),
  ): readonly ClusterOwnership[] {
    const normalizedLostNodeId =
      this.requireText(
        lostNodeId,
        'lostNodeId',
      );

    const normalizedReplacementNodeId =
      this.requireText(
        replacementNodeId,
        'replacementNodeId',
      );

    const duration =
      this.requirePositiveInteger(
        leaseDurationMs,
        'leaseDurationMs',
      );

    const currentTime =
      new Date(now);

    this.assertAssignableNode(
      normalizedReplacementNodeId,
    );

    const lostNode =
      this.membership.get(
        normalizedLostNodeId,
      );

    if (
      lostNode &&
      lostNode.state !== 'offline' &&
      lostNode.state !== 'removed'
    ) {
      throw new Error(
        `Node ${normalizedLostNodeId} is not offline or removed.`,
      );
    }

    const candidates =
      [...this.ownerships.values()]
        .filter(
          (ownership) =>
            ownership.ownerNodeId ===
              normalizedLostNodeId &&
            this.isActive(
              ownership,
              currentTime,
            ),
        )
        .sort(
          (left, right) =>
            this.createOwnershipKey(
              left.resourceType,
              left.resourceId,
            ).localeCompare(
              this.createOwnershipKey(
                right.resourceType,
                right.resourceId,
              ),
            ),
        );

    return candidates.map(
      (ownership) =>
        this.recover(
          ownership.resourceType,
          ownership.resourceId,
          normalizedReplacementNodeId,
          duration,
          currentTime,
        ),
    );
  }

  expire(
    now =
      new Date(),
  ): readonly ClusterOwnership[] {
    const currentTime =
      new Date(now);

    const expired:
      ClusterOwnership[] = [];

    for (
      const ownershipKey
      of this.ownerships.keys()
    ) {
      const result =
        this.expireKey(
          ownershipKey,
          currentTime,
        );

      if (result) {
        expired.push(
          this.cloneOwnership(
            result,
          ),
        );
      }
    }

    this.locks.expire(
      currentTime,
    );

    return expired;
  }

  get(
    resourceType: string,
    resourceId: string,
    now =
      new Date(),
  ): ClusterOwnership | null {
    const ownershipKey =
      this.createOwnershipKey(
        this.requireText(
          resourceType,
          'resourceType',
        ),
        this.requireText(
          resourceId,
          'resourceId',
        ),
      );

    this.expireKey(
      ownershipKey,
      new Date(now),
    );

    const ownership =
      this.ownerships.get(
        ownershipKey,
      );

    return ownership
      ? this.cloneOwnership(
          ownership,
        )
      : null;
  }

  list(
    now =
      new Date(),
  ): readonly ClusterOwnership[] {
    this.expire(now);

    return [
      ...this.ownerships.values(),
    ]
      .sort(
        (left, right) =>
          this.createOwnershipKey(
            left.resourceType,
            left.resourceId,
          ).localeCompare(
            this.createOwnershipKey(
              right.resourceType,
              right.resourceId,
            ),
          ),
      )
      .map(
        (ownership) =>
          this.cloneOwnership(
            ownership,
          ),
      );
  }

  listActive(
    now =
      new Date(),
  ): readonly ClusterOwnership[] {
    const currentTime =
      new Date(now);

    return this.list(
      currentTime,
    ).filter(
      (ownership) =>
        this.isActive(
          ownership,
          currentTime,
        ),
    );
  }

  listByOwner(
    ownerNodeId: string,
    now =
      new Date(),
  ): readonly ClusterOwnership[] {
    const normalizedOwnerNodeId =
      this.requireText(
        ownerNodeId,
        'ownerNodeId',
      );

    return this.listActive(now).filter(
      (ownership) =>
        ownership.ownerNodeId ===
        normalizedOwnerNodeId,
    );
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): ClusterJobOwnershipMetrics {
    return {
      assignments:
        this.assignments,
      renewals:
        this.renewals,
      transfers:
        this.transfers,
      releases:
        this.releases,
      expirations:
        this.expirations,
      recoveries:
        this.recoveries,
      conflicts:
        this.conflicts,
      activeOwnerships:
        this.listActive(
          collectedAt,
        ).length,
      collectedAt:
        new Date(collectedAt),
    };
  }

  private expireKey(
    ownershipKey: string,
    now: Date,
  ): ClusterOwnership | null {
    const ownership =
      this.ownerships.get(
        ownershipKey,
      );

    const hasExpirableState =
      ownership?.state === 'assigned' ||
      ownership?.state === 'renewed' ||
      ownership?.state === 'transferred' ||
      ownership?.state === 'recovered';

    if (
      !ownership ||
      !hasExpirableState ||
      ownership.releasedAt !== null ||
      ownership.expiresAt.getTime() >
        now.getTime()
    ) {
      return null;
    }

    const expired:
      ClusterOwnership = {
      ...ownership,
      state: 'expired',
      renewedAt:
        new Date(now),
      expiresAt:
        new Date(now),
      releasedAt:
        new Date(now),
    };

    this.ownerships.set(
      ownershipKey,
      this.cloneOwnership(
        expired,
      ),
    );

    this.expirations += 1;

    return this.cloneOwnership(
      expired,
    );
  }

  private requireActiveOwnership(
    ownershipKey: string,
    now: Date,
  ): ClusterOwnership {
    this.expireKey(
      ownershipKey,
      now,
    );

    const ownership =
      this.ownerships.get(
        ownershipKey,
      );

    if (
      !ownership ||
      !this.isActive(
        ownership,
        now,
      )
    ) {
      throw new Error(
        `Active ownership ${ownershipKey} was not found.`,
      );
    }

    return ownership;
  }

  private assertAssignableNode(
    nodeId: string,
  ): void {
    const node =
      this.membership.require(
        nodeId,
      );

    if (node.state !== 'active') {
      throw new Error(
        `Node ${nodeId} is not active and cannot own jobs.`,
      );
    }
  }

  private assertOwner(
    ownership:
      ClusterOwnership,
    ownerNodeId: string,
    fencingToken: number,
  ): void {
    if (
      ownership.ownerNodeId !==
      ownerNodeId
    ) {
      throw new Error(
        `Node ${ownerNodeId} does not own ${ownership.resourceType}:${ownership.resourceId}.`,
      );
    }

    if (
      ownership.fencingToken !==
      fencingToken
    ) {
      throw new Error(
        `Invalid fencing token for ${ownership.resourceType}:${ownership.resourceId}.`,
      );
    }
  }

  private isActive(
    ownership:
      ClusterOwnership,
    now: Date,
  ): boolean {
    return (
      (
        ownership.state === 'assigned' ||
        ownership.state === 'renewed' ||
        ownership.state === 'transferred' ||
        ownership.state === 'recovered'
      ) &&
      ownership.releasedAt === null &&
      ownership.expiresAt.getTime() >
        now.getTime()
    );
  }

  private createOwnershipKey(
    resourceType: string,
    resourceId: string,
  ): string {
    return (
      resourceType +
      ':' +
      resourceId
    );
  }

  private createLockKey(
    resourceType: string,
    resourceId: string,
  ): string {
    return (
      'cluster-ownership:' +
      resourceType +
      ':' +
      resourceId
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

  private cloneOwnership(
    ownership:
      ClusterOwnership,
  ): ClusterOwnership {
    return {
      ...ownership,
      assignedAt:
        new Date(
          ownership.assignedAt,
        ),
      renewedAt:
        new Date(
          ownership.renewedAt,
        ),
      expiresAt:
        new Date(
          ownership.expiresAt,
        ),
      releasedAt:
        ownership.releasedAt
          ? new Date(
              ownership.releasedAt,
            )
          : null,
      metadata:
        this.cloneRecord(
          ownership.metadata,
        ),
    };
  }

  private cloneRecord(
    value:
      Readonly<Record<string, unknown>>,
  ): Readonly<Record<string, unknown>> {
    return {
      ...value,
    };
  }
}