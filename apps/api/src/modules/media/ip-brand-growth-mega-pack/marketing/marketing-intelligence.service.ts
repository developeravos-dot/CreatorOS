import { Injectable } from '@nestjs/common';
import { IpGrowthBrief, MarketingPlan } from '../ip-brand-growth.types';

@Injectable()
export class MarketingIntelligenceService {
  build(brief: IpGrowthBrief): MarketingPlan {
    const platforms = brief.platforms ?? ['YouTube', 'TikTok', 'Instagram'];

    return {
      campaigns: [
        {
          name: 'Origin Campaign',
          objective: 'Explain why the property exists and why it is different',
          audience: brief.audience,
          channels: platforms,
          message: `${brief.brandName} introduces an original world built around ${brief.concept}`,
          successMetrics: [
            'qualified-reach',
            'brand-search-growth',
            'watch-time',
            'audience-retention',
          ],
        },
        {
          name: 'Proof Campaign',
          objective: 'Demonstrate quality, originality and consistency',
          audience: 'high-intent-audience',
          channels: platforms,
          message: 'Show the strongest creative and intellectual proof points',
          successMetrics: [
            'completion-rate',
            'save-rate',
            'share-rate',
            'returning-viewers',
          ],
        },
        {
          name: 'Community Campaign',
          objective: 'Convert viewers into a participating community',
          audience: 'engaged-fans',
          channels: platforms,
          message: 'Invite participation without surrendering canon authority',
          successMetrics: [
            'community-growth',
            'repeat-engagement',
            'member-contribution-quality',
            'referral-rate',
          ],
        },
      ],
      launchSequence: [
        'protect-core-ip',
        'publish-origin-story',
        'release-proof-content',
        'activate-community',
        'launch-partnerships',
        'open-controlled-licensing',
      ],
    };
  }
}