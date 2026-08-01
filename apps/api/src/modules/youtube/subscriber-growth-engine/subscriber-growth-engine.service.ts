import { Injectable } from '@nestjs/common';

import {
  AudienceCommunityEngineBase,
} from '../audience-community-core/audience-community-engine.base';

@Injectable()
export class SubscriberGrowthEngineService extends AudienceCommunityEngineBase {
  constructor() {
    super('CreatorOS YouTube Subscriber Growth Engine');
  }
}
