import { Injectable } from '@nestjs/common';

import {
  MonetizationEngineBase,
} from '../monetization-core/monetization-engine.base';

@Injectable()
export class RevenueIntelligenceService extends MonetizationEngineBase {
  constructor() {
    super('CreatorOS YouTube Revenue Intelligence Engine');
  }
}
