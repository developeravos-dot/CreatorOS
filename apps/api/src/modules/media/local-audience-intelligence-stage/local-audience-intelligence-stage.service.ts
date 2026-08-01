import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class LocalAudienceIntelligenceStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Local Audience Intelligence Stage',
      'local-audience-intelligence',
    );
  }
}
