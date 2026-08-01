import { Injectable } from '@nestjs/common';
import { IpGrowthBrief, MonetizationPlan } from '../ip-brand-growth.types';

@Injectable()
export class MonetizationIntelligenceService {
  build(brief: IpGrowthBrief): MonetizationPlan {
    const requested = brief.revenueObjectives ?? [];

    return {
      revenueStreams: [
        {
          name: 'Platform Revenue',
          model: 'advertising-and-platform-share',
          priority: 1,
          dependencies: ['audience-scale', 'platform-eligibility'],
          risks: ['platform-dependency', 'revenue-volatility'],
        },
        {
          name: 'Sponsorship Intelligence',
          model: 'brand-sponsorship-and-integrations',
          priority: 2,
          dependencies: ['brand-safety', 'audience-fit', 'rate-card'],
          risks: ['brand-misalignment', 'audience-trust-loss'],
        },
        {
          name: 'Digital Products',
          model: 'direct-sale',
          priority: 3,
          dependencies: ['validated-demand', 'commerce-stack'],
          risks: ['weak-product-market-fit', 'support-load'],
        },
        {
          name: 'Content Licensing',
          model: 'rights-fees-and-royalties',
          priority: 4,
          dependencies: ['clean-chain-of-title', 'license-packages'],
          risks: ['rights-leakage', 'territory-conflicts'],
        },
        {
          name: 'Membership',
          model: 'recurring-subscription',
          priority: 5,
          dependencies: ['exclusive-value', 'community-system'],
          risks: ['churn', 'content-obligation'],
        },
        {
          name: 'Consumer Products',
          model: 'merchandise-and-collectibles',
          priority: 6,
          dependencies: ['brand-demand', 'supply-chain'],
          risks: ['inventory', 'quality-control'],
        },
        ...requested.map((objective, index) => ({
          name: objective,
          model: 'custom-objective',
          priority: 10 + index,
          dependencies: ['human-validation'],
          risks: ['unvalidated-model'],
        })),
      ],
      portfolioRules: [
        'do-not-depend-on-one-revenue-stream',
        'protect-audience-trust',
        'measure-unit-economics',
        'preserve-ip-ownership',
        'human-approval-for-major-commercial-deals',
      ],
    };
  }
}