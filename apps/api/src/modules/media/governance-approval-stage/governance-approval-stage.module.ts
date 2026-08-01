import { Module } from '@nestjs/common';

import {
  GovernanceApprovalStageController,
} from './governance-approval-stage.controller';

import {
  GovernanceApprovalStageService,
} from './governance-approval-stage.service';

@Module({
  controllers: [GovernanceApprovalStageController],
  providers: [GovernanceApprovalStageService],
  exports: [GovernanceApprovalStageService],
})
export class GovernanceApprovalStageModule {}
