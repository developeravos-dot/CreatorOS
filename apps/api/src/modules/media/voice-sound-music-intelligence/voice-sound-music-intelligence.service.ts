import { Injectable } from '@nestjs/common';

import {
  MediaProductionEngineBase,
} from '../media-production-core/media-production-engine.base';

@Injectable()
export class VoiceSoundMusicIntelligenceService extends MediaProductionEngineBase {
  constructor() {
    super('AVOS Media Voice Sound and Music Intelligence Engine');
  }
}
