import { Injectable } from '@nestjs/common';
import { GrowthPlan, IpGrowthBrief } from '../ip-brand-growth.types';

@Injectable()
export class GrowthIntelligenceService {
  build(brief: IpGrowthBrief): GrowthPlan {
    const horizon = Math.max(6, brief.timeHorizonMonths ?? 24);

    return {
      loops: [
        {
          name: 'Content Discovery Loop',
          trigger: 'high-performing-original-content',
          action: 'create-related-original-assets',
          result: 'more-qualified-discovery',
          reinforcement: 'performance-data-improves-next-content',
        },
        {
          name: 'Community Advocacy Loop',
          trigger: 'strong-fan-identity',
          action: 'enable-safe-sharing-and-participation',
          result: 'organic-distribution',
          reinforcement: 'community-recognition-increases-loyalty',
        },
        {
          name: 'IP Expansion Loop',
          trigger: 'validated-character-world-or-format',
          action: 'expand-into-new-format',
          result: 'new-revenue-and-audience',
          reinforcement: 'new-format-strengthens-core-property',
        },
        {
          name: 'Partner Distribution Loop',
          trigger: 'aligned-partner-value',
          action: 'co-distribute-or-co-create',
          result: 'market-access',
          reinforcement: 'measured-results-attract-better-partners',
        },
      ],
      milestones: [
        {
          month: Math.min(3, horizon),
          objective: 'Validate core audience and positioning',
          metric: 'qualified-engaged-audience',
          target: 1000,
        },
        {
          month: Math.min(6, horizon),
          objective: 'Validate repeatable original content system',
          metric: 'successful-content-formats',
          target: 3,
        },
        {
          month: Math.min(12, horizon),
          objective: 'Activate diversified revenue',
          metric: 'active-revenue-streams',
          target: 3,
        },
        {
          month: horizon,
          objective: 'Establish scalable IP ecosystem',
          metric: 'validated-franchise-expansions',
          target: 5,
        },
      ],
    };
  }
}