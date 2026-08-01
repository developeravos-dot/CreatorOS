import { Module } from '@nestjs/common';
import { PaceOptimizationStageController } from './pace-optimization-stage.controller';
import { PaceOptimizationStageService } from './pace-optimization-stage.service';

@Module({
  controllers: [PaceOptimizationStageController],
  providers: [PaceOptimizationStageService],
  exports: [PaceOptimizationStageService],
})
export class PaceOptimizationStageModule {}
