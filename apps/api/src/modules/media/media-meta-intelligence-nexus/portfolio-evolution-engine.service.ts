import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class PortfolioEvolutionEngineService {
  score(input: MetaIntelligenceInput) {
    const strategicContribution = this.n(input.strategicFit ?? 0.75);
    const diversificationContribution = this.n(
      ((input.projects?.length ?? 0) > 1 ? 0.82 : 0.58),
    );
    const capitalEfficiency = this.n(
      (input.expectedReturn ?? 0.65) * 0.6 +
      (1 - (input.risk ?? 0.35)) * 0.4,
    );

    const priorityScore = Number(
      (
        strategicContribution * 0.4 +
        diversificationContribution * 0.2 +
        capitalEfficiency * 0.4
      ).toFixed(3),
    );

    return {
      strategicContribution,
      diversificationContribution,
      capitalEfficiency,
      priorityScore,
    };
  }

  private n(value: number) {
    return Number(Math.max(0, Math.min(1, value)).toFixed(3));
  }
}