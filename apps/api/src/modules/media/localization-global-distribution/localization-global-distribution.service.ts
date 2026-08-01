import { Injectable } from '@nestjs/common';

import {
  MediaPublishingGrowthEngineBase,
} from '../media-publishing-growth-core/media-publishing-growth-engine.base';

@Injectable()
export class LocalizationGlobalDistributionService extends MediaPublishingGrowthEngineBase {
  constructor() {
    super('AVOS Media Localization and Global Distribution Engine');
  }
}
