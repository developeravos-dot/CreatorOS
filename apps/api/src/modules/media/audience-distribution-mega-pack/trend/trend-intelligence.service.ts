import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DistributionBrief,
  TrendSignal,
} from '../audience-distribution.types';

@Injectable()
export class TrendIntelligenceService {
  analyze(brief: DistributionBrief): TrendSignal[] {
    const markets = brief.targetMarkets ?? ['UAE', 'Saudi Arabia', 'Global'];

    return markets.map((market, index) => {
      const momentum = Math.max(0.55, 0.86 - index * 0.07);
      const saturation = Math.min(0.9, 0.35 + index * 0.08);
      const relevance = 0.88;
      const originalityOpportunity = Math.max(0.4, 1 - saturation);

      return {
        id: randomUUID(),
        topic: brief.topic,
        market,
        momentum,
        saturation,
        relevance,
        originalityOpportunity,
        recommendation:
          originalityOpportunity >= 0.6
            ? 'create-original-angle'
            : 'differentiate-format-and-positioning',
      };
    });
  }
}