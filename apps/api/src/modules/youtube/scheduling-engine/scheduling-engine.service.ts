import { Injectable } from '@nestjs/common';

import {
  OperationsEngineBase,
} from '../operations-core/operations-engine.base';

@Injectable()
export class SchedulingEngineService extends OperationsEngineBase {
  constructor() {
    super('CreatorOS YouTube Scheduling Engine');
  }
}
