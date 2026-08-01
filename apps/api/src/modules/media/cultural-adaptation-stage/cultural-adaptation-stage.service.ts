import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class CulturalAdaptationStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Cultural Adaptation Stage',
      'cultural-adaptation',
    );
  }
}
