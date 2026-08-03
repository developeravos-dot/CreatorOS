import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DistributedWorkerLease,
} from '../models';

@Injectable()
export class DistributedWorkerLeaseService {
  private readonly leases =
    new Map<string, DistributedWorkerLease>();

  acquire(
    workerName: string,
    ownerId: string,
    leaseDurationMs = 30_000,
  ): DistributedWorkerLease {
    this.cleanupExpired();

    this.validateLeaseInput(
      workerName,
      ownerId,
      leaseDurationMs,
    );

    const existing = this.leases.get(workerName);

    if (
      existing &&
      existing.ownerId !== ownerId
    ) {
      throw new ConflictException(
        `Worker ${workerName} already has an active lease.`,
      );
    }

    const now = new Date();

    const lease: DistributedWorkerLease = {
      workerName,
      ownerId,
      acquiredAt:
        existing?.acquiredAt ?? now,
      renewedAt: now,
      expiresAt: new Date(
        now.getTime() + leaseDurationMs,
      ),
      leaseDurationMs,
    };

    this.leases.set(
      workerName,
      this.cloneLease(lease),
    );

    return this.cloneLease(lease);
  }

  renew(
    workerName: string,
    ownerId: string,
  ): DistributedWorkerLease {
    this.cleanupExpired();

    const lease = this.leases.get(workerName);

    if (!lease) {
      throw new NotFoundException(
        `Worker lease ${workerName} was not found.`,
      );
    }

    if (lease.ownerId !== ownerId) {
      throw new ConflictException(
        `Worker lease ${workerName} belongs to another owner.`,
      );
    }

    const now = new Date();

    lease.renewedAt = now;
    lease.expiresAt = new Date(
      now.getTime() + lease.leaseDurationMs,
    );

    return this.cloneLease(lease);
  }

  release(
    workerName: string,
    ownerId?: string,
  ): boolean {
    const lease = this.leases.get(workerName);

    if (!lease) {
      return false;
    }

    if (
      ownerId !== undefined &&
      lease.ownerId !== ownerId
    ) {
      throw new ConflictException(
        `Worker lease ${workerName} belongs to another owner.`,
      );
    }

    return this.leases.delete(workerName);
  }

  hasActiveLease(workerName: string): boolean {
    this.cleanupExpired();

    return this.leases.has(workerName);
  }

  get(
    workerName: string,
  ): DistributedWorkerLease | null {
    this.cleanupExpired();

    const lease = this.leases.get(workerName);

    return lease
      ? this.cloneLease(lease)
      : null;
  }

  list(): DistributedWorkerLease[] {
    this.cleanupExpired();

    return [...this.leases.values()]
      .map((lease) => this.cloneLease(lease))
      .sort((left, right) =>
        left.workerName.localeCompare(
          right.workerName,
        ),
      );
  }

  clear(): void {
    this.leases.clear();
  }

  private cleanupExpired(): void {
    const now = Date.now();

    for (const [workerName, lease] of this.leases) {
      if (lease.expiresAt.getTime() <= now) {
        this.leases.delete(workerName);
      }
    }
  }

  private validateLeaseInput(
    workerName: string,
    ownerId: string,
    leaseDurationMs: number,
  ): void {
    if (!workerName.trim()) {
      throw new TypeError(
        'workerName is required.',
      );
    }

    if (!ownerId.trim()) {
      throw new TypeError(
        'ownerId is required.',
      );
    }

    if (
      !Number.isSafeInteger(leaseDurationMs) ||
      leaseDurationMs < 1
    ) {
      throw new RangeError(
        'leaseDurationMs must be a positive integer.',
      );
    }
  }

  private cloneLease(
    lease: DistributedWorkerLease,
  ): DistributedWorkerLease {
    return {
      ...lease,
      acquiredAt: new Date(lease.acquiredAt),
      renewedAt: new Date(lease.renewedAt),
      expiresAt: new Date(lease.expiresAt),
    };
  }
}
