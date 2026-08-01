import { Injectable } from '@nestjs/common';

import {
  MediaProductionEngineBase,
} from '../media-production-core/media-production-engine.base';

@Injectable()
export class StoryboardShotIntelligenceService extends MediaProductionEngineBase {
  constructor() {
    super('AVOS Media Storyboard and Shot Intelligence Engine');
  }
}
