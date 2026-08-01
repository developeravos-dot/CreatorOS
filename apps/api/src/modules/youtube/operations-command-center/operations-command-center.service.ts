import { Injectable } from '@nestjs/common';

import {
  AutomationOrchestrationEngineBase,
} from '../automation-orchestration-core/automation-orchestration-engine.base';

@Injectable()
export class OperationsCommandCenterService extends AutomationOrchestrationEngineBase {
  constructor() {
    super('CreatorOS YouTube Operations Command Center');
  }
}
