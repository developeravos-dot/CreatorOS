import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class IpProductizationStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media IP Productization',
      'ip-productization',
    );
  }
}
