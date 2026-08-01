import { Injectable } from '@nestjs/common';

import {
  MediaCoreEngineBase,
} from '../media-core/media-core-engine.base';

@Injectable()
export class CreativeProductionIntelligenceService extends MediaCoreEngineBase {
  constructor() {
    super('AVOS Media Creative Production Intelligence Engine');
  }
}
