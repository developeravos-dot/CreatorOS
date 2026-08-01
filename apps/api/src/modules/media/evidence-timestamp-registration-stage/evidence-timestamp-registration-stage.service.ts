import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class EvidenceTimestampRegistrationStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Evidence Timestamp Registration',
      'evidence-timestamp-registration',
    );
  }
}
