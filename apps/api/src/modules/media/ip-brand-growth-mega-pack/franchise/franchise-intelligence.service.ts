import { Injectable } from '@nestjs/common';
import { FranchisePlan, IpGrowthBrief } from '../ip-brand-growth.types';

@Injectable()
export class FranchiseIntelligenceService {
  build(brief: IpGrowthBrief): FranchisePlan {
    return {
      universeName: `${brief.title} Universe`,
      expansionPaths: [
        {
          name: 'Flagship Series',
          format: 'premium-series',
          audience: brief.audience,
          dependency: 'validated-core-property',
          priority: 1,
        },
        {
          name: 'Short-Form Universe',
          format: 'short-form-social',
          audience: 'growth-audience',
          dependency: 'character-and-world-assets',
          priority: 2,
        },
        {
          name: 'Interactive Experience',
          format: 'interactive-digital',
          audience: 'engaged-community',
          dependency: 'world-rules-and-user-journey',
          priority: 3,
        },
        {
          name: 'Publishing Line',
          format: 'books-comics-guides',
          audience: 'collectors-and-learning-audience',
          dependency: 'canon-and-editorial-system',
          priority: 4,
        },
        {
          name: 'Consumer Products',
          format: 'merchandise-and-collectibles',
          audience: 'fans-and-collectors',
          dependency: 'brand-demand-and-license-controls',
          priority: 5,
        },
      ],
      canonRules: [
        'single-authoritative-canon',
        'versioned-story-bible',
        'approved-character-changes-only',
        'approved-world-rule-changes-only',
        'human-final-authority',
      ],
      continuityRules: [
        'timeline-consistency',
        'character-identity-consistency',
        'world-rule-consistency',
        'visual-language-consistency',
        'cross-format-continuity-review',
      ],
    };
  }
}