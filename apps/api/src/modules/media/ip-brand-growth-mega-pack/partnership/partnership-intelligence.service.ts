import { Injectable } from '@nestjs/common';
import { IpGrowthBrief, PartnershipPlan } from '../ip-brand-growth.types';

@Injectable()
export class PartnershipIntelligenceService {
  build(brief: IpGrowthBrief): PartnershipPlan {
    return {
      targets: [
        {
          category: 'Distribution Partner',
          valueExchange: 'audience-access-for-premium-original-content',
          idealProfile: 'trusted-platform-or-media-network',
          proposalAssets: [
            'audience-profile',
            'content-catalog',
            'performance-proof',
            'brand-safety-record',
          ],
          riskControls: [
            'non-exclusive-default',
            'territory-definition',
            'data-access-terms',
            'termination-rights',
          ],
        },
        {
          category: 'Brand Partner',
          valueExchange: 'story-aligned-integration-for-funding-and-reach',
          idealProfile: `premium-brand-aligned-with-${brief.brandName}`,
          proposalAssets: [
            'campaign-concept',
            'integration-rules',
            'audience-fit',
            'measurement-plan',
          ],
          riskControls: [
            'creative-control',
            'disclosure-rules',
            'brand-fit-gate',
            'audience-trust-gate',
          ],
        },
        {
          category: 'Technology Partner',
          valueExchange: 'technical-capability-for-showcase-and-product-learning',
          idealProfile: 'reputable-ai-media-or-production-provider',
          proposalAssets: [
            'technical-use-case',
            'innovation-value',
            'visibility-plan',
            'security-requirements',
          ],
          riskControls: [
            'data-ownership',
            'model-usage-rights',
            'confidentiality',
            'vendor-exit-plan',
          ],
        },
        {
          category: 'Licensing Partner',
          valueExchange: 'territory-or-format-expertise-for-controlled-rights',
          idealProfile: 'experienced-rights-operator',
          proposalAssets: [
            'rights-catalog',
            'brand-guidelines',
            'quality-standards',
            'commercial-model',
          ],
          riskControls: [
            'audit-rights',
            'quality-approval',
            'minimum-guarantee-review',
            'rights-reversion',
          ],
        },
      ],
      approvalRules: [
        'strategic-fit-review',
        'financial-review',
        'legal-review',
        'brand-safety-review',
        'human-final-approval',
      ],
    };
  }
}