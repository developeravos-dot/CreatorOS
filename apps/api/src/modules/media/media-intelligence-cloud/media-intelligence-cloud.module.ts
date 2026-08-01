import { Module } from '@nestjs/common';
import { AiAgentTeamOrchestratorService } from './ai-agent-team-orchestrator.service';
import { CompetitiveIntelligenceEngineService } from './competitive-intelligence-engine.service';
import { DecisionEngineeringService } from './decision-engineering.service';
import { EnterpriseMemoryEngineService } from './enterprise-memory-engine.service';
import { FutureSimulationEngineService } from './future-simulation-engine.service';
import { IntelligenceObservabilityEngineService } from './intelligence-observability-engine.service';
import { MediaIntelligenceCloudController } from './media-intelligence-cloud.controller';
import { MediaIntelligenceCloudService } from './media-intelligence-cloud.service';
import { PortfolioOptimizationEngineService } from './portfolio-optimization-engine.service';
import { PredictiveIntelligenceEngineService } from './predictive-intelligence-engine.service';
import { SignalRadarEngineService } from './signal-radar-engine.service';

@Module({
  controllers: [MediaIntelligenceCloudController],
  providers: [
    MediaIntelligenceCloudService,
    SignalRadarEngineService,
    PredictiveIntelligenceEngineService,
    CompetitiveIntelligenceEngineService,
    DecisionEngineeringService,
    PortfolioOptimizationEngineService,
    FutureSimulationEngineService,
    EnterpriseMemoryEngineService,
    AiAgentTeamOrchestratorService,
    IntelligenceObservabilityEngineService,
  ],
  exports: [MediaIntelligenceCloudService],
})
export class MediaIntelligenceCloudModule {}