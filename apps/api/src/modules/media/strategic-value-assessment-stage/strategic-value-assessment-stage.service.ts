import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class StrategicValueAssessmentStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Strategic Value Assessment',
      'strategic-value-assessment',
    );
  }
}
