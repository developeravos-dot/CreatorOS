import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class PatentManagementStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Patent Management',
      'patent-management',
    );
  }
}
