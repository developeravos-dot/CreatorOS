import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class MarketDemandIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Market Demand Intelligence', 'market-demand-intelligence');
  }
}
