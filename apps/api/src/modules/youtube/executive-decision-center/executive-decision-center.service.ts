import { Injectable } from '@nestjs/common';

import {
  IntelligenceStrategyEngineBase,
} from '../intelligence-strategy-core/intelligence-strategy-engine.base';

@Injectable()
export class ExecutiveDecisionCenterService extends IntelligenceStrategyEngineBase {
  constructor() {
    super('CreatorOS YouTube Executive Decision Center');
  }
}
