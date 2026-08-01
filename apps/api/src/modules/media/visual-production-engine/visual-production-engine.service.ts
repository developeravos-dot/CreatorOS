import { Injectable } from '@nestjs/common';

import {
  MediaProductionEngineBase,
} from '../media-production-core/media-production-engine.base';

@Injectable()
export class VisualProductionEngineService extends MediaProductionEngineBase {
  constructor() {
    super('AVOS Media Visual Production Engine');
  }
}
