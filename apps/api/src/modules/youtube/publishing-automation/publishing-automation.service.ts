import { Injectable } from '@nestjs/common';

import {
  AutomationOrchestrationEngineBase,
} from '../automation-orchestration-core/automation-orchestration-engine.base';

@Injectable()
export class PublishingAutomationService extends AutomationOrchestrationEngineBase {
  constructor() {
    super('CreatorOS YouTube Publishing Automation Engine');
  }
}
