import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class PaymentCollectionIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Payment Collection Intelligence', 'payment-collection-intelligence');
  }
}
