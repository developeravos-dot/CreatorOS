import { Injectable } from '@nestjs/common';
import { IntelligenceRouterService } from '../intelligence/intelligence-router.service';
import { AiQualityGateService } from './ai-quality-gate.service';
import {
  AiSemanticValidatorService,
  SemanticValidationResult,
} from './ai-semantic-validator.service';
import { ExecuteAiTaskDto } from './dto/execute-ai-task.dto';
import { ModelRegistryService } from './model-registry.service';
import { PromptEngineService } from './prompt-engine.service';
import { TaskRouterService } from './task-router.service';
import { AiOriginalitySafetyEvaluatorService } from './ai-originality-safety-evaluator.service';
import { AiReviewCouncilService } from './ai-review-council.service';

@Injectable()
export class AiGatewayService {
  private readonly maxGenerationAttempts = 3;

  constructor(
    private readonly intelligence: IntelligenceRouterService,
    private readonly promptEngine: PromptEngineService,
    private readonly taskRouter: TaskRouterService,
    private readonly modelRegistry: ModelRegistryService,
    private readonly qualityGate: AiQualityGateService,
    private readonly semanticValidator: AiSemanticValidatorService,
    private readonly originalitySafetyEvaluator: AiOriginalitySafetyEvaluatorService,
    private readonly reviewCouncil: AiReviewCouncilService,) {}

  async execute(input: ExecuteAiTaskDto) {
    const startedAt = Date.now();

    const prompt = this.promptEngine.buildPrompt({
      taskType: input.taskType,
      userInput: input.input,
      language: input.language,
      customSystemPrompt: input.systemPrompt,
      variables: input.variables,
    });

    const route = this.taskRouter.route({
      taskType: input.taskType,
      provider: input.provider,
      model: input.model,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
      allowPaidProvider: input.allowPaidProvider,
    });

    let currentPrompt = prompt.prompt;
    let result:
      Awaited<
        ReturnType<
          IntelligenceRouterService['generate']
        >
      >;

    let quality:
      ReturnType<
        AiQualityGateService['assess']
      >;

    let semanticValidation:
      SemanticValidationResult;

let originalityEvaluation:
  ReturnType<
    AiOriginalitySafetyEvaluatorService["evaluate"]
  >;

let reviewCouncilResult:
      Awaited<
        ReturnType<
          typeof this.reviewCouncil.review
        >
      >;

    const validationHistory: Array<{
      attempt: number;
      qualityPassed: boolean;
      semanticPassed: boolean;
      detectedIndependentItemCount?: number;
      requiredItemCount?: number;
      missingRequirements: string[];
    }> = [];

    let generationAttempts = 0;

    do {
      generationAttempts += 1;

      result = await this.intelligence.generate({
        prompt: currentPrompt,
        systemPrompt:
          generationAttempts === 1
            ? prompt.systemPrompt
            : 'You are the CreatorOS Quality Correction Agent. Rewrite failed content and strictly satisfy every original requirement.',
        provider: route.provider,
        model: route.model,
        temperature:
          generationAttempts === 1
            ? route.temperature
            : Math.min(
                route.temperature,
                0.4,
              ),
        maxTokens: route.maxTokens,
        allowPaidProvider:
          route.allowPaidProvider,
        metadata: {
          ...input.metadata,
          aiFoundation: true,
          taskType: input.taskType,
          selectedModelId:
            route.selectedModel.id,
          promptTemplate: prompt.template,
          generationAttempt:
            generationAttempts,
        },
      });

      quality = this.qualityGate.assess({
        taskType: input.taskType,
        request: input.input,
        content: result.content,
        language: input.language,
        provider: result.provider,
      });

      semanticValidation =
        await this.semanticValidator.validate({
          taskType: input.taskType,
          originalRequest: input.input,
          generatedContent: result.content,
          language: input.language,
          provider: route.provider,
          model: route.model,
          allowPaidProvider:
            route.allowPaidProvider,
        });

      originalityEvaluation =
        this.originalitySafetyEvaluator.evaluate(
          input.input,
          result.content,
        );

      reviewCouncilResult =
        await this.reviewCouncil.review({
          taskType: input.taskType,
          request: input.input,
          content: result.content,
          semanticValidation,
          originalityEvaluation,
          generationAttempt:
            generationAttempts,
          maximumGenerationAttempts:
            this.maxGenerationAttempts,
        });

      const councilRegenerationInstructions =
        reviewCouncilResult.judge
          .regenerationInstructions;

      validationHistory.push({
        attempt: generationAttempts,
        qualityPassed: quality.passed,
        semanticPassed:
          semanticValidation.passed,
        detectedIndependentItemCount:
          semanticValidation
            .detectedIndependentItemCount,
        requiredItemCount:
          semanticValidation
            .requiredItemCount,
        missingRequirements:
          semanticValidation
            .missingRequirements,
      });

      if (
        reviewCouncilResult.judge.decision ===
        'ACCEPT'
      ) {
        break;
      }

      if (
        generationAttempts <
        this.maxGenerationAttempts
      ) {
        currentPrompt =
          this.semanticValidator
            .buildCorrectionPrompt({
              originalRequest: input.input,
              failedContent: result.content,
              validation:
                semanticValidation,
              language: input.language,
            });
      }
    } while (
      generationAttempts <
      this.maxGenerationAttempts
    );

    const finalPassed =
      reviewCouncilResult.judge.decision ===
      'ACCEPT';

    return {
      success: finalPassed,
      system: 'CreatorOS AI Foundation',
      version: '2.1.0',
      status: finalPassed
        ? 'completed'
        : 'human-review-required',
      task: {
        type: input.taskType,
        language:
          input.language ?? 'auto',
      },
      routing: {
        provider: route.provider,
        model: route.model,
        selectedModelId:
          route.selectedModel.id,
        paid: route.selectedModel.paid,
        temperature: route.temperature,
        maxTokens: route.maxTokens,
      },
      quality: {
        ruleBased: quality,
        semantic:
          semanticValidation,
        originality:
          originalityEvaluation,
        reviewCouncil:
          reviewCouncilResult,
        passed: finalPassed,
        correctionApplied:
          generationAttempts > 1,
        generationAttempts,
        maxGenerationAttempts:
          this.maxGenerationAttempts,
        humanReviewRequired:
          reviewCouncilResult.judge
            .humanReviewRequired,
        history: validationHistory,
      },
      result,
      totalDurationMs:
        Date.now() - startedAt,
    };
  }

  async getStatus() {
    const intelligenceStatus =
      await this.intelligence.getStatus();

    return {
      success: true,
      system: 'CreatorOS AI Foundation',
      version: '2.1.0',
      status: 'operational',
      components: {
        aiGateway: true,
        promptEngine: true,
        modelRegistry: true,
        taskRouter: true,
        ruleBasedQualityGate: true,
        semanticResponseValidator: true,
        automaticCorrectionLoop: true,
        intelligenceEngine: true,
      },
      policies: {
        localFirst: true,
        paidProviderRequiresPermission: true,
        fallbackEnabled: true,
        semanticValidationRequired: true,
        maximumGenerationAttempts:
          this.maxGenerationAttempts,
        humanFinalAuthority: true,
      },
      modelRegistry:
        this.modelRegistry.getStatus(),
      promptEngine:
        this.promptEngine.getStatus(),
      taskRouter:
        this.taskRouter.getStatus(),
      qualityGate:
        this.qualityGate.getStatus(),
      semanticValidator:
        this.semanticValidator.getStatus(),
      intelligenceEngine:
        intelligenceStatus,
    };
  }
}










