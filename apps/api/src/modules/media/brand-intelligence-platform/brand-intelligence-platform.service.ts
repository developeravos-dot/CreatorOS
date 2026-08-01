import { Injectable } from '@nestjs/common';

import {
  MediaCoreEngineBase,
} from '../media-core/media-core-engine.base';

@Injectable()
export class BrandIntelligencePlatformService extends MediaCoreEngineBase {
  constructor() {
    super('AVOS Brand Intelligence Platform');
  }
}
