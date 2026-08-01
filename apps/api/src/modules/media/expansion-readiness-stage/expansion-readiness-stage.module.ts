import { Module } from '@nestjs/common';

import {
  ExpansionReadinessStageController,
} from './expansion-readiness-stage.controller';

import {
  ExpansionReadinessStageService,
} from './expansion-readiness-stage.service';

@Module({
  controllers: [ExpansionReadinessStageController],
  providers: [ExpansionReadinessStageService],
  exports: [ExpansionReadinessStageService],
})
export class ExpansionReadinessStageModule {}
