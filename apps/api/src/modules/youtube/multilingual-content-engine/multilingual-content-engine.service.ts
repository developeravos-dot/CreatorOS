import { Injectable } from '@nestjs/common';

import {
  GlobalExpansionEngineBase,
} from '../global-expansion-core/global-expansion-engine.base';

@Injectable()
export class MultilingualContentEngineService extends GlobalExpansionEngineBase {
  constructor() {
    super('CreatorOS YouTube Multilingual Content Engine');
  }
}
