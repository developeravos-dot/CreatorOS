import { Injectable } from '@nestjs/common';

import {
  MediaIpFranchiseEngineBase,
} from '../media-ip-franchise-core/media-ip-franchise-engine.base';

@Injectable()
export class IpRightsLicensingEngineService extends MediaIpFranchiseEngineBase {
  constructor() {
    super('AVOS Media IP Rights and Licensing Engine');
  }
}
