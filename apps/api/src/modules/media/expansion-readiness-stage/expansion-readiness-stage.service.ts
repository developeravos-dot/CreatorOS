import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class ExpansionReadinessStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Expansion Readiness Stage',
      'expansion-readiness',
    );
  }
}
