import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class RoyaltyAccountingStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Royalty Accounting', 'royalty-accounting');
  }
}
