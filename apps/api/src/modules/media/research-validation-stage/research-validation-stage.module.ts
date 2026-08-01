import { Module } from '@nestjs/common';

import {
  ResearchValidationStageController,
} from './research-validation-stage.controller';

import {
  ResearchValidationStageService,
} from './research-validation-stage.service';

@Module({
  controllers: [ResearchValidationStageController],
  providers: [ResearchValidationStageService],
  exports: [ResearchValidationStageService],
})
export class ResearchValidationStageModule {}
