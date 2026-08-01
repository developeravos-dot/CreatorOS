import { Injectable } from '@nestjs/common';

import {
  MediaDevelopmentEngineBase,
} from '../media-development-core/media-development-engine.base';

@Injectable()
export class StoryFormatIntelligenceService extends MediaDevelopmentEngineBase {
  constructor() {
    super('AVOS Media Story and Format Intelligence Engine');
  }
}
