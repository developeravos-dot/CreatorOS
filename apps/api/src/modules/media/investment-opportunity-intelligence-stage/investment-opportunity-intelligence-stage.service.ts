import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class InvestmentOpportunityIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Investment Opportunity Intelligence', 'investment-opportunity-intelligence');
  }
}
