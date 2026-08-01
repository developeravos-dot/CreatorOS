import { Injectable } from '@nestjs/common';

import {
  OperationsEngineBase,
} from '../operations-core/operations-engine.base';

@Injectable()
export class ContentCalendarService extends OperationsEngineBase {
  constructor() {
    super('CreatorOS YouTube Content Calendar Engine');
  }
}
