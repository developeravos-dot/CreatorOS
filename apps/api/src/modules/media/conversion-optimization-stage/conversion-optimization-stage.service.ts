import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class ConversionOptimizationStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Conversion Optimization', 'conversion-optimization');
  }
}
