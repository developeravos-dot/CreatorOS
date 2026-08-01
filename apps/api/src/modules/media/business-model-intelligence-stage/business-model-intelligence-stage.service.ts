import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class BusinessModelIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Business Model Intelligence', 'business-model-intelligence');
  }
}
