import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class LicensingRevenueIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Licensing Revenue Intelligence', 'licensing-revenue-intelligence');
  }
}
