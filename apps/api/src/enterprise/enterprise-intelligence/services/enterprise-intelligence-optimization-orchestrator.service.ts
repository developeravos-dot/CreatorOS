import {
  Injectable,
} from '@nestjs/common';

import {
  EnterpriseCapacityIntelligenceService,
} from './enterprise-capacity-intelligence.service';
import {
  EnterpriseCostIntelligenceService,
} from './enterprise-cost-intelligence.service';
import {
  EnterpriseFailurePredictionService,
} from './enterprise-failure-prediction.service';
import {
  EnterprisePerformanceIntelligenceService,
} from './enterprise-performance-intelligence.service';
import {
  EnterpriseSelfOptimizationService,
} from './enterprise-self-optimization.service';

@Injectable()
export class EnterpriseIntelligenceOptimizationOrchestratorService {
  constructor(
    private readonly cost:
      EnterpriseCostIntelligenceService,
    private readonly performance:
      EnterprisePerformanceIntelligenceService,
    private readonly failure:
      EnterpriseFailurePredictionService,
    private readonly capacity:
      EnterpriseCapacityIntelligenceService,
    private readonly optimization:
      EnterpriseSelfOptimizationService,
  ) {}

  analyze(input: {
    readonly costs: Parameters<
      EnterpriseCostIntelligenceService[
        'assess'
      ]
    >[0];
    readonly performance:
      Parameters<
        EnterprisePerformanceIntelligenceService[
          'assess'
        ]
      >[0];
    readonly failureSignals:
      Parameters<
        EnterpriseFailurePredictionService[
          'predict'
        ]
      >[0];
    readonly capacity:
      Parameters<
        EnterpriseCapacityIntelligenceService[
          'recommend'
        ]
      >[0];
  }) {
    const cost =
      this.cost.assess(input.costs);

    const performance =
      this.performance.assess(
        input.performance,
      );

    const failure =
      this.failure.predict(
        input.failureSignals,
      );

    const capacity =
      this.capacity.recommend(
        input.capacity,
      );

    const actions =
      this.optimization.plan({
        costUtilization:
          cost.utilization,
        performanceScore:
          performance.score,
        failureProbability:
          failure.probability,
        capacityDelta:
          capacity.delta,
      });

    return {
      cost,
      performance,
      failure,
      capacity,
      actions,
      generatedAt: new Date(),
    };
  }
}
