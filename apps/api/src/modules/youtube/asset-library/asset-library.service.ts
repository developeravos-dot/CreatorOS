import { Injectable } from '@nestjs/common';

import {
  ContentProductionEngineBase,
} from '../content-production-core/content-production-engine.base';

@Injectable()
export class AssetLibraryService extends ContentProductionEngineBase {
  constructor() {
    super('CreatorOS YouTube Asset Library Engine');
  }
}
