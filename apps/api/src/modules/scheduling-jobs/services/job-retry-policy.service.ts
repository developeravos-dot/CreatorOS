import {
  Injectable,
} from '@nestjs/common';

import {
  JobRetryPolicyModel,
  calculateJobRetryDelay,
  createDefaultJobRetryPolicy,
  type JobBackoffStrategy,
  type JobFailure,
  type JobFailureKind,
  type JobRetryContext,
  type JobRetryDecision,
  type JobRetryPolicy,
} from '../models';

export interface JobRetryStrategy {
  readonly name:
    JobBackoffStrategy;

  calculateDelay(
    policy:
      JobRetryPolicy,
    attemptNumber: number,
  ): number;
}

export interface JobRetryEvaluationInput {
  readonly attemptNumber: number;
  readonly failure:
    JobFailure;
  readonly policy?:
    JobRetryPolicy;
  readonly now?: string;
  readonly randomValue?: number;
}

export interface JobRetryPolicyMetrics {
  readonly evaluations: number;
  readonly retriesApproved: number;
  readonly retriesRejected: number;
  readonly maximumAttemptsReached: number;
  readonly nonRetryableFailures: number;
  readonly failureKinds:
    Readonly<Record<string, number>>;
  readonly strategies:
    Readonly<Record<string, number>>;
  readonly generatedAt: string;
}

class NoneRetryStrategy
  implements JobRetryStrategy {
  readonly name =
    'none' as const;

  calculateDelay(): number {
    return 0;
  }
}

class FixedRetryStrategy
  implements JobRetryStrategy {
  readonly name =
    'fixed' as const;

  calculateDelay(
    policy:
      JobRetryPolicy,
  ): number {
    return policy.initialDelayMs;
  }
}

class LinearRetryStrategy
  implements JobRetryStrategy {
  readonly name =
    'linear' as const;

  calculateDelay(
    policy:
      JobRetryPolicy,
    attemptNumber: number,
  ): number {
    return (
      policy.initialDelayMs *
      attemptNumber *
      policy.multiplier
    );
  }
}

class ExponentialRetryStrategy
  implements JobRetryStrategy {
  readonly name =
    'exponential' as const;

  calculateDelay(
    policy:
      JobRetryPolicy,
    attemptNumber: number,
  ): number {
    return (
      policy.initialDelayMs *
      Math.pow(
        policy.multiplier,
        attemptNumber - 1,
      )
    );
  }
}

@Injectable()
export class JobRetryPolicyService {
  private readonly strategies =
    new Map<
      JobBackoffStrategy,
      JobRetryStrategy
    >();

  private evaluations = 0;

  private retriesApproved = 0;

  private retriesRejected = 0;

  private maximumAttemptsReached = 0;

  private nonRetryableFailures = 0;

  private readonly failureKinds =
    new Map<string, number>();

  private readonly strategyUsage =
    new Map<string, number>();

  constructor() {
    this.registerStrategy(
      new NoneRetryStrategy(),
    );

    this.registerStrategy(
      new FixedRetryStrategy(),
    );

    this.registerStrategy(
      new LinearRetryStrategy(),
    );

    this.registerStrategy(
      new ExponentialRetryStrategy(),
    );
  }

  registerStrategy(
    strategy:
      JobRetryStrategy,
  ): void {
    this.strategies.set(
      strategy.name,
      strategy,
    );
  }

  unregisterStrategy(
    strategy:
      JobBackoffStrategy,
  ): boolean {
    return this.strategies.delete(
      strategy,
    );
  }

  listStrategies():
    readonly JobBackoffStrategy[] {
    return [
      ...this.strategies.keys(),
    ].sort();
  }

  hasStrategy(
    strategy:
      JobBackoffStrategy,
  ): boolean {
    return this.strategies.has(
      strategy,
    );
  }

  normalizePolicy(
    policy?:
      JobRetryPolicy,
  ): JobRetryPolicy {
    return new JobRetryPolicyModel(
      policy ??
      createDefaultJobRetryPolicy(),
    ).toContract();
  }

  evaluate(
    input:
      JobRetryEvaluationInput,
  ): JobRetryDecision {
    this.evaluations += 1;

    const policy =
      this.normalizePolicy(
        input.policy,
      );

    const now =
      this.normalizeTimestamp(
        input.now ??
        new Date().toISOString(),
      );

    this.incrementMap(
      this.failureKinds,
      input.failure.kind,
    );

    this.incrementMap(
      this.strategyUsage,
      policy.strategy,
    );

    if (
      input.attemptNumber >=
      policy.maximumAttempts
    ) {
      this.maximumAttemptsReached += 1;
      this.retriesRejected += 1;

      return {
        shouldRetry: false,
        reason:
          'Maximum retry attempts reached.',
      };
    }

    if (
      !this.isFailureRetryable(
        input.failure,
        policy,
      )
    ) {
      this.nonRetryableFailures += 1;
      this.retriesRejected += 1;

      return {
        shouldRetry: false,
        reason:
          'Failure is not retryable by policy.',
      };
    }

    const nextAttemptNumber =
      input.attemptNumber + 1;

    const baseDelay =
      this.calculateDelay(
        policy,
        nextAttemptNumber,
      );

    const delayMs =
      policy.jitter
        ? this.applyJitter(
            baseDelay,
            input.randomValue,
          )
        : baseDelay;

    const retryAt =
      new Date(
        new Date(now).getTime() +
        delayMs,
      ).toISOString();

    this.retriesApproved += 1;

    return {
      shouldRetry: true,
      nextAttemptNumber,
      delayMs,
      retryAt,
      reason:
        'Retry scheduled by policy.',
    };
  }

  evaluateContext(
    context:
      JobRetryContext,
  ): JobRetryDecision {
    return this.evaluate({
      attemptNumber:
        context.attemptNumber,
      failure:
        context.failure,
      policy:
        context.policy,
      now:
        context.now,
    });
  }

  calculateDelay(
    policy:
      JobRetryPolicy,
    attemptNumber: number,
  ): number {
    if (
      !Number.isInteger(
        attemptNumber,
      ) ||
      attemptNumber < 1
    ) {
      throw new Error(
        'Retry attemptNumber must be at least 1.',
      );
    }

    const normalizedPolicy =
      this.normalizePolicy(
        policy,
      );

    const strategy =
      this.strategies.get(
        normalizedPolicy.strategy,
      );

    if (!strategy) {
      throw new Error(
        `Retry strategy ${normalizedPolicy.strategy} is not registered.`,
      );
    }

    const calculated =
      strategy.calculateDelay(
        normalizedPolicy,
        attemptNumber,
      );

    const capped =
      typeof normalizedPolicy
        .maximumDelayMs ===
        'number'
        ? Math.min(
            calculated,
            normalizedPolicy
              .maximumDelayMs,
          )
        : calculated;

    return Math.max(
      0,
      Math.floor(capped),
    );
  }

  calculateCanonicalDelay(
    policy:
      JobRetryPolicy,
    attemptNumber: number,
  ): number {
    return calculateJobRetryDelay(
      this.normalizePolicy(
        policy,
      ),
      attemptNumber,
    );
  }

  isFailureRetryable(
    failure:
      JobFailure,
    policy:
      JobRetryPolicy,
  ): boolean {
    if (!failure.retryable) {
      return false;
    }

    const kindAllowed =
      policy
        .retryableFailureKinds
        .includes(
          failure.kind,
        );

    const codeAllowed =
      Boolean(
        failure.code &&
        policy
          .retryableErrorCodes
          .includes(
            failure.code,
          ),
      );

    return (
      kindAllowed ||
      codeAllowed
    );
  }

  classifyFailure(
    input: {
      code?: string;
      message: string;
      retryable?: boolean;
      kind?:
        JobFailureKind;
      details?:
        Readonly<
          Record<string, unknown>
        >;
      occurredAt?: string;
    },
  ): JobFailure {
    const message =
      this.requireText(
        input.message,
        'failure.message',
      );

    const kind =
      input.kind ??
      this.inferFailureKind(
        input.code,
        message,
      );

    const retryable =
      input.retryable ??
      this.defaultRetryableForKind(
        kind,
      );

    return {
      kind,
      code:
        input.code?.trim() ||
        undefined,
      message:
        this.sanitizeText(
          message,
        ),
      retryable,
      occurredAt:
        this.normalizeTimestamp(
          input.occurredAt ??
          new Date().toISOString(),
        ),
      details:
        input.details
          ? this.sanitizeRecord(
              input.details,
            )
          : undefined,
    };
  }

  applyJitter(
    delayMs: number,
    randomValue?:
      number,
  ): number {
    if (
      !Number.isFinite(
        delayMs,
      ) ||
      delayMs < 0
    ) {
      throw new Error(
        'Retry delayMs cannot be negative.',
      );
    }

    const normalizedRandom =
      randomValue === undefined
        ? Math.random()
        : randomValue;

    if (
      !Number.isFinite(
        normalizedRandom,
      ) ||
      normalizedRandom < 0 ||
      normalizedRandom > 1
    ) {
      throw new Error(
        'Retry randomValue must be between 0 and 1.',
      );
    }

    const minimumFactor =
      0.5;

    const maximumFactor =
      1.5;

    const factor =
      minimumFactor +
      (
        maximumFactor -
        minimumFactor
      ) *
      normalizedRandom;

    return Math.max(
      0,
      Math.floor(
        delayMs *
        factor,
      ),
    );
  }

  metrics():
    JobRetryPolicyMetrics {
    return {
      evaluations:
        this.evaluations,
      retriesApproved:
        this.retriesApproved,
      retriesRejected:
        this.retriesRejected,
      maximumAttemptsReached:
        this.maximumAttemptsReached,
      nonRetryableFailures:
        this.nonRetryableFailures,
      failureKinds:
        Object.fromEntries(
          this.failureKinds,
        ),
      strategies:
        Object.fromEntries(
          this.strategyUsage,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  resetMetrics(): void {
    this.evaluations = 0;
    this.retriesApproved = 0;
    this.retriesRejected = 0;
    this.maximumAttemptsReached = 0;
    this.nonRetryableFailures = 0;
    this.failureKinds.clear();
    this.strategyUsage.clear();
  }

  private inferFailureKind(
    code: string | undefined,
    message: string,
  ): JobFailureKind {
    const value =
      `${code ?? ''} ${message}`
        .toLowerCase();

    if (
      value.includes(
        'timeout',
      )
    ) {
      return 'timeout';
    }

    if (
      value.includes(
        'rate limit',
      ) ||
      value.includes(
        'too many requests',
      ) ||
      value.includes('429')
    ) {
      return 'rate_limit';
    }

    if (
      value.includes(
        'dependency',
      )
    ) {
      return 'dependency';
    }

    if (
      value.includes(
        'validation',
      ) ||
      value.includes(
        'invalid',
      )
    ) {
      return 'validation';
    }

    if (
      value.includes(
        'cancel',
      )
    ) {
      return 'cancelled';
    }

    if (
      value.includes(
        'connection',
      ) ||
      value.includes(
        'network',
      ) ||
      value.includes(
        'redis',
      ) ||
      value.includes(
        'database',
      )
    ) {
      return 'infrastructure';
    }

    if (
      value.includes(
        'execution',
      ) ||
      value.includes(
        'worker',
      )
    ) {
      return 'execution';
    }

    return 'unknown';
  }

  private defaultRetryableForKind(
    kind:
      JobFailureKind,
  ): boolean {
    switch (kind) {
      case 'execution':
      case 'timeout':
      case 'dependency':
      case 'infrastructure':
      case 'rate_limit':
      case 'unknown':
        return true;

      case 'validation':
      case 'cancelled':
        return false;

      default: {
        const exhaustive:
          never = kind;

        return Boolean(
          exhaustive,
        );
      }
    }
  }

  private normalizeTimestamp(
    value: string,
  ): string {
    const date =
      new Date(value);

    if (
      !Number.isFinite(
        date.getTime(),
      )
    ) {
      throw new Error(
        'Retry timestamp must be valid.',
      );
    }

    return date.toISOString();
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value?.trim();

    if (!normalized) {
      throw new Error(
        `Job ${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private incrementMap(
    map:
      Map<string, number>,
    key: string,
  ): void {
    map.set(
      key,
      (map.get(key) ?? 0) +
      1,
    );
  }

  private sanitizeText(
    value: string,
  ): string {
    return value
      .replace(
        /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"']+/gi,
        '[REDACTED_CONNECTION_STRING]',
      )
      .replace(
        /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
        'Bearer [REDACTED]',
      )
      .replace(
        /(DATABASE_URL|API_KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[^\s,;]+/gi,
        '$1=[REDACTED]',
      );
  }

  private sanitizeRecord(
    input:
      Readonly<
        Record<string, unknown>
      >,
  ):
    Readonly<Record<string, unknown>> {
    const output:
      Record<string, unknown> =
        {};

    const sensitive =
      /password|secret|token|authorization|api[-_]?key|database[-_]?url/i;

    for (
      const [key, value]
      of Object.entries(input)
    ) {
      if (
        sensitive.test(key)
      ) {
        output[key] =
          '[REDACTED]';

        continue;
      }

      output[key] =
        typeof value ===
        'string'
          ? this.sanitizeText(
              value,
            )
          : value;
    }

    return output;
  }
}