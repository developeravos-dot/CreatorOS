import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class IpFamilyTreeStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media IP Family Tree',
      'ip-family-tree',
    );
  }
}
