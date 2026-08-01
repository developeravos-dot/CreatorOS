import { Injectable } from '@nestjs/common';

import {
  AutomationOrchestrationEngineBase,
} from '../automation-orchestration-core/automation-orchestration-engine.base';

@Injectable()
export class AgentCoordinationService extends AutomationOrchestrationEngineBase {
  constructor() {
    super('CreatorOS YouTube Agent Coordination Engine');
  }
}
