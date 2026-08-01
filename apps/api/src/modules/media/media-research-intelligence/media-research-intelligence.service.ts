import { Injectable } from '@nestjs/common';

import {
  MediaDevelopmentEngineBase,
} from '../media-development-core/media-development-engine.base';

@Injectable()
export class MediaResearchIntelligenceService extends MediaDevelopmentEngineBase {
  constructor() {
    super('AVOS Media Research Intelligence Engine');
  }
}
