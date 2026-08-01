import { Injectable } from '@nestjs/common';

import {
  MediaAiOrganizationEngineBase,
} from '../media-ai-organization-core/media-ai-organization-engine.base';

@Injectable()
export class AiOrganizationDecisionEngineService extends MediaAiOrganizationEngineBase {
  constructor() {
    super('AVOS Media AI Organization Decision Engine');
  }
}
