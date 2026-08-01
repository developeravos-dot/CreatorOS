import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class PartnerCreatorNetworkStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Partner and Creator Network Stage',
      'partner-creator-network',
    );
  }
}
