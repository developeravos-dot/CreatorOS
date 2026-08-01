import { Module } from '@nestjs/common';
import { CreativeLearningStageController } from './creative-learning-stage.controller';
import { CreativeLearningStageService } from './creative-learning-stage.service';

@Module({
  controllers: [CreativeLearningStageController],
  providers: [CreativeLearningStageService],
  exports: [CreativeLearningStageService],
})
export class CreativeLearningStageModule {}
