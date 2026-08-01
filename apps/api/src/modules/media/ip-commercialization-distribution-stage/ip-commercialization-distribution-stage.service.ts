import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class IpCommercializationDistributionStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media IP Commercialization Distribution',
      'ip-commercialization-distribution',
    );
  }
}
