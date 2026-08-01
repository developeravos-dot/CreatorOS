import { Injectable } from '@nestjs/common';

import {
  MonetizationEngineBase,
} from '../monetization-core/monetization-engine.base';

@Injectable()
export class DigitalProductsEngineService extends MonetizationEngineBase {
  constructor() {
    super('CreatorOS YouTube Digital Products Engine');
  }
}
