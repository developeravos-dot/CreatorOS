import { Injectable } from '@nestjs/common';

import {
  MediaDevelopmentEngineBase,
} from '../media-development-core/media-development-engine.base';

@Injectable()
export class ContentConceptLabService extends MediaDevelopmentEngineBase {
  constructor() {
    super('AVOS Media Content Concept Lab');
  }
}
