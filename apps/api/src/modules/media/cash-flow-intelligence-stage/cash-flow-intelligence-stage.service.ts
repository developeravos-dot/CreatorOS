import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class CashFlowIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Cash Flow Intelligence', 'cash-flow-intelligence');
  }
}
