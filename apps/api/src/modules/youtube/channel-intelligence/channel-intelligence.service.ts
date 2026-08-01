import { Injectable } from '@nestjs/common';

import {
  IntelligenceEngineBase,
} from '../intelligence-core/intelligence-engine.base';

@Injectable()
export class ChannelIntelligenceService extends IntelligenceEngineBase {
  constructor() {
    super('CreatorOS Channel Intelligence Engine');
  }
}
