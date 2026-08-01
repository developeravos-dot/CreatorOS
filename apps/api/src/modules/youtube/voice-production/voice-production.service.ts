import { Injectable } from '@nestjs/common';

import {
  ContentProductionEngineBase,
} from '../content-production-core/content-production-engine.base';

@Injectable()
export class VoiceProductionService extends ContentProductionEngineBase {
  constructor() {
    super('CreatorOS YouTube Voice Production Engine');
  }
}
