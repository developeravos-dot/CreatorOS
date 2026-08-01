import { Module } from '@nestjs/common';

import {
  OriginalitySimilarityAnalysisStageController,
} from './originality-similarity-analysis-stage.controller';

import {
  OriginalitySimilarityAnalysisStageService,
} from './originality-similarity-analysis-stage.service';

@Module({
  controllers: [
    OriginalitySimilarityAnalysisStageController,
  ],
  providers: [
    OriginalitySimilarityAnalysisStageService,
  ],
  exports: [
    OriginalitySimilarityAnalysisStageService,
  ],
})
export class OriginalitySimilarityAnalysisStageModule {}
