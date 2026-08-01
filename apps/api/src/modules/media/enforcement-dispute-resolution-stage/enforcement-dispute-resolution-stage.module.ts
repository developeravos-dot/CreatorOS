import { Module } from '@nestjs/common';

import {
  EnforcementDisputeResolutionStageController,
} from './enforcement-dispute-resolution-stage.controller';

import {
  EnforcementDisputeResolutionStageService,
} from './enforcement-dispute-resolution-stage.service';

@Module({
  controllers: [
    EnforcementDisputeResolutionStageController,
  ],
  providers: [
    EnforcementDisputeResolutionStageService,
  ],
  exports: [
    EnforcementDisputeResolutionStageService,
  ],
})
export class EnforcementDisputeResolutionStageModule {}
