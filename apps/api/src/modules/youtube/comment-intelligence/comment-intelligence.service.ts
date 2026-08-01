import { Injectable } from '@nestjs/common';

import {
  AudienceCommunityEngineBase,
} from '../audience-community-core/audience-community-engine.base';

@Injectable()
export class CommentIntelligenceService extends AudienceCommunityEngineBase {
  constructor() {
    super('CreatorOS YouTube Comment Intelligence Engine');
  }
}
