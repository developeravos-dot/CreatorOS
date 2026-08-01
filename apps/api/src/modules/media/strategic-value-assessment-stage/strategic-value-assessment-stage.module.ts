import { Module } from '@nestjs/common';

import {
  StrategicValueAssessmentStageController,
} from './strategic-value-assessment-stage.controller';

import {
  StrategicValueAssessmentStageService,
} from './strategic-value-assessment-stage.service';

@Module({
  controllers: [
    StrategicValueAssessmentStageController,
  ],
  providers: [
    StrategicValueAssessmentStageService,
  ],
  exports: [
    StrategicValueAssessmentStageService,
  ],
})
export class StrategicValueAssessmentStageModule {}
