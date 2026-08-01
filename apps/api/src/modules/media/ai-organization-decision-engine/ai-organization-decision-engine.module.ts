import { Module } from '@nestjs/common';

import {
  AiOrganizationDecisionEngineController,
} from './ai-organization-decision-engine.controller';

import {
  AiOrganizationDecisionEngineService,
} from './ai-organization-decision-engine.service';

@Module({
  controllers: [AiOrganizationDecisionEngineController],
  providers: [AiOrganizationDecisionEngineService],
  exports: [AiOrganizationDecisionEngineService],
})
export class AiOrganizationDecisionEngineModule {}
