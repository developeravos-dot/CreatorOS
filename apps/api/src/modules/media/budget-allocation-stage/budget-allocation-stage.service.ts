import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class BudgetAllocationStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Budget Allocation', 'budget-allocation');
  }
}
