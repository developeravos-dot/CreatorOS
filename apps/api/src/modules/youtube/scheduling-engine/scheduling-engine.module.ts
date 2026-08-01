import { Module } from '@nestjs/common';

import {
  SchedulingEngineController,
} from './scheduling-engine.controller';

import {
  SchedulingEngineService,
} from './scheduling-engine.service';

@Module({
  controllers: [SchedulingEngineController],
  providers: [SchedulingEngineService],
  exports: [SchedulingEngineService],
})
export class SchedulingEngineModule {}
