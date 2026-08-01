import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class TrademarkManagementStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Trademark Management',
      'trademark-management',
    );
  }
}
