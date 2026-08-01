import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class GlobalRiskGovernanceStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Global Risk Governance Stage',
      'global-risk-governance',
    );
  }
}
