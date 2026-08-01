import { Module } from '@nestjs/common';

import {
  ExecutiveDecisionIntelligenceEngineController,
} from './executive-decision-intelligence-engine.controller';

import {
  ExecutiveDecisionIntelligenceEngineService,
} from './executive-decision-intelligence-engine.service';

@Module({
  controllers: [ExecutiveDecisionIntelligenceEngineController],
  providers: [ExecutiveDecisionIntelligenceEngineService],
  exports: [ExecutiveDecisionIntelligenceEngineService],
})
export class ExecutiveDecisionIntelligenceEngineModule {}
