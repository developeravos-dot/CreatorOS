import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class AdvertisingExpansionStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Advertising Expansion Stage',
      'advertising-expansion',
    );
  }
}
