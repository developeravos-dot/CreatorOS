import { Injectable } from '@nestjs/common';

import {
  GrowthManagementEngineBase,
} from '../growth-management-core/growth-management-engine.base';

@Injectable()
export class ReportingEngineService extends GrowthManagementEngineBase {
  constructor() {
    super('CreatorOS YouTube Reporting Engine');
  }
}
