import { Injectable } from '@nestjs/common';

import {
  IntelligenceStrategyEngineBase,
} from '../intelligence-strategy-core/intelligence-strategy-engine.base';

@Injectable()
export class ChannelStrategyEngineService extends IntelligenceStrategyEngineBase {
  constructor() {
    super('CreatorOS YouTube Channel Strategy Engine');
  }
}
