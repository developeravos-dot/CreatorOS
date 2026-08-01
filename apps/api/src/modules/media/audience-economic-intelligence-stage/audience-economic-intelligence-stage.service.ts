import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class AudienceEconomicIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Audience Economic Intelligence', 'audience-economic-intelligence');
  }
}
