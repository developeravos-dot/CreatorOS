import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class AdvertisingRevenueIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Advertising Revenue Intelligence', 'advertising-revenue-intelligence');
  }
}
