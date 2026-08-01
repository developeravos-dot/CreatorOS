import { Injectable } from '@nestjs/common';

import {
  OptimizationEngineBase,
} from '../optimization-core/optimization-engine.base';

@Injectable()
export class PublishingIntelligenceService extends OptimizationEngineBase {
  constructor() {
    super('CreatorOS Publishing Intelligence Engine', {
      minimumLength: 20,
      maximumLength: 1000,
      recommendedLength: 300,
      maximumWords: 150,
      powerWords: ['publish', 'schedule', 'audience', 'engagement', 'growth', 'launch', 'optimize'],
      prohibitedWords: ['unverified', 'incomplete', 'blocked'],
    });
  }
}
