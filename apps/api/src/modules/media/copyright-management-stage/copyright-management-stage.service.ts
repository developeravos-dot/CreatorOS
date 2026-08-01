import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class CopyrightManagementStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Copyright Management',
      'copyright-management',
    );
  }
}
