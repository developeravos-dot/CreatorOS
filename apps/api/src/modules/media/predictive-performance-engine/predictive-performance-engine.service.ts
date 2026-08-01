import { Injectable } from '@nestjs/common';

import {
  MediaIntelligenceEngineBase,
} from '../media-intelligence-core/media-intelligence-engine.base';

@Injectable()
export class PredictivePerformanceEngineService extends MediaIntelligenceEngineBase {
  constructor() {
    super('AVOS Media Predictive Performance Engine');
  }
}
