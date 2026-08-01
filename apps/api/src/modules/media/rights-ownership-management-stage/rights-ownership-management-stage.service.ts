import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class RightsOwnershipManagementStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Rights Ownership Management',
      'rights-ownership-management',
    );
  }
}
