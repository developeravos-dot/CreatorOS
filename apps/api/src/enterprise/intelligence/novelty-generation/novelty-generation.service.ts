import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GenerateNoveltyIdeaDto } from './dto/generate-novelty-idea.dto';
import { IdeaMutationEngine } from './engines/idea-mutation.engine';
import { IdeaRecombinationEngine } from './engines/idea-recombination.engine';
import { NoveltyOpportunityFinderEngine } from './engines/novelty-opportunity-finder.engine';
import { OriginalityEvaluatorEngine } from './engines/originality-evaluator.engine';
import { ProtectabilityPredictorEngine } from './engines/protectability-predictor.engine';
import { WeaknessAnalyzerEngine } from './engines/weakness-analyzer.engine';
import type {
  IdeaCandidate,
  NoveltyGenerationResult,
  NoveltyGenerationThresholds,
  NoveltyIteration,
  ScoredIdeaCandidate,
} from './models/novelty-generation.models';

@Injectable()
export class NoveltyGenerationService {
  private readonly defaultThresholds: NoveltyGenerationThresholds = {
    originality: 85,
    maximumDuplicateRisk: 20,
    protectability: 80,
    commercialValue: 70,
    technicalFeasibility: 65,
    innovation: 82,
  };

  constructor(
    private readonly weaknessAnalyzer: WeaknessAnalyzerEngine,
    private readonly opportunityFinder: NoveltyOpportunityFinderEngine,
    private readonly mutationEngine: IdeaMutationEngine,
    private readonly recombinationEngine: IdeaRecombinationEngine,
    private readonly evaluator: OriginalityEvaluatorEngine,
    private readonly predictor: ProtectabilityPredictorEngine,
  ) {}

  generate(dto: GenerateNoveltyIdeaDto): NoveltyGenerationResult {
    this.validate(dto);

    const runId = randomUUID();
    const maximumIterations = this.clampInteger(
      dto.maximumIterations ?? 6,
      1,
      12,
    );
    const candidatesPerIteration = this.clampInteger(
      dto.candidatesPerIteration ?? 8,
      2,
      24,
    );

    const thresholds: NoveltyGenerationThresholds = {
      ...this.defaultThresholds,
      ...(dto.thresholds ?? {}),
    };

    const originalIdea = this.createOriginalIdea(dto);
    let currentBest = this.evaluateCandidate(
      originalIdea,
      originalIdea,
    );

    const iterations: NoveltyIteration[] = [];
    const mutationHistory: IdeaCandidate[] = [];
    const recombinationHistory: IdeaCandidate[] = [];

    let generatedCandidates = 1;

    for (
      let iteration = 1;
      iteration <= maximumIterations;
      iteration += 1
    ) {
      const weaknesses =
        this.weaknessAnalyzer.analyzeScored(currentBest);

      const opportunities = this.opportunityFinder.find(
        currentBest,
        weaknesses,
      );

      const mutations = this.mutationEngine.mutate(
        currentBest,
        opportunities,
        iteration,
        candidatesPerIteration,
      );

      const recombinations =
        this.recombinationEngine.recombine(
          mutations,
          iteration,
          Math.max(2, Math.floor(candidatesPerIteration / 2)),
        );

      mutationHistory.push(...mutations);
      recombinationHistory.push(...recombinations);

      const candidates = [
        currentBest,
        ...mutations,
        ...recombinations,
      ].map((candidate) =>
        this.evaluateCandidate(candidate, originalIdea),
      );

      generatedCandidates +=
        mutations.length + recombinations.length;

      const ranked = this.predictor.rank(candidates);
      currentBest = ranked[0]!;

      const accepted = this.predictor.satisfies(
        currentBest,
        thresholds,
      );

      iterations.push({
        iteration,
        generatedCandidates:
          mutations.length + recombinations.length,
        bestCandidateId: currentBest.id,
        bestScores: currentBest.scores,
        accepted,
      });

      if (accepted) {
        break;
      }
    }

    const accepted = this.predictor.satisfies(
      currentBest,
      thresholds,
    );

    return {
      success: true,
      runId,
      status: accepted ? 'accepted' : 'best-effort',
      originalIdea,
      finalProtectableIdea: currentBest,
      iterations,
      mutationHistory,
      recombinationHistory,
      generatedCandidates,
      thresholds,
      improvementSummary: this.buildImprovementSummary(
        originalIdea,
        currentBest,
        accepted,
      ),
    };
  }

  getStatus() {
    return {
      success: true,
      engine: 'Protectable Idea Novelty Generation Engine',
      phase: 1,
      status: 'operational',
      capabilities: {
        weaknessAnalyzer: true,
        noveltyOpportunityFinder: true,
        ideaMutationEngine: true,
        ideaRecombinationEngine: true,
        crossDomainFusion: true,
        originalityEvaluator: true,
        protectabilityPredictor: true,
        autoReEvaluationLoop: true,
      },
      defaultThresholds: this.defaultThresholds,
    };
  }

  private evaluateCandidate(
    candidate: IdeaCandidate,
    originalIdea: IdeaCandidate,
  ): ScoredIdeaCandidate {
    const scored = this.evaluator.evaluate(
      candidate,
      originalIdea,
    );

    const weaknesses =
      this.weaknessAnalyzer.analyzeScored(scored);

    const opportunities = this.opportunityFinder.find(
      candidate,
      weaknesses,
    );

    return {
      ...scored,
      weaknesses,
      opportunities,
    };
  }

  private createOriginalIdea(
    dto: GenerateNoveltyIdeaDto,
  ): IdeaCandidate {
    return {
      id: randomUUID(),
      generation: 0,
      parentIds: [],
      title: dto.title.trim(),
      description: dto.description.trim(),
      targetUsers: this.cleanArray(dto.targetUsers),
      problem: dto.problem?.trim() ?? '',
      solution: dto.solution?.trim() ?? dto.description.trim(),
      businessModel: dto.businessModel?.trim() ?? '',
      technology: this.cleanArray(dto.technology),
      differentiators: this.cleanArray(dto.differentiators),
      sourceStrategy: 'Original Input',
    };
  }

  private validate(dto: GenerateNoveltyIdeaDto): void {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Request body is required.');
    }

    if (!dto.title || dto.title.trim().length < 3) {
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

  private cleanArray(values?: string[]): string[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return [
      ...new Set(
        values
          .filter((item) => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
  }

  private clampInteger(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    if (!Number.isFinite(value)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(maximum, Math.floor(value)),
    );
  }

  private buildImprovementSummary(
    original: IdeaCandidate,
    finalIdea: ScoredIdeaCandidate,
    accepted: boolean,
  ): string[] {
    return [
      accepted
        ? 'حققت الفكرة عتبات القبول المحددة.'
        : 'تم إرجاع أفضل نسخة متاحة بعد استنفاد دورات التطوير.',
      `انتقلت الفكرة من الجيل ${original.generation} إلى الجيل ${finalIdea.generation}.`,
      `درجة الأصالة النهائية: ${finalIdea.scores.originality}%.`,
      `مخاطر التشابه النهائية: ${finalIdea.scores.duplicateRisk}%.`,
      `درجة قابلية الحماية التقديرية: ${finalIdea.scores.protectability}%.`,
      `تم اعتماد استراتيجية: ${finalIdea.sourceStrategy}.`,
      `عناصر التميز النهائية: ${finalIdea.differentiators.length}.`,
    ];
  }
}

