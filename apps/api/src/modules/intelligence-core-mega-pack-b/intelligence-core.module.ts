import { Module } from '@nestjs/common';
import { KnowledgeFabricService } from './knowledge/knowledge-fabric.service';
import { DataFabricService } from './data/data-fabric.service';
import { AiAgentRuntimeService } from './agents/ai-agent-runtime.service';
import { AiOrganizationOsService } from './organization/ai-organization-os.service';
import { IntelligenceCoreOrchestratorService } from './intelligence-core-orchestrator.service';
import { IntelligenceCoreController } from './intelligence-core.controller';

@Module({
  controllers: [
    IntelligenceCoreController,
  ],
  providers: [
    KnowledgeFabricService,
    DataFabricService,
    AiAgentRuntimeService,
    AiOrganizationOsService,
    IntelligenceCoreOrchestratorService,
  ],
  exports: [
    KnowledgeFabricService,
    DataFabricService,
    AiAgentRuntimeService,
    AiOrganizationOsService,
    IntelligenceCoreOrchestratorService,
  ],
})
export class IntelligenceCoreModule {}