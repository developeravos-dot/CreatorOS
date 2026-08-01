import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class CommerceProductExpansionStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Commerce and Product Expansion Stage',
      'commerce-product-expansion',
    );
  }
}
