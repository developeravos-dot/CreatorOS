import { Injectable } from '@nestjs/common';

import {
  IntelligenceStrategyEngineBase,
} from '../intelligence-strategy-core/intelligence-strategy-engine.base';

@Injectable()
export class TrendIntelligenceService extends IntelligenceStrategyEngineBase {
  constructor() {
    super('CreatorOS YouTube Trend Intelligence Engine');
  }
}
