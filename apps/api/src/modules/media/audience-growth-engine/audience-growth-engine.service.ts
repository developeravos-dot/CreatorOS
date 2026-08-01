import { Injectable } from '@nestjs/common';

import {
  MediaPublishingGrowthEngineBase,
} from '../media-publishing-growth-core/media-publishing-growth-engine.base';

@Injectable()
export class AudienceGrowthEngineService extends MediaPublishingGrowthEngineBase {
  constructor() {
    super('AVOS Media Audience Growth Engine');
  }
}
