import { Injectable } from '@nestjs/common';

import type {
  ExecutionLeaseRequest,
} from '../contracts';
import type {
  DistributedExecutionLease,
} from '../models';

@Injectable()
export class ExecutionLeaseManagerService {
  private readonly leases =
    new Map<string, DistributedExecutionLease>();

  private fencingSequence = 0;

  acquire(
    request: ExecutionLeaseRequest,
  ): DistributedExecutionLease | null {
    const executionId = this.text(
      request.executionId,
      'executionId',
    );

    const workerId = this.text(
      request.workerId,
      'workerId',
    );

    this.positive(
      request.leaseDurationMs,
      'leaseDurationMs',
    );

    const now = new Date(request.now ?? new Date());
    const current = this.leases.get(executionId);

    if (
      current &&
      current.releasedAt === null &&
      current.expiresAt.getTime() > now.getTime()
    ) {
      return null;
    }

    const lease: DistributedExecutionLease = {
      executionId,
      workerId,
      fencingToken: ++this.fencingSequence,
      acquiredAt: now,
      expiresAt: new Date(
        now.getTime() + request.leaseDurationMs,
      ),
      releasedAt: null,
    };

    this.leases.set(executionId, lease);
    return this.clone(lease);
  }

  renew(
    executionId: string,
    workerId: string,
    fencingToken: number,
    leaseDurationMs: number,
    now = new Date(),
  ): DistributedExecutionLease {
    this.positive(leaseDurationMs, 'leaseDurationMs');

    const current = this.require(executionId);

    if (
      current.workerId !== workerId ||
      current.fencingToken !== fencingToken ||
      current.releasedAt !== null ||
      current.expiresAt.getTime() <= now.getTime()
    ) {
      throw new Error(
        'Execution lease ownership mismatch or expired lease.',
      );
    }

    const renewed: DistributedExecutionLease = {
      ...current,
      expiresAt: new Date(
        now.getTime() + leaseDurationMs,
      ),
    };

    this.leases.set(current.executionId, renewed);
    return this.clone(renewed);
  }

  release(
    executionId: string,
    workerId: string,
    fencingToken: number,
    now = new Date(),
  ): DistributedExecutionLease {
    const current = this.require(executionId);

    if (
      current.workerId !== workerId ||
      current.fencingToken !== fencingToken
    ) {
      throw new Error(
        'Execution lease ownership mismatch.',
      );
    }

    const released: DistributedExecutionLease = {
      ...current,
      releasedAt: new Date(now),
    };

    this.leases.set(current.executionId, released);
    return this.clone(released);
  }

  get(
    executionId: string,
  ): DistributedExecutionLease | null {
    const lease = this.leases.get(executionId);
    return lease ? this.clone(lease) : null;
  }

  expired(
    now = new Date(),
  ): readonly DistributedExecutionLease[] {
    return [...this.leases.values()]
      .filter(
        (lease) =>
          lease.releasedAt === null &&
          lease.expiresAt.getTime() <= now.getTime(),
      )
      .sort((left, right) =>
        left.executionId.localeCompare(
          right.executionId,
        ),
      )
      .map((lease) => this.clone(lease));
  }

  private require(
    executionId: string,
  ): DistributedExecutionLease {
    const normalized = this.text(
      executionId,
      'executionId',
    );

    const lease = this.leases.get(normalized);

    if (!lease) {
      throw new Error(
        `Execution lease ${normalized} was not found.`,
      );
    }

    return lease;
  }

  private positive(value: number, field: string): void {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(
        `${field} must be a positive integer.`,
      );
    }
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error(`${field} is required.`);
    }

    return normalized;
  }

  private clone(
    lease: DistributedExecutionLease,
  ): DistributedExecutionLease {
    return {
      ...lease,
      acquiredAt: new Date(lease.acquiredAt),
      expiresAt: new Date(lease.expiresAt),
      releasedAt: lease.releasedAt
        ? new Date(lease.releasedAt)
        : null,
    };
  }
}
