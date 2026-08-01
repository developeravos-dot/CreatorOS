import { Injectable } from '@nestjs/common';
import { GlobalMediaProgramInput } from './media-global-operating-system.types';

@Injectable()
export class MonetizationFinancialEngineService {
  build(input: GlobalMediaProgramInput) {
    const forecast = Math.round(
      (
        (input.revenuePotential ?? 0.7) * 0.4 +
        (input.scalability ?? 0.7) * 0.35 +
        (input.strategicFit ?? 0.75) * 0.25
      ) * 250000,
    );

    return {
      models: [
        'advertising',
        'sponsorship',
        'affiliate-commerce',
        'premium-content',
        'memberships',
        'digital-products',
        'content-licensing',
        'format-licensing',
        'production-services',
        'education-products',
      ],
      forecast,
      realized: 0,
    };
  }
}