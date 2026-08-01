import { Injectable } from '@nestjs/common';

import {
  MediaAutonomousLifecycleEngineBase,
} from '../media-autonomous-lifecycle-core/media-autonomous-lifecycle-engine.base';

@Injectable()
export class OpportunityDiscoveryStageService extends MediaAutonomousLifecycleEngineBase {
  constructor() {
    super(
      'AVOS Media Opportunity Discovery Stage',
      'opportunity-discovery',
    );
  }
}
