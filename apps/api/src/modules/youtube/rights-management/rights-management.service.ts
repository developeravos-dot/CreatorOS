import { Injectable } from '@nestjs/common';

import {
  BrandIpEngineBase,
} from '../brand-ip-core/brand-ip-engine.base';

@Injectable()
export class RightsManagementService extends BrandIpEngineBase {
  constructor() {
    super('CreatorOS YouTube Rights Management Engine');
  }
}
