import { Module } from '@nestjs/common';

import {
  MediaAgentRegistryEngineModule,
} from '../media-agent-registry-engine/media-agent-registry-engine.module';

import {
  AgentTeamOrchestrationEngineModule,
} from '../agent-team-orchestration-engine/agent-team-orchestration-engine.module';

import {
  MediaWorkflowOrchestrationEngineModule,
} from '../media-workflow-orchestration-engine/media-workflow-orchestration-engine.module';

import {
  SharedAgentMemoryEngineModule,
} from '../shared-agent-memory-engine/shared-agent-memory-engine.module';

import {
  AiOrganizationDecisionEngineModule,
} from '../ai-organization-decision-engine/ai-organization-decision-engine.module';

@Module({
  imports: [
    MediaAgentRegistryEngineModule,
    AgentTeamOrchestrationEngineModule,
    MediaWorkflowOrchestrationEngineModule,
    SharedAgentMemoryEngineModule,
    AiOrganizationDecisionEngineModule,
  ],
  exports: [
    MediaAgentRegistryEngineModule,
    AgentTeamOrchestrationEngineModule,
    MediaWorkflowOrchestrationEngineModule,
    SharedAgentMemoryEngineModule,
    AiOrganizationDecisionEngineModule,
  ],
})
export class AvosMediaAiOrganizationMegaModule {}
