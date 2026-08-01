import { Injectable } from '@nestjs/common';
import { GlobalMediaProgramInput } from './media-global-operating-system.types';

@Injectable()
export class StrategyIntelligenceEngineService {
  build(input: GlobalMediaProgramInput) {
    const score = Number(
      (
        (input.strategicFit ?? 0.75) * 0.3 +
        (input.originality ?? 0.75) * 0.2 +
        (input.revenuePotential ?? 0.7) * 0.2 +
        (input.scalability ?? 0.7) * 0.2 +
        (input.readiness ?? 0.6) * 0.1
      ).toFixed(3),
    );

    return {
      thesis: `${input.name} will build owned global media value through original IP, intelligent distribution and controlled monetization.`,
      objectives: [
        'build-owned-media-IP',
        'grow-global-audience',
        'diversify-revenue',
        'compound-organizational-learning',
        'create-repeatable-formats',
      ],
      priorities: [
        'originality',
        'audience-value',
        'rights-ownership',
        'global-scalability',
        'commercial-sustainability',
        'human-final-authority',
      ],
      score,
    };
  }
}