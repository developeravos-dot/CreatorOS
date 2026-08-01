import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class PricingIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Pricing Intelligence', 'pricing-intelligence');
  }
}
