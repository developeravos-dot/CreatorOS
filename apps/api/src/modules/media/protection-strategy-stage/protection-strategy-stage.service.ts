import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class ProtectionStrategyStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Protection Strategy',
      'protection-strategy',
    );
  }
}
