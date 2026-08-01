import { Module } from '@nestjs/common';

import {
  AgentTeamOrchestrationEngineController,
} from './agent-team-orchestration-engine.controller';

import {
  AgentTeamOrchestrationEngineService,
} from './agent-team-orchestration-engine.service';

@Module({
  controllers: [AgentTeamOrchestrationEngineController],
  providers: [AgentTeamOrchestrationEngineService],
  exports: [AgentTeamOrchestrationEngineService],
})
export class AgentTeamOrchestrationEngineModule {}
