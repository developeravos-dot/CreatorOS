import { Injectable } from '@nestjs/common';

import {
  OptimizationEngineBase,
} from '../optimization-core/optimization-engine.base';

@Injectable()
export class ThumbnailIntelligenceService extends OptimizationEngineBase {
  constructor() {
    super('CreatorOS Thumbnail Intelligence Engine', {
      minimumLength: 8,
      maximumLength: 80,
      recommendedLength: 35,
      maximumWords: 10,
      powerWords: ['amazing', 'secret', 'new', 'best', 'warning', 'exclusive', 'ultimate'],
      prohibitedWords: ['fake', 'scam', 'misleading'],
    });
  }
}
