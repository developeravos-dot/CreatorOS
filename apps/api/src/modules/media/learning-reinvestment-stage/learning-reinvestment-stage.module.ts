import { Module } from '@nestjs/common';

import {
  LearningReinvestmentStageController,
} from './learning-reinvestment-stage.controller';

import {
  LearningReinvestmentStageService,
} from './learning-reinvestment-stage.service';

@Module({
  controllers: [
    LearningReinvestmentStageController,
  ],
  providers: [
    LearningReinvestmentStageService,
  ],
  exports: [
    LearningReinvestmentStageService,
  ],
})
export class LearningReinvestmentStageModule {}
