import {
  Injectable,
} from '@nestjs/common';

export interface WorkflowIdempotencyEntry {
  key: string;
  dispatchId: string;
  expiresAt: Date;
  createdAt: Date;
}

@Injectable()
export class WorkflowDispatchIdempotencyService {
  private readonly entries =
    new Map<string, WorkflowIdempotencyEntry>();

  reserve(
    key: string,
    dispatchId: string,
    ttlMs = 24 * 60 * 60 * 1_000,
  ): boolean {
    this.cleanupExpired();

    const normalizedKey = key.trim();

    if (!normalizedKey) {
      throw new TypeError(
        'Idempotency key is required.',
      );
    }

    if (
      !Number.isSafeInteger(ttlMs) ||
      ttlMs < 1
    ) {
      throw new RangeError(
        'Idempotency ttlMs must be a positive integer.',
      );
    }

    if (this.entries.has(normalizedKey)) {
      return false;
    }

    const now = new Date();

    this.entries.set(normalizedKey, {
      key: normalizedKey,
      dispatchId,
      createdAt: now,
      expiresAt: new Date(
        now.getTime() + ttlMs,
      ),
    });

    return true;
  }

  exists(key: string): boolean {
    this.cleanupExpired();

    return this.entries.has(key.trim());
  }

  get(
    key: string,
  ): WorkflowIdempotencyEntry | null {
    this.cleanupExpired();

    const entry = this.entries.get(key.trim());

    return entry
      ? {
          ...entry,
          createdAt: new Date(entry.createdAt),
          expiresAt: new Date(entry.expiresAt),
        }
      : null;
  }

  release(key: string): boolean {
    return this.entries.delete(key.trim());
  }

  clear(): void {
    this.entries.clear();
  }

  private cleanupExpired(): void {
    const now = Date.now();

    for (const [key, entry] of this.entries) {
      if (entry.expiresAt.getTime() <= now) {
        this.entries.delete(key);
      }
    }
  }
}
