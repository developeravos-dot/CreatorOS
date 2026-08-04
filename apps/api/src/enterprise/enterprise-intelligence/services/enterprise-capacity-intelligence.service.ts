import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseCapacityInput {
  readonly currentCapacity: number;
  readonly currentDemand: number;
  readonly predictedDemand: number;
  readonly targetUtilization: number;
  readonly minimumCapacity: number;
  readonly maximumCapacity: number;
}

export interface EnterpriseCapacityRecommendation {
  readonly recommendedCapacity: number;
  readonly delta: number;
  readonly direction:
    | 'increase'
    | 'decrease'
    | 'steady';
  readonly projectedUtilization: number;
}

@Injectable()
export class EnterpriseCapacityIntelligenceService {
  recommend(
    input: EnterpriseCapacityInput,
  ): EnterpriseCapacityRecommendation {
    if (
      input.currentCapacity < 1 ||
      input.targetUtilization <= 0 ||
      input.targetUtilization > 1 ||
      input.minimumCapacity < 1 ||
      input.maximumCapacity <
        input.minimumCapacity
    ) {
      throw new Error(
        'Invalid capacity intelligence input.',
      );
    }

    const demand =
      Math.max(
        input.currentDemand,
        input.predictedDemand,
      );

    const rawCapacity =
      Math.ceil(
        demand /
        input.targetUtilization,
      );

    const recommendedCapacity =
      Math.min(
        input.maximumCapacity,
        Math.max(
          input.minimumCapacity,
          rawCapacity,
        ),
      );

    const delta =
      recommendedCapacity -
      input.currentCapacity;

    return {
      recommendedCapacity,
      delta,
      direction:
        delta > 0
          ? 'increase'
          : delta < 0
            ? 'decrease'
            : 'steady',
      projectedUtilization:
        demand /
        recommendedCapacity,
    };
  }
}
