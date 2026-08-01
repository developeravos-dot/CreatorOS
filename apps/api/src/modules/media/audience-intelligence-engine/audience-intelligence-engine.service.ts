import { Injectable } from '@nestjs/common';

import {
  MediaIntelligenceEngineBase,
} from '../media-intelligence-core/media-intelligence-engine.base';

@Injectable()
export class AudienceIntelligenceEngineService extends MediaIntelligenceEngineBase {
  constructor() {
    super('AVOS Media Audience Intelligence Engine');
  }
}
