import { Injectable } from '@nestjs/common';

import {
  MediaIntelligenceEngineBase,
} from '../media-intelligence-core/media-intelligence-engine.base';

@Injectable()
export class ExecutiveDecisionIntelligenceEngineService extends MediaIntelligenceEngineBase {
  constructor() {
    super('AVOS Media Executive Decision Intelligence Engine');
  }
}
