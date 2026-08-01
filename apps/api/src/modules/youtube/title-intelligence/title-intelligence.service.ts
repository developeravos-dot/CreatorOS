import { Injectable } from '@nestjs/common';

import {
  OptimizationEngineBase,
} from '../optimization-core/optimization-engine.base';

@Injectable()
export class TitleIntelligenceService extends OptimizationEngineBase {
  constructor() {
    super('CreatorOS Title Intelligence Engine', {
      minimumLength: 20,
      maximumLength: 100,
      recommendedLength: 60,
      maximumWords: 14,
      powerWords: ['how', 'best', 'secret', 'ultimate', 'powerful', 'proven', 'complete'],
      prohibitedWords: ['fake', 'guaranteed', 'impossible'],
    });
  }
}
