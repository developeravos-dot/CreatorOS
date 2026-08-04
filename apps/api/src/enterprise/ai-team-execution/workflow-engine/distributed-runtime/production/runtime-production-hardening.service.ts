import { Injectable } from '@nestjs/common';

export interface RuntimeLoadSample {
  readonly concurrency: number;
  readonly operations: number;
  readonly durationMs: number;
  readonly failures: number;
}

export interface RuntimeHardeningReport {
  readonly accepted: boolean;
  readonly throughputPerSecond: number;
  readonly failureRate: number;
  readonly findings: readonly string[];
  readonly generatedAt: Date;
}

@Injectable()
export class RuntimeProductionHardeningService {
  evaluate(
    sample: RuntimeLoadSample,
  ): RuntimeHardeningReport {
    this.validate(sample);

    const throughputPerSecond =
      sample.durationMs === 0
        ? sample.operations
        : (
            sample.operations /
            sample.durationMs
          ) * 1000;

    const failureRate =
      sample.operations === 0
        ? 0
        : sample.failures /
          sample.operations;

    const findings: string[] = [];

    if (sample.concurrency > 500) {
      findings.push(
        'Concurrency exceeds the validated runtime envelope.',
      );
    }

    if (failureRate > 0.01) {
      findings.push(
        'Failure rate exceeds the one-percent production threshold.',
      );
    }

    if (throughputPerSecond < 1) {
      findings.push(
        'Runtime throughput is below the minimum production threshold.',
      );
    }

    return {
      accepted: findings.length === 0,
      throughputPerSecond,
      failureRate,
      findings,
      generatedAt: new Date(),
    };
  }

  validateSecurity(input: {
    readonly secretValues:
      readonly string[];
    readonly loggedValues:
      readonly string[];
    readonly tenantIds:
      readonly string[];
  }): readonly string[] {
    const findings: string[] = [];

    const leakedSecrets =
      input.secretValues.filter(
        (secret) =>
          secret.length > 0 &&
          input.loggedValues.some(
            (value) =>
              value.includes(secret),
          ),
      );

    if (leakedSecrets.length > 0) {
      findings.push(
        'Sensitive runtime values were found in logs.',
      );
    }

    if (
      new Set(input.tenantIds).size !==
      input.tenantIds.length
    ) {
      findings.push(
        'Duplicate tenant isolation identifiers were detected.',
      );
    }

    return findings;
  }

  releaseCandidate(input: {
    readonly testsPassed: boolean;
    readonly typecheckPassed: boolean;
    readonly buildPassed: boolean;
    readonly whitespaceCheckPassed: boolean;
    readonly hardeningAccepted: boolean;
    readonly securityFindings:
      readonly string[];
  }): {
    readonly ready: boolean;
    readonly blockers:
      readonly string[];
  } {
    const blockers: string[] = [];

    if (!input.testsPassed) {
      blockers.push(
        'Automated tests failed.',
      );
    }

    if (!input.typecheckPassed) {
      blockers.push(
        'TypeScript validation failed.',
      );
    }

    if (!input.buildPassed) {
      blockers.push(
        'Production build failed.',
      );
    }

    if (
      !input.whitespaceCheckPassed
    ) {
      blockers.push(
        'Git whitespace validation failed.',
      );
    }

    if (!input.hardeningAccepted) {
      blockers.push(
        'Runtime hardening report was rejected.',
      );
    }

    blockers.push(
      ...input.securityFindings,
    );

    return {
      ready: blockers.length === 0,
      blockers,
    };
  }

  private validate(
    sample: RuntimeLoadSample,
  ): void {
    for (const [
      field,
      value,
    ] of [
      [
        'concurrency',
        sample.concurrency,
      ],
      [
        'operations',
        sample.operations,
      ],
      [
        'durationMs',
        sample.durationMs,
      ],
      [
        'failures',
        sample.failures,
      ],
    ] as const) {
      if (
        !Number.isInteger(value) ||
        value < 0
      ) {
        throw new Error(
          `${field} must be a non-negative integer.`,
        );
      }
    }

    if (
      sample.failures >
      sample.operations
    ) {
      throw new Error(
        'failures cannot exceed operations.',
      );
    }
  }
}
