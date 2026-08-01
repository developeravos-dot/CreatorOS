import { Injectable } from '@nestjs/common';

import {
  MediaAiOrganizationEngineBase,
} from '../media-ai-organization-core/media-ai-organization-engine.base';

@Injectable()
export class AgentTeamOrchestrationEngineService extends MediaAiOrganizationEngineBase {
  constructor() {
    super('AVOS Media Agent Team Orchestration Engine');
  }
}
