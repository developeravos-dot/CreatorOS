import { Injectable } from '@nestjs/common';

import {
  BrandIpEngineBase,
} from '../brand-ip-core/brand-ip-engine.base';

@Injectable()
export class ContentIpBuilderService extends BrandIpEngineBase {
  constructor() {
    super('CreatorOS YouTube Content IP Builder');
  }
}
