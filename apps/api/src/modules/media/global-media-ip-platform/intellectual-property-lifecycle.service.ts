import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  GlobalMediaAssetInput,
  IntellectualPropertyBlueprint,
} from './global-media-ip-platform.types';

@Injectable()
export class IntellectualPropertyLifecycleService {
  build(input: GlobalMediaAssetInput): IntellectualPropertyBlueprint {
    const markets = input.targetMarkets?.length ? input.targetMarkets : ['Global'];
    return {
      ipId: `IP-${randomUUID()}`,
      canonicalTitle: input.name.trim(),
      assetClass: input.assetType,
      ownershipStatus: 'AVOS-owned',
      rightsRegistry: markets.map((territory) => ({
        territory,
        media: ['video', 'audio', 'publishing', 'interactive', 'consumer-products', 'live-experiences'],
        status: 'reserved',
      })),
      derivativePaths: [
        'serialized-content',
        'character-universe',
        'books-and-comics',
        'games-and-interactive',
        'courses-and-learning',
        'consumer-products',
        'format-licensing',
        'regional-adaptations',
      ],
      franchiseArchitecture: [
        'master-canon',
        'seasons',
        'spin-offs',
        'characters',
        'locations',
        'timelines',
        'licensed-extensions',
      ],
      characterBible: ['identity', 'motivation', 'voice', 'visual-rules', 'relationships', 'growth-arc'],
      worldBible: ['world-rules', 'history', 'geography', 'culture', 'technology', 'continuity'],
      continuityRules: ['single-canonical-registry', 'versioned-canon', 'approved-derivatives-only', 'conflict-detection'],
      protectionGates: ['originality-check', 'ownership-record', 'source-provenance', 'rights-clearance', 'human-legal-approval'],
      valuationSignals: ['audience-growth', 'retention', 'repeat-demand', 'cross-market-performance', 'licensing-interest', 'revenue-diversity'],
    };
  }
}