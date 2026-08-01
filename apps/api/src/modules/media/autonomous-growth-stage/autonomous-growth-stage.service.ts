import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class AutonomousGrowthStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Autonomous Growth', 'autonomous-growth');
  }
}
