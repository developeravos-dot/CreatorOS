import { Injectable } from '@nestjs/common';

import {
  MediaPublishingGrowthEngineBase,
} from '../media-publishing-growth-core/media-publishing-growth-engine.base';

@Injectable()
export class PublishingOrchestrationEngineService extends MediaPublishingGrowthEngineBase {
  constructor() {
    super('AVOS Media Publishing Orchestration Engine');
  }
}
