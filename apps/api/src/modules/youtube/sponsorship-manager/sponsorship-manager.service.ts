import { Injectable } from '@nestjs/common';

import {
  MonetizationEngineBase,
} from '../monetization-core/monetization-engine.base';

@Injectable()
export class SponsorshipManagerService extends MonetizationEngineBase {
  constructor() {
    super('CreatorOS YouTube Sponsorship Manager');
  }
}
