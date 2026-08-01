import { Injectable } from '@nestjs/common';

import {
  GrowthManagementEngineBase,
} from '../growth-management-core/growth-management-engine.base';

@Injectable()
export class GrowthIntelligenceService extends GrowthManagementEngineBase {
  constructor() {
    super('CreatorOS YouTube Growth Intelligence Engine');
  }
}
