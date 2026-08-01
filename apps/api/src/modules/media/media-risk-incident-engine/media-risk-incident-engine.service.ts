import { Injectable } from '@nestjs/common';

import {
  MediaGovernanceEngineBase,
} from '../media-governance-core/media-governance-engine.base';

@Injectable()
export class MediaRiskIncidentEngineService extends MediaGovernanceEngineBase {
  constructor() {
    super('AVOS Media Risk and Incident Engine');
  }
}
