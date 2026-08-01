import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class ContentInvestmentEngineStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Content Investment Engine', 'content-investment-engine');
  }
}
