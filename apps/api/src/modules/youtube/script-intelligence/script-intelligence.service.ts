import { Injectable } from '@nestjs/common';

import {
  ContentProductionEngineBase,
} from '../content-production-core/content-production-engine.base';

@Injectable()
export class ScriptIntelligenceService extends ContentProductionEngineBase {
  constructor() {
    super('CreatorOS YouTube Script Intelligence Engine');
  }
}
