import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseCostSample {
  readonly sampleId: string;
  readonly category: string;
  readonly amount: number;
  readonly budget: number;
  readonly observedAt: Date;
}

export interface EnterpriseCostAssessment {
  readonly totalAmount: number;
  readonly totalBudget: number;
  readonly variance: number;
  readonly utilization: number;
  readonly status:
    | 'healthy'
    | 'warning'
    | 'critical';
  readonly recommendations:
    readonly string[];
}

@Injectable()
export class EnterpriseCostIntelligenceService {
  assess(
    samples:
      readonly EnterpriseCostSample[],
  ): EnterpriseCostAssessment {
    if (samples.length === 0) {
      throw new Error(
        'At least one cost sample is required.',
      );
    }

    const totalAmount =
      samples.reduce(
        (total, sample) =>
          total + sample.amount,
        0,
      );

    const totalBudget =
      samples.reduce(
        (total, sample) =>
          total + sample.budget,
        0,
      );

    const variance =
      totalAmount - totalBudget;

    const utilization =
      totalBudget === 0
        ? 1
        : totalAmount / totalBudget;

    const recommendations:
      string[] = [];

    if (utilization > 1) {
      recommendations.push(
        'reduce-noncritical-spend',
      );
    }

    if (
      samples.some(
        (sample) =>
          sample.amount >
          sample.budget * 1.2,
      )
    ) {
      recommendations.push(
        'investigate-category-overrun',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'maintain-current-cost-policy',
      );
    }

    return {
      totalAmount,
      totalBudget,
      variance,
      utilization,
      status:
        utilization >= 1.2
          ? 'critical'
          : utilization > 1
            ? 'warning'
            : 'healthy',
      recommendations,
    };
  }
}
