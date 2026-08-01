import { Injectable } from '@nestjs/common';

import {
  AudienceCommunityEngineBase,
} from '../audience-community-core/audience-community-engine.base';

@Injectable()
export class AudienceIntelligenceService extends AudienceCommunityEngineBase {
  constructor() {
    super('CreatorOS YouTube Audience Intelligence Engine');
  }
}
