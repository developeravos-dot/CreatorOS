import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class MarketplaceIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Marketplace Intelligence', 'marketplace-intelligence');
  }
}
