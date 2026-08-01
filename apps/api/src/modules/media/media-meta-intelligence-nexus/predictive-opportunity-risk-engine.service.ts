import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class PredictiveOpportunityRiskEngineService {
  analyze(input: MetaIntelligenceInput) {
    const opportunityScore = this.n(
      (input.strategicFit ?? 0.75) * 0.4 +
      (input.expectedReturn ?? 0.65) * 0.35 +
      (input.readiness ?? 0.6) * 0.25,
    );

    const riskScore = this.n(
      (input.risk ?? 0.35) * 0.5 +
      (input.complexity ?? 0.45) * 0.3 +
      (1 - (input.readiness ?? 0.6)) * 0.2,
    );

    return {
      opportunities: [
        `priority-${input.domain}-initiative`,
        'cross-project-capability-reuse',
        'partner-enabled-expansion',
        'owned-IP-compounding',
      ],
      risks: [
        'execution-delay',
        'weak-evidence',
        'platform-dependency',
        'capability-gap',
      ],
      opportunityScore,
      riskScore,
    };
  }

  private n(value: number) {
    return Number(Math.max(0, Math.min(1, value)).toFixed(3));
  }
}