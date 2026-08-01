import { Injectable } from '@nestjs/common';

import {
  AudienceCommunityEngineBase,
} from '../audience-community-core/audience-community-engine.base';

@Injectable()
export class CommunityManagerService extends AudienceCommunityEngineBase {
  constructor() {
    super('CreatorOS YouTube Community Manager');
  }
}
