import { Injectable } from '@nestjs/common';

import {
  MediaAutonomousLifecycleEngineBase,
} from '../media-autonomous-lifecycle-core/media-autonomous-lifecycle-engine.base';

@Injectable()
export class ContentCreationStageService extends MediaAutonomousLifecycleEngineBase {
  constructor() {
    super(
      'AVOS Media Content Creation Stage',
      'content-creation',
    );
  }
}
