import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class MarketSelectionStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Market Selection Stage',
      'market-selection',
    );
  }
}
