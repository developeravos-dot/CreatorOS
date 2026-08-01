import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class TranslationLocalizationStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Translation and Localization Stage',
      'translation-localization',
    );
  }
}
