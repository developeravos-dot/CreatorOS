import { Injectable } from '@nestjs/common';

import {
  IntelligenceEngineBase,
} from '../intelligence-core/intelligence-engine.base';

@Injectable()
export class ContentIntelligenceService extends IntelligenceEngineBase {
  constructor() {
    super('CreatorOS Content Intelligence Engine');
  }
}
