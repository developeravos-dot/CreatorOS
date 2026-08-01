import { Injectable } from '@nestjs/common';

import {
  MediaCoreEngineBase,
} from '../media-core/media-core-engine.base';

@Injectable()
export class CreativeAiCouncilService extends MediaCoreEngineBase {
  constructor() {
    super('AVOS Media Creative AI Council');
  }
}
