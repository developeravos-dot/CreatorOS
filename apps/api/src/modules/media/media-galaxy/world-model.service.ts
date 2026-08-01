import { Injectable } from '@nestjs/common';

@Injectable()
export class WorldModelService {
  build(markets: string[], audience: string) {
    return {
      audience,
      markets,
      intelligence: ['market', 'trend', 'culture', 'competitor', 'risk'],
      signals: markets.map((market) => ({ market, demand: 'unknown-until-measured', culturalReview: true, complianceReview: true })),
      scenarios: ['base case', 'growth case', 'downside case', 'disruption case'],
      refreshPolicy: 'Recompute when meaningful evidence changes',
    };
  }
}
