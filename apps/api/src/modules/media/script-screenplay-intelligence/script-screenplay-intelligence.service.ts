import { Injectable } from '@nestjs/common';

import {
  MediaProductionEngineBase,
} from '../media-production-core/media-production-engine.base';

@Injectable()
export class ScriptScreenplayIntelligenceService extends MediaProductionEngineBase {
  constructor() {
    super('AVOS Media Script and Screenplay Intelligence Engine');
  }
}
