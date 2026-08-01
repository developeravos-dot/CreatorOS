import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class RevenueStreamDesignStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Revenue Stream Design', 'revenue-stream-design');
  }
}
