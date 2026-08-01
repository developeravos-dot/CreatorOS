import { Module } from '@nestjs/common';

import {
  ProtectabilityAnalysisStageController,
} from './protectability-analysis-stage.controller';

import {
  ProtectabilityAnalysisStageService,
} from './protectability-analysis-stage.service';

@Module({
  controllers: [
    ProtectabilityAnalysisStageController,
  ],
  providers: [
    ProtectabilityAnalysisStageService,
  ],
  exports: [
    ProtectabilityAnalysisStageService,
  ],
})
export class ProtectabilityAnalysisStageModule {}
