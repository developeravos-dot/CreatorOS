import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class RevenueOptimizationStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Revenue Optimization Stage',
      'revenue-optimization',
    );
  }
}
