import { Injectable } from '@nestjs/common';

import {
  OperationsEngineBase,
} from '../operations-core/operations-engine.base';

@Injectable()
export class PerformanceAnalyticsService extends OperationsEngineBase {
  constructor() {
    super('CreatorOS YouTube Performance Analytics Engine');
  }
}
