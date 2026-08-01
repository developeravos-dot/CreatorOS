import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class KnowledgeFabricEngineService {
  build(input: MetaIntelligenceInput) {
    const entities = [
      input.domain,
      input.owner,
      ...input.markets ?? [],
      ...input.projects ?? [],
      ...input.capabilities ?? [],
    ];

    const relationships = entities.slice(1).map((entity) => ({
      from: input.domain,
      to: entity,
      type: 'related-to',
    }));

    return {
      entities: [...new Set(entities)],
      relationships,
      canonicalFacts: [
        `objective:${input.objective}`,
        `owner:${input.owner}`,
        `domain:${input.domain}`,
      ],
    };
  }
}