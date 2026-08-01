import { Injectable } from '@nestjs/common';

import {
  OptimizationEngineBase,
} from '../optimization-core/optimization-engine.base';

@Injectable()
export class TagsIntelligenceService extends OptimizationEngineBase {
  constructor() {
    super('CreatorOS Tags Intelligence Engine', {
      minimumLength: 10,
      maximumLength: 500,
      recommendedLength: 250,
      maximumWords: 60,
      powerWords: ['youtube', 'creator', 'content', 'video', 'growth', 'trending', 'tutorial'],
      prohibitedWords: ['unrelated', 'spam', 'duplicate'],
    });
  }
}
