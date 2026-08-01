import { Injectable } from '@nestjs/common';
import { MediaAssetInput } from './media-enterprise-expansion.types';

@Injectable()
export class RevenueIntelligenceEngineService {
  build(input: MediaAssetInput) {
    const potential = Math.max(0, Math.min(1, input.revenuePotential ?? 0.65));
    const scalability = Math.max(0, Math.min(1, input.scalability ?? 0.65));
    const strategic = Math.max(0, Math.min(1, input.strategicScore ?? 0.7));
    const forecast = Math.round((potential * 0.45 + scalability * 0.35 + strategic * 0.2) * 100000);

    return {
      models: [
        'platform-advertising',
        'sponsorship',
        'affiliate-commerce',
        'premium-content',
        'digital-products',
        'content-licensing',
        'production-services',
        'membership',
      ],
      forecast,
      realized: 0,
    };
  }
}