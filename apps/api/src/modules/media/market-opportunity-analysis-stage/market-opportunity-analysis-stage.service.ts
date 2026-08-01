import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class MarketOpportunityAnalysisStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Market Opportunity Analysis',
      'market-opportunity-analysis',
    );
  }
}
