import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class IpDigitalDnaStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media IP Digital DNA',
      'ip-digital-dna',
    );
  }
}
