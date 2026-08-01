import { Injectable } from '@nestjs/common';

import {
  MediaGovernanceEngineBase,
} from '../media-governance-core/media-governance-engine.base';

@Injectable()
export class GovernanceAuditAuthorityEngineService extends MediaGovernanceEngineBase {
  constructor() {
    super('AVOS Media Governance Audit and Human Authority Engine');
  }
}
