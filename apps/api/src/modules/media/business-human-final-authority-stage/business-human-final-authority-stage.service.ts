import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class BusinessHumanFinalAuthorityStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Business Human Final Authority', 'human-final-authority');
  }
}
