import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class EcosystemIntelligenceEngineService {
  build(input: MetaIntelligenceInput) {
    return {
      partners: [
        'technology-partners',
        'distribution-partners',
        'creator-partners',
        'research-partners',
        ...input.markets?.map((market) => `${market}:local-partner`) ?? [],
      ],
      networkEffects: [
        'more-content-more-audience',
        'more-audience-more-data',
        'more-data-better-decisions',
        'better-decisions-more-partners',
        'more-partners-more-distribution',
      ],
      expansionPaths: [
        'new-market',
        'new-platform',
        'new-format',
        'new-revenue-model',
        'new-IP-family',
      ],
    };
  }
}