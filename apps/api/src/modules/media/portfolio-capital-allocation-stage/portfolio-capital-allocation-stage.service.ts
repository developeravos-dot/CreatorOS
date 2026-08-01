import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class PortfolioCapitalAllocationStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Portfolio Capital Allocation', 'portfolio-capital-allocation');
  }
}
