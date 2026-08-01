import { Injectable } from '@nestjs/common';

import {
  AutomationOrchestrationEngineBase,
} from '../automation-orchestration-core/automation-orchestration-engine.base';

@Injectable()
export class QualityControlEngineService extends AutomationOrchestrationEngineBase {
  constructor() {
    super('CreatorOS YouTube Quality Control Engine');
  }
}
