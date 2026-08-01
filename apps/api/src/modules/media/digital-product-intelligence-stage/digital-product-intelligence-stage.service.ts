import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class DigitalProductIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Digital Product Intelligence', 'digital-product-intelligence');
  }
}
