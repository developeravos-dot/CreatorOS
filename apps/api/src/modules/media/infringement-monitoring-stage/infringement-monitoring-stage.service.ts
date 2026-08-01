import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class InfringementMonitoringStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Infringement Monitoring',
      'infringement-monitoring',
    );
  }
}
