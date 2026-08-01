import { Injectable } from '@nestjs/common';
import { IntelligenceSignalInput } from './media-intelligence-cloud.types';

@Injectable()
export class CompetitiveIntelligenceEngineService {
  analyze(input: IntelligenceSignalInput) {
    const competitors = input.competitors ?? [];

    return {
      monitored: competitors,
      movements: competitors.map(
        (competitor) => `${competitor}:movement-under-analysis`,
      ),
      gaps: [
        'underserved-audience',
        'weak-localization',
        'format-fatigue',
        'slow-production-cycle',
        'limited-IP-ownership',
        'weak-community-loop',
      ],
    };
  }
}