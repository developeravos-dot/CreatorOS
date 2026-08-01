import { Injectable } from '@nestjs/common';

import {
  MonetizationEngineBase,
} from '../monetization-core/monetization-engine.base';

@Injectable()
export class MonetizationDashboardService extends MonetizationEngineBase {
  constructor() {
    super('CreatorOS YouTube Monetization Dashboard Engine');
  }
}
