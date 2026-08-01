import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class MarketPerformanceIntelligenceStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Market Performance Intelligence Stage',
      'market-performance-intelligence',
    );
  }
}
