import { Injectable } from '@nestjs/common';

import {
  IntelligenceEngineBase,
} from '../intelligence-core/intelligence-engine.base';

@Injectable()
export class SeoIntelligenceService extends IntelligenceEngineBase {
  constructor() {
    super('CreatorOS SEO Intelligence Engine');
  }
}
