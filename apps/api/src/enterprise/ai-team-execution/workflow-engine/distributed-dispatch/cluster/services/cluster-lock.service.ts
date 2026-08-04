import {
  Injectable,
} from '@nestjs/common';

import type {
  AcquireClusterLockInput,
} from '../contracts';
import type {
  ClusterLock,
} from '../models';

export interface ClusterLockMetrics {
  readonly acquisitions: number;
  readonly renewals: number;
  readonly releases: number;
  readonly conflicts: number;
  readonly expirations: number;
  readonly activeLocks: number;
  readonly collectedAt: Date;
}

@Injectable()
export class ClusterLockService {
  private readonly locks =
    new Map<string, ClusterLock>();

  private nextFencingToken = 1;

  private acquisitions = 0;

  private renewals = 0;

  private releases = 0;

  private conflicts = 0;

  private expirations = 0;

  acquire(
    input:
      AcquireClusterLockInput,
  ): ClusterLock {
    const resourceKey =
      this.requireText(
        input.resourceKey,
        'resourceKey',
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

    this.expireResource(
      resourceKey,
      now,
    );

    const existing =
      this.locks.get(
        resourceKey,
      );

    if (
      existing &&
      existing.state !== 'released' &&
      existing.state !== 'expired'
    ) {
      if (
        existing.ownerNodeId ===
        ownerNodeId
      ) {
        return this.renew(
          resourceKey,
          ownerNodeId,
          existing.fencingToken,
          leaseDurationMs,
          now,
        );
      }

      this.conflicts += 1;

      throw new Error(
        `Cluster lock ${resourceKey} is owned by node ${existing.ownerNodeId}.`,
      );
    }

    const fencingToken =
      this.resolveFencingToken(
        input.fencingToken,
      );

    const lock:
      ClusterLock = {
      resourceKey,
      ownerNodeId,
      fencingToken,
      state: 'acquired',
      acquiredAt: now,
      renewedAt: now,
      expiresAt:
        new Date(
          now.getTime() +
          leaseDurationMs,
        ),
      releasedAt: null,
    };

    this.locks.set(
      resourceKey,
      this.cloneLock(lock),
    );

    this.acquisitions += 1;

    return this.cloneLock(lock);
  }

  renew(
    resourceKey: string,
    ownerNodeId: string,
    fencingToken: number,
    leaseDurationMs: number,
    now =
      new Date(),
  ): ClusterLock {
    const normalizedResourceKey =
      this.requireText(
        resourceKey,
        'resourceKey',
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

    this.expireResource(
      normalizedResourceKey,
      currentTime,
    );

    const existing =
      this.requireActiveLock(
        normalizedResourceKey,
      );

    this.assertOwner(
      existing,
      normalizedOwnerNodeId,
      fencingToken,
    );

    const renewed:
      ClusterLock = {
      ...existing,
      state: 'renewed',
      renewedAt:
        currentTime,
      expiresAt:
        new Date(
          currentTime.getTime() +
          duration,
        ),
    };

    this.locks.set(
      normalizedResourceKey,
      this.cloneLock(renewed),
    );

    this.renewals += 1;

    return this.cloneLock(
      renewed,
    );
  }

  release(
    resourceKey: string,
    ownerNodeId: string,
    fencingToken: number,
    now =
      new Date(),
  ): ClusterLock {
    const normalizedResourceKey =
      this.requireText(
        resourceKey,
        'resourceKey',
      );

    const existing =
      this.requireActiveLock(
        normalizedResourceKey,
      );

    this.assertOwner(
      existing,
      this.requireText(
        ownerNodeId,
        'ownerNodeId',
      ),
      fencingToken,
    );

    const releasedAt =
      new Date(now);

    const released:
      ClusterLock = {
      ...existing,
      state: 'released',
      renewedAt:
        releasedAt,
      expiresAt:
        releasedAt,
      releasedAt,
    };

    this.locks.set(
      normalizedResourceKey,
      this.cloneLock(released),
    );

    this.releases += 1;

    return this.cloneLock(
      released,
    );
  }

  expire(
    now =
      new Date(),
  ): readonly ClusterLock[] {
    const currentTime =
      new Date(now);

    const expired:
      ClusterLock[] = [];

    for (
      const resourceKey
      of this.locks.keys()
    ) {
      const result =
        this.expireResource(
          resourceKey,
          currentTime,
        );

      if (result) {
        expired.push(
          this.cloneLock(result),
        );
      }
    }

    return expired;
  }

  isOwner(
    resourceKey: string,
    ownerNodeId: string,
    fencingToken?: number,
    now =
      new Date(),
  ): boolean {
    const normalizedResourceKey =
      this.requireText(
        resourceKey,
        'resourceKey',
      );

    this.expireResource(
      normalizedResourceKey,
      new Date(now),
    );

    const lock =
      this.locks.get(
        normalizedResourceKey,
      );

    if (
      !lock ||
      (
        lock.state !== 'acquired' &&
        lock.state !== 'renewed'
      )
    ) {
      return false;
    }

    if (
      lock.ownerNodeId !==
      this.requireText(
        ownerNodeId,
        'ownerNodeId',
      )
    ) {
      return false;
    }

    return (
      fencingToken === undefined ||
      lock.fencingToken ===
      fencingToken
    );
  }

  get(
    resourceKey: string,
    now =
      new Date(),
  ): ClusterLock | null {
    const normalizedResourceKey =
      this.requireText(
        resourceKey,
        'resourceKey',
      );

    this.expireResource(
      normalizedResourceKey,
      new Date(now),
    );

    const lock =
      this.locks.get(
        normalizedResourceKey,
      );

    return lock
      ? this.cloneLock(lock)
      : null;
  }

  list(
    now =
      new Date(),
  ): readonly ClusterLock[] {
    this.expire(now);

    return [
      ...this.locks.values(),
    ]
      .sort(
        (left, right) =>
          left.resourceKey.localeCompare(
            right.resourceKey,
          ),
      )
      .map(
        (lock) =>
          this.cloneLock(lock),
      );
  }

  listActive(
    now =
      new Date(),
  ): readonly ClusterLock[] {
    return this.list(now).filter(
      (lock) =>
        lock.state === 'acquired' ||
        lock.state === 'renewed',
    );
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): ClusterLockMetrics {
    const activeLocks =
      this.listActive(
        collectedAt,
      ).length;

    return {
      acquisitions:
        this.acquisitions,
      renewals:
        this.renewals,
      releases:
        this.releases,
      conflicts:
        this.conflicts,
      expirations:
        this.expirations,
      activeLocks,
      collectedAt:
        new Date(collectedAt),
    };
  }

  private expireResource(
    resourceKey: string,
    now: Date,
  ): ClusterLock | null {
    const existing =
      this.locks.get(
        resourceKey,
      );

    if (
      !existing ||
      (
        existing.state !== 'acquired' &&
        existing.state !== 'renewed'
      ) ||
      existing.expiresAt.getTime() >
        now.getTime()
    ) {
      return null;
    }

    const expired:
      ClusterLock = {
      ...existing,
      state: 'expired',
      renewedAt:
        new Date(now),
      expiresAt:
        new Date(now),
      releasedAt:
        new Date(now),
    };

    this.locks.set(
      resourceKey,
      this.cloneLock(expired),
    );

    this.expirations += 1;

    return this.cloneLock(
      expired,
    );
  }

  private requireActiveLock(
    resourceKey: string,
  ): ClusterLock {
    const lock =
      this.locks.get(
        resourceKey,
      );

    if (
      !lock ||
      (
        lock.state !== 'acquired' &&
        lock.state !== 'renewed'
      )
    ) {
      throw new Error(
        `Active cluster lock ${resourceKey} was not found.`,
      );
    }

    return lock;
  }

  private assertOwner(
    lock: ClusterLock,
    ownerNodeId: string,
    fencingToken: number,
  ): void {
    if (
      lock.ownerNodeId !==
      ownerNodeId
    ) {
      throw new Error(
        `Node ${ownerNodeId} does not own cluster lock ${lock.resourceKey}.`,
      );
    }

    if (
      lock.fencingToken !==
      fencingToken
    ) {
      throw new Error(
        `Invalid fencing token for cluster lock ${lock.resourceKey}.`,
      );
    }
  }

  private resolveFencingToken(
    requestedToken:
      number | undefined,
  ): number {
    if (
      requestedToken !== undefined
    ) {
      const normalized =
        this.requirePositiveInteger(
          requestedToken,
          'fencingToken',
        );

      this.nextFencingToken =
        Math.max(
          this.nextFencingToken,
          normalized + 1,
        );

      return normalized;
    }

    const token =
      this.nextFencingToken;

    this.nextFencingToken += 1;

    return token;
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

  private cloneLock(
    lock: ClusterLock,
  ): ClusterLock {
    return {
      ...lock,
      acquiredAt:
        new Date(
          lock.acquiredAt,
        ),
      renewedAt:
        new Date(
          lock.renewedAt,
        ),
      expiresAt:
        new Date(
          lock.expiresAt,
        ),
      releasedAt:
        lock.releasedAt
          ? new Date(
              lock.releasedAt,
            )
          : null,
    };
  }
}