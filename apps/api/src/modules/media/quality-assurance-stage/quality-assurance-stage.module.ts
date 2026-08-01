import { Module } from '@nestjs/common';

import {
  QualityAssuranceStageController,
} from './quality-assurance-stage.controller';

import {
  QualityAssuranceStageService,
} from './quality-assurance-stage.service';

@Module({
  controllers: [QualityAssuranceStageController],
  providers: [QualityAssuranceStageService],
  exports: [QualityAssuranceStageService],
})
export class QualityAssuranceStageModule {}
