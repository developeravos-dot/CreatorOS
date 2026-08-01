import { Module } from '@nestjs/common';

import {
  GlobalRiskGovernanceStageController,
} from './global-risk-governance-stage.controller';

import {
  GlobalRiskGovernanceStageService,
} from './global-risk-governance-stage.service';

@Module({
  controllers: [GlobalRiskGovernanceStageController],
  providers: [GlobalRiskGovernanceStageService],
  exports: [GlobalRiskGovernanceStageService],
})
export class GlobalRiskGovernanceStageModule {}
