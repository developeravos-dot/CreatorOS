import { Injectable } from '@nestjs/common';

import {
  MediaPublishingGrowthEngineBase,
} from '../media-publishing-growth-core/media-publishing-growth-engine.base';

@Injectable()
export class MetadataThumbnailOptimizationService extends MediaPublishingGrowthEngineBase {
  constructor() {
    super('AVOS Media Metadata Title and Thumbnail Optimization Engine');
  }
}
