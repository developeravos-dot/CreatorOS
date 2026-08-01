import { Module } from '@nestjs/common';

import {
  StrategicPlanningStageController,
} from './strategic-planning-stage.controller';

import {
  StrategicPlanningStageService,
} from './strategic-planning-stage.service';

@Module({
  controllers: [StrategicPlanningStageController],
  providers: [StrategicPlanningStageService],
  exports: [StrategicPlanningStageService],
})
export class StrategicPlanningStageModule {}
