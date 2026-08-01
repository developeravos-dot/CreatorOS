import { Module } from '@nestjs/common';
import { AutonomousLearningStageController } from './autonomous-learning-stage.controller';
import { AutonomousLearningStageService } from './autonomous-learning-stage.service';

@Module({
  controllers: [AutonomousLearningStageController],
  providers: [AutonomousLearningStageService],
  exports: [AutonomousLearningStageService],
})
export class AutonomousLearningStageModule {}
