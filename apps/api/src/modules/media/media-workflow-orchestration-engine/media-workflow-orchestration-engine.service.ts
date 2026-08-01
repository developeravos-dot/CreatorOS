import { Injectable } from '@nestjs/common';

import {
  MediaAiOrganizationEngineBase,
} from '../media-ai-organization-core/media-ai-organization-engine.base';

@Injectable()
export class MediaWorkflowOrchestrationEngineService extends MediaAiOrganizationEngineBase {
  constructor() {
    super('AVOS Media Workflow Orchestration Engine');
  }
}
