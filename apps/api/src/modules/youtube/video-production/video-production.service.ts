import { Injectable } from '@nestjs/common';

import {
  ContentProductionEngineBase,
} from '../content-production-core/content-production-engine.base';

@Injectable()
export class VideoProductionService extends ContentProductionEngineBase {
  constructor() {
    super('CreatorOS YouTube Video Production Engine');
  }
}
