import { Injectable } from '@nestjs/common';
import {
  CulturalReview,
  DistributionBrief,
} from '../audience-distribution.types';

@Injectable()
export class CulturalIntelligenceService {
  review(brief: DistributionBrief): CulturalReview {
    const markets = brief.targetMarkets ?? ['UAE', 'Saudi Arabia', 'Global'];
    const cultures = brief.targetCultures ?? ['GCC', 'Global'];

    return {
      markets: markets.map((market, index) => ({
        market,
        sensitivities: [
          'religion-and-belief',
          'family-and-age-appropriateness',
          'local-symbols-and-language',
          'historical-context',
          'legal-and-platform-standards',
        ],
        adaptationRules: [
          'use-native-context',
          'avoid-stereotypes',
          'preserve-cultural-dignity',
          'validate-humor-and-idioms',
          `align-with-${cultures[index % cultures.length] ?? 'local'}-expectations`,
        ],
        opportunityNotes: [
          'local-story-angle',
          'regional-partnership',
          'native-creator-collaboration',
          'localized-title-and-thumbnail',
        ],
        riskScore: Math.min(0.5, 0.18 + index * 0.05),
      })),
      globalRules: [
        'no-cultural-stereotyping',
        'no-token-localization',
        'human-cultural-review',
        'market-specific-release-check',
      ],
    };
  }
}