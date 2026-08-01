import { Injectable } from '@nestjs/common';

import {
  MediaAutonomousLifecycleEngineBase,
} from '../media-autonomous-lifecycle-core/media-autonomous-lifecycle-engine.base';

@Injectable()
export class ContinuousLearningStageService extends MediaAutonomousLifecycleEngineBase {
  constructor() {
    super(
      'AVOS Media Continuous Learning Stage',
      'continuous-learning',
    );
  }
}
