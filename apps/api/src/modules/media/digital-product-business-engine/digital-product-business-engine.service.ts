import { Injectable } from '@nestjs/common';

import {
  MediaMonetizationEngineBase,
} from '../media-monetization-core/media-monetization-engine.base';

@Injectable()
export class DigitalProductBusinessEngineService extends MediaMonetizationEngineBase {
  constructor() {
    super('AVOS Media Digital Product Business Engine');
  }
}
