import { Module } from '@nestjs/common';
import { EngagementOptimizationStageController } from './engagement-optimization-stage.controller';
import { EngagementOptimizationStageService } from './engagement-optimization-stage.service';

@Module({
  controllers: [EngagementOptimizationStageController],
  providers: [EngagementOptimizationStageService],
  exports: [EngagementOptimizationStageService],
})
export class EngagementOptimizationStageModule {}
