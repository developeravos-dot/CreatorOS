import { Injectable } from '@nestjs/common';

export interface RuntimeCheckpoint {
  readonly executionId: string;
  readonly version: number;
  readonly payload:
    Readonly<Record<string, unknown>>;
  readonly createdAt: Date;
}

export interface DeadLetterRecord {
  readonly executionId: string;
  readonly reason: string;
  readonly attempts: number;
  readonly createdAt: Date;
}

export interface RetryDecision {
  readonly retryable: boolean;
  readonly delayMs: number;
  readonly deadLetter: boolean;
}

@Injectable()
export class RuntimeReliabilityService {
  private readonly checkpoints =
    new Map<string, RuntimeCheckpoint[]>();

  private readonly deadLetters:
    DeadLetterRecord[] = [];

  private shuttingDown = false;

  checkpoint(
    executionId: string,
    payload:
      Readonly<Record<string, unknown>>,
    now = new Date(),
  ): RuntimeCheckpoint {
    const normalized =
      executionId.trim();

    if (!normalized) {
      throw new Error(
        'executionId is required.',
      );
    }

    const history =
      this.checkpoints.get(normalized) ??
      [];

    const checkpoint:
      RuntimeCheckpoint = {
        executionId: normalized,
        version: history.length + 1,
        payload: structuredClone(payload),
        createdAt: new Date(now),
      };

    this.checkpoints.set(
      normalized,
      [...history, checkpoint],
    );

    return this.cloneCheckpoint(
      checkpoint,
    );
  }

  latestCheckpoint(
    executionId: string,
  ): RuntimeCheckpoint | null {
    const history =
      this.checkpoints.get(executionId);

    const latest =
      history?.[history.length - 1];

    return latest
      ? this.cloneCheckpoint(latest)
      : null;
  }

  retry(input: {
    readonly attempt: number;
    readonly maximumAttempts: number;
    readonly baseDelayMs: number;
    readonly maximumDelayMs: number;
    readonly permanentFailure: boolean;
  }): RetryDecision {
    if (
      !Number.isInteger(input.attempt) ||
      !Number.isInteger(
        input.maximumAttempts,
      ) ||
      input.attempt < 1 ||
      input.maximumAttempts < 1 ||
      input.baseDelayMs < 1 ||
      input.maximumDelayMs <
        input.baseDelayMs
    ) {
      throw new Error(
        'Invalid retry policy input.',
      );
    }

    const exhausted =
      input.attempt >=
      input.maximumAttempts;

    if (
      input.permanentFailure ||
      exhausted
    ) {
      return {
        retryable: false,
        delayMs: 0,
        deadLetter: true,
      };
    }

    return {
      retryable: true,
      delayMs: Math.min(
        input.maximumDelayMs,
        input.baseDelayMs *
          2 ** (input.attempt - 1),
      ),
      deadLetter: false,
    };
  }

  deadLetter(input: {
    readonly executionId: string;
    readonly reason: string;
    readonly attempts: number;
    readonly now?: Date;
  }): DeadLetterRecord {
    const record: DeadLetterRecord = {
      executionId:
        input.executionId.trim(),
      reason:
        input.reason.trim(),
      attempts:
        input.attempts,
      createdAt: new Date(
        input.now ?? new Date(),
      ),
    };

    if (
      !record.executionId ||
      !record.reason ||
      !Number.isInteger(
        record.attempts,
      ) ||
      record.attempts < 1
    ) {
      throw new Error(
        'Invalid dead-letter record.',
      );
    }

    this.deadLetters.push(record);
    return this.cloneDeadLetter(record);
  }

  listDeadLetters():
    readonly DeadLetterRecord[] {
    return this.deadLetters.map(
      (record) =>
        this.cloneDeadLetter(record),
    );
  }

  beginGracefulShutdown(): void {
    this.shuttingDown = true;
  }

  canAcceptWork(): boolean {
    return !this.shuttingDown;
  }

  recoveryPlan(input: {
    readonly offlineWorkers: number;
    readonly orphanedExecutions: number;
    readonly failedDependencies: number;
  }): readonly string[] {
    const actions: string[] = [];

    if (input.offlineWorkers > 0) {
      actions.push(
        'restart-offline-workers',
      );
    }

    if (
      input.orphanedExecutions > 0
    ) {
      actions.push(
        'reassign-orphaned-executions',
      );
    }

    if (
      input.failedDependencies > 0
    ) {
      actions.push(
        'isolate-failed-dependencies',
      );
    }

    if (actions.length === 0) {
      actions.push('no-action');
    }

    return actions;
  }

  private cloneCheckpoint(
    checkpoint: RuntimeCheckpoint,
  ): RuntimeCheckpoint {
    return {
      ...checkpoint,
      payload: structuredClone(
        checkpoint.payload,
      ),
      createdAt: new Date(
        checkpoint.createdAt,
      ),
    };
  }

  private cloneDeadLetter(
    record: DeadLetterRecord,
  ): DeadLetterRecord {
    return {
      ...record,
      createdAt: new Date(
        record.createdAt,
      ),
    };
  }
}
