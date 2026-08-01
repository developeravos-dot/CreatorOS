import { Injectable } from '@nestjs/common';

import {
  GlobalExpansionEngineBase,
} from '../global-expansion-core/global-expansion-engine.base';

@Injectable()
export class LocalizationIntelligenceService extends GlobalExpansionEngineBase {
  constructor() {
    super('CreatorOS YouTube Localization Intelligence Engine');
  }
}
