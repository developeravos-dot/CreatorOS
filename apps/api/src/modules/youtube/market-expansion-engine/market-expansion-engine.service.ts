import { Injectable } from '@nestjs/common';

import {
  GlobalExpansionEngineBase,
} from '../global-expansion-core/global-expansion-engine.base';

@Injectable()
export class MarketExpansionEngineService extends GlobalExpansionEngineBase {
  constructor() {
    super('CreatorOS YouTube Market Expansion Engine');
  }
}
