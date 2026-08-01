import { Injectable } from '@nestjs/common';

import {
  MonetizationEngineBase,
} from '../monetization-core/monetization-engine.base';

@Injectable()
export class AffiliateCommerceService extends MonetizationEngineBase {
  constructor() {
    super('CreatorOS YouTube Affiliate Commerce Engine');
  }
}
