import { Module } from '@nestjs/common';

import {
  PredictivePerformanceEngineController,
} from './predictive-performance-engine.controller';

import {
  PredictivePerformanceEngineService,
} from './predictive-performance-engine.service';

@Module({
  controllers: [PredictivePerformanceEngineController],
  providers: [PredictivePerformanceEngineService],
  exports: [PredictivePerformanceEngineService],
})
export class PredictivePerformanceEngineModule {}
