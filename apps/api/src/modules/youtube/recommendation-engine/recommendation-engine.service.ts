import { Injectable } from '@nestjs/common';

import {
  OperationsEngineBase,
} from '../operations-core/operations-engine.base';

@Injectable()
export class RecommendationEngineService extends OperationsEngineBase {
  constructor() {
    super('CreatorOS YouTube Recommendation Engine');
  }
}
