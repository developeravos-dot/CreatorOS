import { Injectable } from '@nestjs/common';

import {
  MediaMonetizationEngineBase,
} from '../media-monetization-core/media-monetization-engine.base';

@Injectable()
export class ContentLicensingRevenueEngineService extends MediaMonetizationEngineBase {
  constructor() {
    super('AVOS Media Content Licensing Revenue Engine');
  }
}
