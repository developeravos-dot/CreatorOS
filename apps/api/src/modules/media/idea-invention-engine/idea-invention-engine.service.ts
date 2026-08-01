import { Injectable } from '@nestjs/common';

import {
  MediaDevelopmentEngineBase,
} from '../media-development-core/media-development-engine.base';

@Injectable()
export class IdeaInventionEngineService extends MediaDevelopmentEngineBase {
  constructor() {
    super('AVOS Media Idea Invention Engine');
  }
}
