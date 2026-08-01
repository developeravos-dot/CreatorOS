import { Injectable } from '@nestjs/common';

import {
  MediaMonetizationEngineBase,
} from '../media-monetization-core/media-monetization-engine.base';

@Injectable()
export class AffiliateCommerceEngineService extends MediaMonetizationEngineBase {
  constructor() {
    super('AVOS Media Affiliate Commerce Engine');
  }
}
