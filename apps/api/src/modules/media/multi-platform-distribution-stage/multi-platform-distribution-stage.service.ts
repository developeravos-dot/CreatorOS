import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class MultiPlatformDistributionStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Multi Platform Distribution Stage',
      'multi-platform-distribution',
    );
  }
}
