import { Injectable } from '@nestjs/common';

import {
  MediaProductionEngineBase,
} from '../media-production-core/media-production-engine.base';

@Injectable()
export class EditingVfxQualityEngineService extends MediaProductionEngineBase {
  constructor() {
    super('AVOS Media Editing VFX and Quality Engine');
  }
}
