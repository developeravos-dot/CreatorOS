import { Injectable } from '@nestjs/common';

import {
  BrandIpEngineBase,
} from '../brand-ip-core/brand-ip-engine.base';

@Injectable()
export class LicensingIntelligenceService extends BrandIpEngineBase {
  constructor() {
    super('CreatorOS YouTube Licensing Intelligence Engine');
  }
}
