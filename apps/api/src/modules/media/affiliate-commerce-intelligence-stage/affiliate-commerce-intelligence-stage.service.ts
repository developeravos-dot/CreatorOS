import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class AffiliateCommerceIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Affiliate Commerce Intelligence', 'affiliate-commerce-intelligence');
  }
}
