import { Injectable } from '@nestjs/common';

import {
  MediaMonetizationEngineBase,
} from '../media-monetization-core/media-monetization-engine.base';

@Injectable()
export class AdvertisingRevenueEngineService extends MediaMonetizationEngineBase {
  constructor() {
    super('AVOS Media Advertising Revenue Engine');
  }
}
