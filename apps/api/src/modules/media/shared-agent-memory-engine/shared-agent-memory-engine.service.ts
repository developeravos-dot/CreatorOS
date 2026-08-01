import { Injectable } from '@nestjs/common';

import {
  MediaAiOrganizationEngineBase,
} from '../media-ai-organization-core/media-ai-organization-engine.base';

@Injectable()
export class SharedAgentMemoryEngineService extends MediaAiOrganizationEngineBase {
  constructor() {
    super('AVOS Media Shared Agent Memory Engine');
  }
}
