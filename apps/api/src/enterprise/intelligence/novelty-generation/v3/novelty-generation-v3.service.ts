import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NoveltyGenerationV2Service } from '../v2/novelty-generation-v2.service';
import { GenerateNoveltyV3Dto } from './dto/generate-novelty-v3.dto';
import { CrossIndustryTransferEngine } from './engines/cross-industry-transfer.engine';
import { DraftPatentClaimGeneratorEngine } from './engines/draft-patent-claim-generator.engine';
import { InventivePrincipleGeneratorEngine } from './engines/inventive-principle-generator.engine';
import { PriorArtReasoningEngine } from './engines/prior-art-reasoning.engine';
import { ProtectabilityOptimizerEngine } from './engines/protectability-optimizer.engine';
import { TrizReasoningEngine } from './engines/triz-reasoning.engine';
import type {
  NoveltyV3Result,
  NoveltyV3Scores,
} from './models/novelty-v3.models';

@Injectable()
export class NoveltyGenerationV3Service {
  constructor(
    private readonly v2Service:
      NoveltyGenerationV2Service,
    private readonly trizEngine:
      TrizReasoningEngine,
    private readonly transferEngine:
      CrossIndustryTransferEngine,
    private readonly priorArtEngine:
      PriorArtReasoningEngine,
    private readonly inventiveGenerator:
      InventivePrincipleGeneratorEngine,
    private readonly claimGenerator:
      DraftPatentClaimGeneratorEngine,
    private readonly optimizer:
      ProtectabilityOptimizerEngine,
  ) {}

  generate(
    dto: GenerateNoveltyV3Dto,
  ): NoveltyV3Result {
    this.validate(dto);

    const runId = randomUUID();

    const baseEvolution =
      this.v2Service.generate(dto);

    const idea =
      baseEvolution.finalProtectableIdeaDna;

    const trizApplications =
      this.trizEngine.apply(
        idea,
        this.integer(
          dto.maximumTrizPrinciples ?? 8,
          1,
          12,
        ),
      );

    const crossIndustryTransfers =
      this.transferEngine.transfer(
        idea,
        this.clean(
          dto.preferredTransferIndustries,
        ),
        this.integer(
          dto.maximumCrossIndustryTransfers ?? 6,
          1,
          10,
        ),
      );

    const priorArtReasoning =
      this.priorArtEngine.analyze(
        idea,
        this.clean([
          ...(dto.priorArtPatterns ?? []),
          ...(dto.knownCompetitorPatterns ?? []),
        ]),
      );

    const inventiveMechanisms =
      this.inventiveGenerator.generate(
        idea,
        trizApplications,
        crossIndustryTransfers,
      );

    const maximumClaims = this.integer(
      dto.maximumClaims ?? 12,
      1,
      20,
    );

    const draftPatentClaims =
      this.claimGenerator.generate(
        inventiveMechanisms,
        maximumClaims,
        dto.includeSystemClaims ?? true,
        dto.includeMethodClaims ?? true,
      );

    const protectabilityOptimization =
      this.optimizer.optimize(
        idea,
        inventiveMechanisms,
        priorArtReasoning,
      );

    const scores = this.calculateScores(
      inventiveMechanisms.length,
      trizApplications.length,
      crossIndustryTransfers.length,
      priorArtReasoning.map(
        (item) => item.residualRisk,
      ),
      draftPatentClaims.length,
      protectabilityOptimization.afterScore,
    );

    const accepted =
      scores.total >= 80 &&
      scores.inventiveStep >= 75 &&
      scores.technicalSpecificity >= 75 &&
      scores.protectability >= 75;

    const primary =
      inventiveMechanisms[0];

    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.0.0',
      runId,
      status: accepted
        ? 'accepted'
        : 'best-effort',

      baseEvolution,
      optimizedIdeaDna: idea,
      trizApplications,
      crossIndustryTransfers,
      priorArtReasoning,
      inventiveMechanisms,
      draftPatentClaims,
      protectabilityOptimization,
      scores,

      finalInvention: {
        title:
          `${idea.title} — Inventive Core`,

        abstract:
          `نظام حاسوبي يحول طلبات شراء فردية غير المؤهلة لشروط الجملة إلى مجموعة شراء ديناميكية قابلة للتنفيذ، من خلال تحليل القيود وتكوين المجموعة وتخصيص الحصص وإدارة الالتزام وإعادة التوزيع عند تغير حالة الأعضاء.`,

        technicalProblem:
          primary?.technicalProblem ??
          idea.problem.statement,

        inventiveConcept:
          primary?.mechanism ??
          idea.mechanism.core,

        systemComponents: [
          'واجهة استقبال الطلبات',
          'محرك توحيد المواصفات',
          'محرك توافق متعدد القيود',
          'محرك تكوين المجموعة',
          'محرك التفاوض',
          'محرك تخصيص الحصص',
          'محرك مخاطر الالتزام',
          'محرك إعادة توزيع الحصص',
          'رسم معرفة الطلب والموردين',
        ],

        methodSteps:
          primary?.processingSteps ??
          idea.mechanism.workflow,

        technicalEffects: inventiveMechanisms.map(
          (mechanism) =>
            mechanism.technicalEffect,
        ),

        protectableCore: [
          ...inventiveMechanisms.map(
            (mechanism) => mechanism.name,
          ),
          ...idea.intellectualProperty
            .protectableMechanisms,
          ...idea.intellectualProperty
            .protectableProcesses,
        ],

        commercialDefensibility: [
          ...idea.dataMoat.compoundingLoop,
          ...idea.network.networkEffects,
          ...idea.intellectualProperty
            .defensibility,
        ],
      },

      legalNotice:
        'هذه مخرجات تحليل وتوليد تقني أولي وليست رأيًا قانونيًا أو إثباتًا للجدة أو قابلية منح براءة. يجب إجراء بحث فني سابق رسمي ومراجعة مختص براءات قبل الإيداع.',
    };
  }

  getStatus() {
    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '3.0.0',
      phase:
        'Inventive Reasoning and Patent-Oriented Generation',
      status: 'operational',

      architecture: {
        v21AdaptiveEvolution: true,
        trizReasoningEngine: true,
        crossIndustryTransferEngine: true,
        priorArtReasoningEngine: true,
        inventivePrincipleGenerator: true,
        technicalMechanismGenerator: true,
        draftPatentClaimGenerator: true,
        protectabilityOptimizer: true,
        inventionRebuilder: true,
      },

      outputs: [
        'TRIZ applications',
        'cross-industry transfers',
        'prior-art reasoning',
        'inventive mechanisms',
        'draft system claims',
        'draft method claims',
        'dependent claims',
        'protectability optimization',
        'final invention specification',
      ],
    };
  }

  private calculateScores(
    mechanismCount: number,
    trizCount: number,
    transferCount: number,
    priorArtRisks: number[],
    claimCount: number,
    protectability: number,
  ): NoveltyV3Scores {
    const averageRisk =
      priorArtRisks.length === 0
        ? 25
        : priorArtRisks.reduce(
            (sum, value) => sum + value,
            0,
          ) / priorArtRisks.length;

    const scores: NoveltyV3Scores = {
      inventiveStep: this.clamp(
        50 +
          trizCount * 4 +
          transferCount * 4,
      ),

      technicalSpecificity: this.clamp(
        45 +
          mechanismCount * 11,
      ),

      claimSupport: this.clamp(
        40 +
          claimCount * 5,
      ),

      designAroundResistance: this.clamp(
        45 +
          mechanismCount * 8 +
          transferCount * 3,
      ),

      crossIndustryNovelty: this.clamp(
        35 +
          transferCount * 10,
      ),

      priorArtDistance: this.clamp(
        100 - averageRisk,
      ),

      protectability:
        this.round(protectability),

      total: 0,
    };

    scores.total = this.round(
      scores.inventiveStep * 0.18 +
        scores.technicalSpecificity * 0.18 +
        scores.claimSupport * 0.12 +
        scores.designAroundResistance * 0.14 +
        scores.crossIndustryNovelty * 0.12 +
        scores.priorArtDistance * 0.12 +
        scores.protectability * 0.14,
    );

    return this.roundScores(scores);
  }

  private roundScores(
    scores: NoveltyV3Scores,
  ): NoveltyV3Scores {
    return {
      inventiveStep:
        this.round(scores.inventiveStep),
      technicalSpecificity:
        this.round(scores.technicalSpecificity),
      claimSupport:
        this.round(scores.claimSupport),
      designAroundResistance:
        this.round(
          scores.designAroundResistance,
        ),
      crossIndustryNovelty:
        this.round(
          scores.crossIndustryNovelty,
        ),
      priorArtDistance:
        this.round(scores.priorArtDistance),
      protectability:
        this.round(scores.protectability),
      total:
        this.round(scores.total),
    };
  }

  private validate(
    dto: GenerateNoveltyV3Dto,
  ): void {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException(
        'Request body is required.',
      );
    }

    if (
      !dto.title ||
      dto.title.trim().length < 3
    ) {
      throw new BadRequestException(
        'title must contain at least 3 characters.',
      );
    }

    if (
      !dto.description ||
      dto.description.trim().length < 20
    ) {
      throw new BadRequestException(
        'description must contain at least 20 characters.',
      );
    }
  }

  private clean(
    values?: string[],
  ): string[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return [
      ...new Set(
        values
          .filter(
            (value) =>
              typeof value === 'string',
          )
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }

  private integer(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    if (!Number.isFinite(value)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(
        maximum,
        Math.floor(value),
      ),
    );
  }

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(value * 100) / 100;
  }
}
