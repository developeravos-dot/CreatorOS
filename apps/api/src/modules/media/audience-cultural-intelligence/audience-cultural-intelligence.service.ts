import { Injectable } from '@nestjs/common';

import {
  MediaDevelopmentEngineBase,
} from '../media-development-core/media-development-engine.base';

@Injectable()
export class AudienceCulturalIntelligenceService extends MediaDevelopmentEngineBase {
  constructor() {
    super('AVOS Media Audience and Cultural Intelligence Engine');
  }
}
