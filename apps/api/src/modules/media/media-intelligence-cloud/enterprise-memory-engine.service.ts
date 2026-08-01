import { Injectable } from '@nestjs/common';
import { IntelligenceSignalInput } from './media-intelligence-cloud.types';

@Injectable()
export class EnterpriseMemoryEngineService {
  build(input: IntelligenceSignalInput) {
    return {
      facts: [
        `source:${input.source}`,
        `domain:${input.domain}`,
        `title:${input.title}`,
        ...input.markets?.map((market) => `market:${market}`) ?? [],
        ...input.platforms?.map((platform) => `platform:${platform}`) ?? [],
      ],
      lessons: [],
      relatedCases: [],
    };
  }
}