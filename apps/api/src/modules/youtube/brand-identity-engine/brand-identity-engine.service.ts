import { Injectable } from '@nestjs/common';

import {
  BrandIpEngineBase,
} from '../brand-ip-core/brand-ip-engine.base';

@Injectable()
export class BrandIdentityEngineService extends BrandIpEngineBase {
  constructor() {
    super('CreatorOS YouTube Brand Identity Engine');
  }
}
