import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class ProfitabilityIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Profitability Intelligence', 'profitability-intelligence');
  }
}
