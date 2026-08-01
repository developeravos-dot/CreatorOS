import { Module } from '@nestjs/common';

import {
  InfringementMonitoringStageController,
} from './infringement-monitoring-stage.controller';

import {
  InfringementMonitoringStageService,
} from './infringement-monitoring-stage.service';

@Module({
  controllers: [
    InfringementMonitoringStageController,
  ],
  providers: [
    InfringementMonitoringStageService,
  ],
  exports: [
    InfringementMonitoringStageService,
  ],
})
export class InfringementMonitoringStageModule {}
