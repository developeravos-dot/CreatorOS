import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class PremiumContentIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Premium Content Intelligence', 'premium-content-intelligence');
  }
}
