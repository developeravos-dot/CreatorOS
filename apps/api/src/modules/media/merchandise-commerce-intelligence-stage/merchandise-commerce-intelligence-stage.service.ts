import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class MerchandiseCommerceIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Merchandise Commerce Intelligence', 'merchandise-commerce-intelligence');
  }
}
