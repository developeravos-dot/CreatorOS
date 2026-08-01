import { Injectable } from '@nestjs/common';
import { CivilizationProgramInput } from './media-civilization.types';

@Injectable()
export class CivilizationEconomyEngineService {
  build(input: CivilizationProgramInput) {
    const budget = Math.max(0, input.budget ?? 1000000);
    const economicPotential = this.n(input.economicPotential ?? 0.75);
    const readiness = this.n(input.readiness ?? 0.6);
    const risk = this.n(input.risk ?? 0.3);

    return {
      currencies: [
        'fiat-settlement',
        'platform-credits',
        'creator-royalty-units',
        'community-reward-points',
      ],
      markets: [
        'content-marketplace',
        'IP-marketplace',
        'services-marketplace',
        'education-marketplace',
        'data-and-insight-marketplace',
      ],
      revenueModels: [
        'subscriptions',
        'licensing',
        'transaction-fees',
        'advertising',
        'sponsorships',
        'enterprise-services',
        'digital-products',
      ],
      projectedEconomicValue: Math.round(
        budget * (1 + economicPotential * readiness * (1 - risk)),
      ),
    };
  }

  private n(value: number) {
    return Math.max(0, Math.min(1, value));
  }
}