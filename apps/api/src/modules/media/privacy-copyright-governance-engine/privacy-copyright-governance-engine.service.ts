import { Injectable } from '@nestjs/common';

import {
  MediaGovernanceEngineBase,
} from '../media-governance-core/media-governance-engine.base';

@Injectable()
export class PrivacyCopyrightGovernanceEngineService extends MediaGovernanceEngineBase {
  constructor() {
    super('AVOS Media Privacy and Copyright Governance Engine');
  }
}
