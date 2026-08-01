import { Module } from '@nestjs/common';
import { MediaAnalyticsIntelligenceService } from './analytics/media-analytics-intelligence.service';
import { MediaDigitalDnaService } from './digital-dna/media-digital-dna.service';
import { AutonomousImprovementIntelligenceService } from './improvement/autonomous-improvement-intelligence.service';
import { IntelligenceCoreController } from './intelligence-core.controller';
import { IntelligenceCoreOrchestratorService } from './intelligence-core-orchestrator.service';
import { MediaKnowledgeGraphService } from './knowledge-graph/media-knowledge-graph.service';
import { MediaLearningIntelligenceService } from './learning/media-learning-intelligence.service';
import { MediaMemoryIntelligenceService } from './memory/media-memory-intelligence.service';
import { IntelligenceCoreQualityService } from './quality/intelligence-core-quality.service';

@Module({
  controllers: [IntelligenceCoreController],
  providers: [
    MediaAnalyticsIntelligenceService,
    MediaLearningIntelligenceService,
    AutonomousImprovementIntelligenceService,
    MediaKnowledgeGraphService,
    MediaMemoryIntelligenceService,
    MediaDigitalDnaService,
    IntelligenceCoreQualityService,
    IntelligenceCoreOrchestratorService,
  ],
  exports: [IntelligenceCoreOrchestratorService],
})
export class IntelligenceCoreModule {}