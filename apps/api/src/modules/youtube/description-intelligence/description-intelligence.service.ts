import { Injectable } from '@nestjs/common';

import {
  OptimizationEngineBase,
} from '../optimization-core/optimization-engine.base';

@Injectable()
export class DescriptionIntelligenceService extends OptimizationEngineBase {
  constructor() {
    super('CreatorOS Description Intelligence Engine', {
      minimumLength: 100,
      maximumLength: 5000,
      recommendedLength: 500,
      maximumWords: 800,
      powerWords: ['discover', 'learn', 'explore', 'subscribe', 'watch', 'guide', 'complete'],
      prohibitedWords: ['spam', 'fake', 'scam'],
    });
  }
}
