import { Injectable } from '@nestjs/common';
import {
  OpportunityScore,
  OpportunitySignalInput,
} from './media-growth-opportunity.types';

@Injectable()
export class OpportunityRadarService {
  score(input: OpportunitySignalInput): OpportunityScore {
    const urgency = this.normalize(input.urgency ?? 0.5);
    const strategicFit = this.normalize(input.strategicFit ?? 0.65);
    const commercialPotential = this.normalize(input.commercialPotential ?? 0.6);
    const originality = this.normalize(input.originality ?? 0.7);
    const executionReadiness = this.normalize(input.executionReadiness ?? 0.55);
    const risk = this.normalize(input.risk ?? 0.35);

    const total = Number((
      urgency * 0.15 +
      strategicFit * 0.25 +
      commercialPotential * 0.2 +
      originality * 0.15 +
      executionReadiness * 0.15 +
      (1 - risk) * 0.1
    ).toFixed(3));

    return {
      urgency,
      strategicFit,
      commercialPotential,
      originality,
      executionReadiness,
      risk,
      total,
      recommendation:
        total >= 0.78
          ? 'prioritize'
          : total >= 0.62
            ? 'experiment'
            : total >= 0.45
              ? 'observe'
              : 'reject',
    };
  }

  private normalize(value: number): number {
    return Math.max(0, Math.min(1, value));
  }
}