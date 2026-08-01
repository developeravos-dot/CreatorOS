import { Injectable } from '@nestjs/common';

import {
  MediaIpFranchiseEngineBase,
} from '../media-ip-franchise-core/media-ip-franchise-engine.base';

@Injectable()
export class FranchiseExpansionEngineService extends MediaIpFranchiseEngineBase {
  constructor() {
    super('AVOS Media Franchise Expansion Engine');
  }
}
