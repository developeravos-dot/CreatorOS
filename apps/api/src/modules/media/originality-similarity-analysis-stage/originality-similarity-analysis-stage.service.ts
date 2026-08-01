import { Injectable } from '@nestjs/common';

import {
  MediaIpEmpireEngineBase,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

@Injectable()
export class OriginalitySimilarityAnalysisStageService extends MediaIpEmpireEngineBase {
  constructor() {
    super(
      'AVOS Media Originality Similarity Analysis',
      'originality-similarity-analysis',
    );
  }
}
