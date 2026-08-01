import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class IpAssetDiscoveryStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media IP Asset Discovery',
      'ip-asset-discovery',
    );
  }
}
