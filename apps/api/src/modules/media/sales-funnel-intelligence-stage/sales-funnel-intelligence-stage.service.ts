import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class SalesFunnelIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Sales Funnel Intelligence', 'sales-funnel-intelligence');
  }
}
