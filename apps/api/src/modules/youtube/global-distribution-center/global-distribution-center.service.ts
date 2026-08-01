import { Injectable } from '@nestjs/common';

import {
  GlobalExpansionEngineBase,
} from '../global-expansion-core/global-expansion-engine.base';

@Injectable()
export class GlobalDistributionCenterService extends GlobalExpansionEngineBase {
  constructor() {
    super('CreatorOS YouTube Global Distribution Center');
  }
}
