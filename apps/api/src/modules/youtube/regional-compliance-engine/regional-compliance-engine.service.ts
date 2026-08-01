import { Injectable } from '@nestjs/common';

import {
  GlobalExpansionEngineBase,
} from '../global-expansion-core/global-expansion-engine.base';

@Injectable()
export class RegionalComplianceEngineService extends GlobalExpansionEngineBase {
  constructor() {
    super('CreatorOS YouTube Regional Compliance Engine');
  }
}
