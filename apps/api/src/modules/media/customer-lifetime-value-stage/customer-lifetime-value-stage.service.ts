import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class CustomerLifetimeValueStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Customer Lifetime Value', 'customer-lifetime-value');
  }
}
