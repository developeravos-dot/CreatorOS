import { Injectable } from '@nestjs/common';

import {
  OperationsEngineBase,
} from '../operations-core/operations-engine.base';

@Injectable()
export class CompetitorIntelligenceService extends OperationsEngineBase {
  constructor() {
    super('CreatorOS YouTube Competitor Intelligence Engine');
  }
}
