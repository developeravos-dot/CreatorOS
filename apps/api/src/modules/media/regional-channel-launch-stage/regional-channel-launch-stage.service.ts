import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class RegionalChannelLaunchStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Regional Channel Launch Stage',
      'regional-channel-launch',
    );
  }
}
