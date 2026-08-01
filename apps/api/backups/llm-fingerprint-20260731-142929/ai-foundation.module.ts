import { Module } from '@nestjs/common';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { AiFoundationController } from './ai-foundation.controller';
import { AiGatewayService } from './ai-gateway.service';
import { AiQualityGateService } from './ai-quality-gate.service';
import { AiSemanticValidatorService } from './ai-semantic-validator.service';
import { ModelRegistryService } from './model-registry.service';
import { PromptEngineService } from './prompt-engine.service';
import { TaskRouterService } from './task-router.service';
import { AiOriginalitySafetyEvaluatorService } from './ai-originality-safety-evaluator.service';
import { AiSemanticCriticService } from './ai-semantic-critic.service';
import { AiOriginalityCriticService } from './ai-originality-critic.service';
import { AiDomainExpertService } from './ai-domain-expert.service';
import { AiSafetyCriticService } from './ai-safety-critic.service';
import { AiJudgeService } from './ai-judge.service';
import { AiReviewCouncilService } from './ai-review-council.service';

import { AiSemanticOriginalityCriticService } from './ai-semantic-originality-critic.service';
@Module({
  imports: [IntelligenceModule],
  controllers: [
    AiFoundationController,
  ],
  providers: [
    AiSemanticOriginalityCriticService,
    AiReviewCouncilService,
    AiJudgeService,
    AiSafetyCriticService,
    AiDomainExpertService,
    AiOriginalityCriticService,
    AiSemanticCriticService,
    AiOriginalitySafetyEvaluatorService,
    AiGatewayService,
    AiQualityGateService,
    AiSemanticValidatorService,
    ModelRegistryService,
    PromptEngineService,
    TaskRouterService,
  ],
  exports: [
    AiGatewayService,
    AiQualityGateService,
    AiSemanticValidatorService,
    ModelRegistryService,
    PromptEngineService,
    TaskRouterService,
  ],
})
export class AiFoundationModule {}



