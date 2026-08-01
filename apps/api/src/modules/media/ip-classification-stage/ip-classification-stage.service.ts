import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class IpClassificationStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media IP Classification',
      'ip-classification',
    );
  }
}
