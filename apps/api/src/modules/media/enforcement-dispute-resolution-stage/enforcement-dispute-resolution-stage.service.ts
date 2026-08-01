import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class EnforcementDisputeResolutionStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Enforcement Dispute Resolution',
      'enforcement-dispute-resolution',
    );
  }
}
