import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class RiskReturnIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Risk Return Intelligence', 'risk-return-intelligence');
  }
}
