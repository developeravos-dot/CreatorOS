import { Injectable } from '@nestjs/common';

import {
  MediaGovernanceEngineBase,
} from '../media-governance-core/media-governance-engine.base';

@Injectable()
export class ContentTrustSafetyEngineService extends MediaGovernanceEngineBase {
  constructor() {
    super('AVOS Media Content Trust and Safety Engine');
  }
}
