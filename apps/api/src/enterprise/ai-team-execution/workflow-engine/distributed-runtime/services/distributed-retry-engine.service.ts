import { Injectable } from '@nestjs/common';

export type RetryFailureClass =
  | 'transient'
  | 'throttled'
  | 'dependency'
  | 'permanent';

export interface DistributedRetryPolicy {
  readonly maximumAttempts: number;
  readonly baseDelayMs: number;
  readonly maximumDelayMs: number;
  readonly jitterRatio: number;
}

export interface DistributedRetryDecision {
  readonly retryable: boolean;
  readonly exhausted: boolean;
  readonly attempt: number;
  readonly delayMs: number;
  readonly failureClass: RetryFailureClass;
  readonly deadLetter: boolean;
}

@Injectable()
export class DistributedRetryEngineService {
  decide(input: {
    readonly attempt: number;
    readonly failureClass: RetryFailureClass;
    readonly policy: DistributedRetryPolicy;
    readonly random?: number;
  }): DistributedRetryDecision {
    this.validatePolicy(input.policy);

    if (
      !Number.isInteger(input.attempt) ||
      input.attempt < 1
    ) {
      throw new Error(
        'attempt must be a positive integer.',
      );
    }

    const permanent =
      input.failureClass === 'permanent';

    const exhausted =
      input.attempt >=
      input.policy.maximumAttempts;

    const retryable =
      !permanent && !exhausted;

    if (!retryable) {
      return {
        retryable: false,
        exhausted,
        attempt: input.attempt,
        delayMs: 0,
        failureClass: input.failureClass,
        deadLetter: permanent || exhausted,
      };
    }

    const exponential =
      input.policy.baseDelayMs *
      2 ** (input.attempt - 1);

    const bounded = Math.min(
      exponential,
      input.policy.maximumDelayMs,
    );

    const random =
      input.random ?? Math.random();

    if (
      !Number.isFinite(random) ||
      random < 0 ||
      random > 1
    ) {
      throw new Error(
        'random must be between 0 and 1.',
      );
    }

    const spread =
      bounded *
      input.policy.jitterRatio;

    const delayMs = Math.max(
      1,
      Math.round(
        bounded - spread +
        random * spread * 2,
      ),
    );

    return {
      retryable: true,
      exhausted: false,
      attempt: input.attempt,
      delayMs,
      failureClass: input.failureClass,
      deadLetter: false,
    };
  }

  private validatePolicy(
    policy: DistributedRetryPolicy,
  ): void {
    if (
      !Number.isInteger(policy.maximumAttempts) ||
      policy.maximumAttempts < 1
    ) {
      throw new Error(
        'maximumAttempts must be a positive integer.',
      );
    }

    if (
      !Number.isInteger(policy.baseDelayMs) ||
      policy.baseDelayMs < 1
    ) {
      throw new Error(
        'baseDelayMs must be a positive integer.',
      );
    }

    if (
      !Number.isInteger(policy.maximumDelayMs) ||
      policy.maximumDelayMs <
        policy.baseDelayMs
    ) {
      throw new Error(
        'maximumDelayMs must be at least baseDelayMs.',
      );
    }

    if (
      !Number.isFinite(policy.jitterRatio) ||
      policy.jitterRatio < 0 ||
      policy.jitterRatio > 1
    ) {
      throw new Error(
        'jitterRatio must be between 0 and 1.',
      );
    }
  }
}
