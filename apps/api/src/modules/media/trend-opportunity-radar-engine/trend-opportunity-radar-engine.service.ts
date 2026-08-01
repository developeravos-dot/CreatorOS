import { Injectable } from '@nestjs/common';

import {
  MediaIntelligenceEngineBase,
} from '../media-intelligence-core/media-intelligence-engine.base';

@Injectable()
export class TrendOpportunityRadarEngineService extends MediaIntelligenceEngineBase {
  constructor() {
    super('AVOS Media Trend and Opportunity Radar Engine');
  }
}
