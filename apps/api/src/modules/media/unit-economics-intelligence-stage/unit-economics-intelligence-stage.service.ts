import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class UnitEconomicsIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Unit Economics Intelligence', 'unit-economics-intelligence');
  }
}
