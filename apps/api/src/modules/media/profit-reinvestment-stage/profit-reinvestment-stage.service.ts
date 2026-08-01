import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class ProfitReinvestmentStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Profit Reinvestment', 'profit-reinvestment');
  }
}
