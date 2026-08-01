import { Injectable } from '@nestjs/common';

import {
  MediaAutonomousLifecycleEngineBase,
} from '../media-autonomous-lifecycle-core/media-autonomous-lifecycle-engine.base';

@Injectable()
export class MonetizationIpExpansionStageService extends MediaAutonomousLifecycleEngineBase {
  constructor() {
    super(
      'AVOS Media Monetization and IP Expansion Stage',
      'monetization-ip-expansion',
    );
  }
}
