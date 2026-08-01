import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class ProtectabilityAnalysisStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Protectability Analysis',
      'protectability-analysis',
    );
  }
}
