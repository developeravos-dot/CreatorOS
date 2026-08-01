import { Injectable } from '@nestjs/common';

import {
  MediaIntelligenceEngineBase,
} from '../media-intelligence-core/media-intelligence-engine.base';

@Injectable()
export class UnifiedMediaAnalyticsEngineService extends MediaIntelligenceEngineBase {
  constructor() {
    super('AVOS Media Unified Analytics Engine');
  }
}
