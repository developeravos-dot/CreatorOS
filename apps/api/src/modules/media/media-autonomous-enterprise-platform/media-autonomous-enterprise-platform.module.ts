import { Module } from '@nestjs/common';
import { AiAcquisitionEngineService } from './ai-acquisition-engine.service';
import { AiCouncilEngineService } from './ai-council-engine.service';
import { AiNegotiationEngineService } from './ai-negotiation-engine.service';
import { EcosystemOrchestrationEngineService } from './ecosystem-orchestration-engine.service';
import { EnterpriseDigitalTwinEngineService } from './enterprise-digital-twin-engine.service';
import { EnterpriseKnowledgeGraphEngineService } from './enterprise-knowledge-graph-engine.service';
import { ExecutionOrchestrationEngineService } from './execution-orchestration-engine.service';
import { MediaAutonomousEnterprisePlatformController } from './media-autonomous-enterprise-platform.controller';
import { MediaAutonomousEnterprisePlatformService } from './media-autonomous-enterprise-platform.service';
import { ObservabilityAuditEngineService } from './observability-audit-engine.service';
import { OpportunityMarketplaceEngineService } from './opportunity-marketplace-engine.service';
import { ScenarioSimulatorEngineService } from './scenario-simulator-engine.service';

@Module({
  controllers: [MediaAutonomousEnterprisePlatformController],
  providers: [
    MediaAutonomousEnterprisePlatformService,
    AiCouncilEngineService,
    EnterpriseDigitalTwinEngineService,
    ScenarioSimulatorEngineService,
    EnterpriseKnowledgeGraphEngineService,
    AiAcquisitionEngineService,
    AiNegotiationEngineService,
    OpportunityMarketplaceEngineService,
    EcosystemOrchestrationEngineService,
    ExecutionOrchestrationEngineService,
    ObservabilityAuditEngineService,
  ],
  exports: [MediaAutonomousEnterprisePlatformService],
})
export class MediaAutonomousEnterprisePlatformModule {}