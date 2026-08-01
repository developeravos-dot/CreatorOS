import { Module } from '@nestjs/common';

import {
  RevenueOptimizationStageController,
} from './revenue-optimization-stage.controller';

import {
  RevenueOptimizationStageService,
} from './revenue-optimization-stage.service';

@Module({
  controllers: [RevenueOptimizationStageController],
  providers: [RevenueOptimizationStageService],
  exports: [RevenueOptimizationStageService],
})
export class RevenueOptimizationStageModule {}
