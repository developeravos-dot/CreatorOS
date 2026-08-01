import { Injectable } from '@nestjs/common';

import {
  MediaGovernanceEngineBase,
} from '../media-governance-core/media-governance-engine.base';

@Injectable()
export class PolicyLegalComplianceEngineService extends MediaGovernanceEngineBase {
  constructor() {
    super('AVOS Media Policy and Legal Compliance Engine');
  }
}
