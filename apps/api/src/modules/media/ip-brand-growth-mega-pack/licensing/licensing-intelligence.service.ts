import { Injectable } from '@nestjs/common';
import { IpGrowthBrief, LicensingPlan } from '../ip-brand-growth.types';

@Injectable()
export class LicensingIntelligenceService {
  build(brief: IpGrowthBrief): LicensingPlan {
    const territories = brief.markets ?? ['UAE', 'GCC', 'Global'];

    return {
      packages: [
        {
          name: 'Content Distribution License',
          rights: ['streaming', 'broadcast', 'promotional-use'],
          territories,
          termMonths: 24,
          exclusivity: 'non-exclusive-default',
          royaltyModel: 'minimum-guarantee-plus-revenue-share',
          approvalRequirements: [
            'platform-approval',
            'territory-approval',
            'brand-presentation-approval',
          ],
        },
        {
          name: 'Localization License',
          rights: ['translation', 'subtitling', 'dubbing'],
          territories,
          termMonths: 24,
          exclusivity: 'language-and-territory-limited',
          royaltyModel: 'fixed-fee-plus-performance-bonus',
          approvalRequirements: [
            'script-approval',
            'voice-approval',
            'cultural-review',
          ],
        },
        {
          name: 'Consumer Products License',
          rights: ['approved-merchandise', 'collectibles'],
          territories,
          termMonths: 18,
          exclusivity: 'category-limited',
          royaltyModel: 'minimum-guarantee-plus-royalty',
          approvalRequirements: [
            'product-design-approval',
            'sample-approval',
            'manufacturer-audit',
          ],
        },
        {
          name: 'Interactive Experience License',
          rights: ['game', 'immersive-experience', 'interactive-story'],
          territories,
          termMonths: 36,
          exclusivity: 'format-and-territory-limited',
          royaltyModel: 'development-fee-plus-revenue-share',
          approvalRequirements: [
            'canon-approval',
            'technical-quality-gate',
            'security-review',
          ],
        },
      ],
      controls: [
        'rights-matrix',
        'territory-conflict-check',
        'exclusivity-conflict-check',
        'quality-approval-gate',
        'royalty-audit-rights',
        'termination-and-reversion',
        'human-final-authority',
      ],
    };
  }
}