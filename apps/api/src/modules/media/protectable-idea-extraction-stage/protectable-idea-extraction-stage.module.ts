import {
  ProtectableIdeaDuplicateAnalyzerService,
} from './protectable-idea-duplicate-analyzer.service';
import { Module } from '@nestjs/common';

import { AiFoundationModule } from '../../../enterprise/ai-foundation/ai-foundation.module';

import {
  ProtectableIdeaExtractionStageController,
} from './protectable-idea-extraction-stage.controller';

import {
  ProtectableIdeaExtractionStageService,
} from './protectable-idea-extraction-stage.service';

import {
  ProtectableIdeaOrchestratorService,
} from './protectable-idea-orchestrator.service';

@Module({
  imports: [AiFoundationModule],
  controllers: [ProtectableIdeaExtractionStageController],
  providers: [
    ProtectableIdeaDuplicateAnalyzerService,
    ProtectableIdeaExtractionStageService,
    ProtectableIdeaOrchestratorService,
  ],
  exports: [
    ProtectableIdeaDuplicateAnalyzerService,
    ProtectableIdeaExtractionStageService,
    ProtectableIdeaOrchestratorService,
  ],
})
export class ProtectableIdeaExtractionStageModule {}