import { Injectable } from '@nestjs/common';

import {
  MediaIpFranchiseEngineBase,
} from '../media-ip-franchise-core/media-ip-franchise-engine.base';

@Injectable()
export class IpDigitalDnaEngineService extends MediaIpFranchiseEngineBase {
  constructor() {
    super('AVOS Media IP Digital DNA Engine');
  }
}
