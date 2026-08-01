import { Injectable } from '@nestjs/common';

import {
  MediaMonetizationEngineBase,
} from '../media-monetization-core/media-monetization-engine.base';

@Injectable()
export class SponsorshipIntelligenceEngineService extends MediaMonetizationEngineBase {
  constructor() {
    super('AVOS Media Sponsorship Intelligence Engine');
  }
}
