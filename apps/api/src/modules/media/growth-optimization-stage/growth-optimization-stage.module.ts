import { Module } from '@nestjs/common';

import {
  GrowthOptimizationStageController,
} from './growth-optimization-stage.controller';

import {
  GrowthOptimizationStageService,
} from './growth-optimization-stage.service';

@Module({
  controllers: [GrowthOptimizationStageController],
  providers: [GrowthOptimizationStageService],
  exports: [GrowthOptimizationStageService],
})
export class GrowthOptimizationStageModule {}
