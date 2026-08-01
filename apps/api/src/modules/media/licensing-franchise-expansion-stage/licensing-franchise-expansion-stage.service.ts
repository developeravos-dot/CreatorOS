import { Injectable } from '@nestjs/common';

import {
  MediaGlobalExpansionEngineBase,
} from '../media-global-expansion-core/media-global-expansion-engine.base';

@Injectable()
export class LicensingFranchiseExpansionStageService extends MediaGlobalExpansionEngineBase {
  constructor() {
    super(
      'AVOS Media Licensing and Franchise Expansion Stage',
      'licensing-franchise-expansion',
    );
  }
}
