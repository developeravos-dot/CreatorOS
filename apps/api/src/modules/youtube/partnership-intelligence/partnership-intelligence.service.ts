import { Injectable } from '@nestjs/common';

import {
  BrandIpEngineBase,
} from '../brand-ip-core/brand-ip-engine.base';

@Injectable()
export class PartnershipIntelligenceService extends BrandIpEngineBase {
  constructor() {
    super('CreatorOS YouTube Partnership Intelligence Engine');
  }
}
