import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class FranchiseManagementStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Franchise Management',
      'franchise-management',
    );
  }
}
