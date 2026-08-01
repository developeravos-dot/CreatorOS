import { Injectable } from '@nestjs/common';

import {
  MediaCoreEngineBase,
} from '../media-core/media-core-engine.base';

@Injectable()
export class BrandIdentityCreativeStudioService extends MediaCoreEngineBase {
  constructor() {
    super('AVOS Brand Identity and Creative Studio');
  }
}
