import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class FinancialPlanningStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Financial Planning', 'financial-planning');
  }
}
