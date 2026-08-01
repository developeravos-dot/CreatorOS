import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IpAsset, IpGrowthBrief } from '../ip-brand-growth.types';

@Injectable()
export class IpIntelligenceService {
  build(brief: IpGrowthBrief): IpAsset[] {
    const markets = brief.markets ?? ['UAE', 'GCC', 'Global'];

    return [
      {
        id: randomUUID(),
        name: brief.brandName,
        category: 'trademark',
        description: `Primary brand identity for ${brief.title}`,
        ownershipStatus: 'creator-owned-pending-verification',
        registrationPriority: 1,
        territories: markets,
        evidenceRequirements: [
          'creation-record',
          'first-use-record',
          'logo-master-files',
          'brand-guidelines',
        ],
        protectionActions: [
          'trademark-clearance-search',
          'territory-registration-plan',
          'domain-and-social-handle-lock',
          'brand-monitoring',
        ],
      },
      {
        id: randomUUID(),
        name: `${brief.title} Core Property`,
        category: 'copyright',
        description: brief.concept,
        ownershipStatus: 'creator-owned-pending-documentation',
        registrationPriority: 1,
        territories: markets,
        evidenceRequirements: [
          'dated-source-files',
          'version-history',
          'authorship-record',
          'contributor-assignments',
        ],
        protectionActions: [
          'copyright-deposit',
          'chain-of-title-documentation',
          'content-fingerprint',
          'usage-monitoring',
        ],
      },
      {
        id: randomUUID(),
        name: `${brief.title} Characters and World`,
        category: 'character-and-world-ip',
        description: 'Characters, locations, rules, lore and visual identity',
        ownershipStatus: 'creator-owned',
        registrationPriority: 2,
        territories: markets,
        evidenceRequirements: [
          'character-bibles',
          'world-bible',
          'visual-reference-sheets',
          'canon-record',
        ],
        protectionActions: [
          'copyright-registration',
          'design-right-review',
          'continuity-control',
          'license-boundary-definition',
        ],
      },
      {
        id: randomUUID(),
        name: `${brief.title} Technology and Methods`,
        category: 'patent-or-trade-secret-review',
        description: 'Potentially novel technical workflows, systems or methods',
        ownershipStatus: 'requires-technical-and-legal-review',
        registrationPriority: 3,
        territories: markets,
        evidenceRequirements: [
          'invention-disclosure',
          'technical-architecture',
          'novelty-analysis',
          'inventor-record',
        ],
        protectionActions: [
          'patentability-review',
          'trade-secret-classification',
          'confidentiality-controls',
          'filing-decision-gate',
        ],
      },
    ];
  }
}