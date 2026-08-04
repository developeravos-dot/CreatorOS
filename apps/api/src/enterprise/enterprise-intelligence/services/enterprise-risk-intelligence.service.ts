import {
  Injectable,
} from '@nestjs/common';

import type {
  EnterpriseSignal,
} from '../contracts';

export interface EnterpriseRiskAssessment {
  readonly assessmentId: string;
  readonly score: number;
  readonly severity:
    | 'low'
    | 'moderate'
    | 'high'
    | 'critical';
  readonly factors:
    readonly string[];
  readonly generatedAt: Date;
}

@Injectable()
export class EnterpriseRiskIntelligenceService {
  assess(input: {
    readonly assessmentId: string;
    readonly signals:
      readonly EnterpriseSignal[];
    readonly now?: Date;
  }): EnterpriseRiskAssessment {
    if (
      !input.assessmentId.trim() ||
      input.signals.length === 0
    ) {
      throw new Error(
        'Risk assessment requires an id and signals.',
      );
    }

    const weighted =
      input.signals.map(
        (signal) => {
          const categoryWeight =
            signal.category === 'failure'
              ? 1
              : signal.category === 'risk'
                ? 0.9
                : signal.category === 'cost'
                  ? 0.6
                  : 0.5;

          return Math.max(
            0,
            Math.min(
              100,
              Math.abs(signal.value),
            ),
          ) *
            Math.max(
              0,
              Math.min(
                1,
                signal.confidence,
              ),
            ) *
            categoryWeight;
        },
      );

    const score =
      weighted.reduce(
        (total, value) =>
          total + value,
        0,
      ) / weighted.length;

    return {
      assessmentId:
        input.assessmentId.trim(),
      score,
      severity:
        score >= 75
          ? 'critical'
          : score >= 50
            ? 'high'
            : score >= 25
              ? 'moderate'
              : 'low',
      factors:
        input.signals
          .filter(
            (_, index) =>
              weighted[index]! >= 40,
          )
          .map(
            (signal) =>
              signal.category +
              ':' +
              signal.signalId,
          ),
      generatedAt: new Date(
        input.now ?? new Date(),
      ),
    };
  }
}
