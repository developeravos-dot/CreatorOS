import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class SemanticMemoryEngineService {
  build(input: MetaIntelligenceInput) {
    return {
      concepts: [
        input.domain,
        ...input.markets ?? [],
        ...input.projects ?? [],
        ...input.capabilities ?? [],
        'strategy',
        'evidence',
        'risk',
        'opportunity',
        'learning',
      ],
      memories: [
        `objective:${input.objective}`,
        `owner:${input.owner}`,
      ],
      relatedCaseIds: [],
      lessons: [],
    };
  }
}