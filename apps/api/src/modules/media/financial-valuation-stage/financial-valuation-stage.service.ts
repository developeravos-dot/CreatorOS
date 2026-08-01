import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class FinancialValuationStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Financial Valuation',
      'financial-valuation',
    );
  }
}
