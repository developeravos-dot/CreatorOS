import { Module } from '@nestjs/common';

import {
  ContinuousLearningStageController,
} from './continuous-learning-stage.controller';

import {
  ContinuousLearningStageService,
} from './continuous-learning-stage.service';

@Module({
  controllers: [ContinuousLearningStageController],
  providers: [ContinuousLearningStageService],
  exports: [ContinuousLearningStageService],
})
export class ContinuousLearningStageModule {}
