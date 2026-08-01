import { Module } from '@nestjs/common';

import {
  ExecutiveDecisionCenterController,
} from './executive-decision-center.controller';

import {
  ExecutiveDecisionCenterService,
} from './executive-decision-center.service';

@Module({
  controllers: [ExecutiveDecisionCenterController],
  providers: [ExecutiveDecisionCenterService],
  exports: [ExecutiveDecisionCenterService],
})
export class ExecutiveDecisionCenterModule {}
