import { Injectable } from '@nestjs/common';

import {
  MediaCoreEngineBase,
} from '../media-core/media-core-engine.base';

@Injectable()
export class MediaEcosystemService extends MediaCoreEngineBase {
  constructor() {
    super('AVOS Media Ecosystem');
  }
}
