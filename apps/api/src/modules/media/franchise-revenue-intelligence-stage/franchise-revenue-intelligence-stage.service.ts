import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class FranchiseRevenueIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Franchise Revenue Intelligence', 'franchise-revenue-intelligence');
  }
}
