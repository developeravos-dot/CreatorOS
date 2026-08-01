import { Injectable } from '@nestjs/common';

import {
  MediaAutonomousLifecycleEngineBase,
} from '../media-autonomous-lifecycle-core/media-autonomous-lifecycle-engine.base';

@Injectable()
export class GrowthOptimizationStageService extends MediaAutonomousLifecycleEngineBase {
  constructor() {
    super(
      'AVOS Media Growth Optimization Stage',
      'growth-optimization',
    );
  }
}
