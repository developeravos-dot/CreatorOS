import { Module } from '@nestjs/common';
import { AdaptiveWorkflowEngineService } from './adaptive-workflow-engine.service';
import { AutonomousPlanningEngineService } from './autonomous-planning-engine.service';
import { CapabilityEvolutionEngineService } from './capability-evolution-engine.service';
import { CrossDomainReasoningEngineService } from './cross-domain-reasoning-engine.service';
import { CrossProjectIntelligenceEngineService } from './cross-project-intelligence-engine.service';
import { DigitalOrganizationBrainService } from './digital-organization-brain.service';
import { EcosystemIntelligenceEngineService } from './ecosystem-intelligence-engine.service';
import { EnterpriseDnaEngineService } from './enterprise-dna-engine.service';
import { EvidenceRankingEngineService } from './evidence-ranking-engine.service';
import { ExecutiveCommandNexusEngineService } from './executive-command-nexus-engine.service';
import { GlobalEventCorrelationEngineService } from './global-event-correlation-engine.service';
import { InnovationLabEngineService } from './innovation-lab-engine.service';
import { KnowledgeFabricEngineService } from './knowledge-fabric-engine.service';
import { MediaMetaIntelligenceNexusController } from './media-meta-intelligence-nexus.controller';
import { MediaMetaIntelligenceNexusService } from './media-meta-intelligence-nexus.service';
import { OpportunityGraphEngineService } from './opportunity-graph-engine.service';
import { PortfolioEvolutionEngineService } from './portfolio-evolution-engine.service';
import { PredictiveOpportunityRiskEngineService } from './predictive-opportunity-risk-engine.service';
import { ScenarioMatrixEngineService } from './scenario-matrix-engine.service';
import { SelfOptimizationEngineService } from './self-optimization-engine.service';
import { SemanticMemoryEngineService } from './semantic-memory-engine.service';
import { SimulationGridEngineService } from './simulation-grid-engine.service';
import { TrendIntelligenceEngineService } from './trend-intelligence-engine.service';
import { WorldModelEngineService } from './world-model-engine.service';

@Module({
  controllers: [MediaMetaIntelligenceNexusController],
  providers: [
    MediaMetaIntelligenceNexusService,
    KnowledgeFabricEngineService,
    WorldModelEngineService,
    SemanticMemoryEngineService,
    CrossProjectIntelligenceEngineService,
    OpportunityGraphEngineService,
    InnovationLabEngineService,
    EvidenceRankingEngineService,
    ScenarioMatrixEngineService,
    TrendIntelligenceEngineService,
    EnterpriseDnaEngineService,
    DigitalOrganizationBrainService,
    CapabilityEvolutionEngineService,
    SelfOptimizationEngineService,
    SimulationGridEngineService,
    GlobalEventCorrelationEngineService,
    PredictiveOpportunityRiskEngineService,
    AdaptiveWorkflowEngineService,
    CrossDomainReasoningEngineService,
    PortfolioEvolutionEngineService,
    EcosystemIntelligenceEngineService,
    AutonomousPlanningEngineService,
    ExecutiveCommandNexusEngineService,
  ],
  exports: [MediaMetaIntelligenceNexusService],
})
export class MediaMetaIntelligenceNexusModule {}