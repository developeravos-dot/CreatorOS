import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GenerateNoveltyV2Dto } from './dto/generate-novelty-v2.dto';
import {
  AdaptiveMutationPlannerEngine,
  WeakDimensionTarget,
} from './engines/adaptive-mutation-planner.engine';
import { ConceptMutationEngine } from './engines/concept-mutation.engine';
import { DnaNoveltyEvaluatorEngine } from './engines/dna-novelty-evaluator.engine';
import { DnaRecombinationEngine } from './engines/dna-recombination.engine';
import { IdeaDnaExtractorEngine } from './engines/idea-dna-extractor.engine';
import { IdeaRebuilderEngine } from './engines/idea-rebuilder.engine';
import type {
  DnaNoveltyScores,
  EvaluatedIdeaDna,
  IdeaDna,
  NoveltyV2Iteration,
  NoveltyV2Result,
  NoveltyV2Thresholds,
} from './models/novelty-v2.models';

interface AdaptiveIteration extends NoveltyV2Iteration {
  targetedWeakDimensions: string[];
  paretoFrontSize: number;
}

@Injectable()
export class NoveltyGenerationV2Service {
  private readonly defaultThresholds: NoveltyV2Thresholds = {
    structuralNovelty: 72,
    mechanismNovelty: 78,
    ipProtectability: 78,
    dataMoatStrength: 72,
    commercialValue: 75,
    feasibility: 62,
    maximumDuplicateRisk: 24,
    marketNovelty: 65,
    total: 76,
  };

  constructor(
    private readonly extractor: IdeaDnaExtractorEngine,
    private readonly mutationEngine: ConceptMutationEngine,
    private readonly recombinationEngine: DnaRecombinationEngine,
    private readonly evaluator: DnaNoveltyEvaluatorEngine,
    private readonly rebuilder: IdeaRebuilderEngine,
    private readonly adaptivePlanner:
      AdaptiveMutationPlannerEngine,
  ) {}

  generate(dto: GenerateNoveltyV2Dto): NoveltyV2Result {
    this.validate(dto);

    const runId = randomUUID();

    const maximumIterations = this.integer(
      dto.maximumIterations ?? 8,
      1,
      12,
    );

    const populationSize = this.integer(
      dto.populationSize ?? 30,
      6,
      60,
    );

    const eliteSize = this.integer(
      dto.eliteSize ?? 6,
      2,
      12,
    );

    const thresholds: NoveltyV2Thresholds = {
      ...this.defaultThresholds,
      ...(dto.thresholds ?? {}),
    };

    const knownCompetitorPatterns = this.clean(
      dto.knownCompetitorPatterns,
    );

    const originalDna = this.extractor.extract(dto);

    let best = this.evaluator.evaluate(
      originalDna,
      originalDna,
      knownCompetitorPatterns,
      thresholds,
    );

    let elites: IdeaDna[] = [originalDna];

    const iterations: AdaptiveIteration[] = [];
    const globalFingerprints = new Set<string>([
      this.evaluator.fingerprint(originalDna),
    ]);

    let totalCandidatesGenerated = 1;
    let uniqueCandidatesEvaluated = 1;

    for (
      let iteration = 1;
      iteration <= maximumIterations;
      iteration += 1
    ) {
      const weakTargets =
        this.adaptivePlanner.identifyTargets(
          best.scores,
          thresholds,
        );

      const rawMutationCount = Math.min(
        60,
        Math.max(
          populationSize,
          populationSize +
            weakTargets.length * 4,
        ),
      );

      const mutations = this.mutationEngine.generate(
        elites,
        iteration,
        rawMutationCount,
      );

      const targetedMutations =
        this.adaptivePlanner.selectTargetedPopulation(
          mutations,
          weakTargets,
          populationSize,
        );

      const recombinations =
        this.recombinationEngine.recombine(
          targetedMutations,
          iteration,
          Math.max(
            3,
            Math.floor(populationSize / 2),
          ),
        );

      const population = [
        ...elites,
        ...targetedMutations,
        ...recombinations,
      ];

      totalCandidatesGenerated +=
        targetedMutations.length +
        recombinations.length;

      const uniquePopulation =
        this.removeDuplicateFingerprints(
          population,
        );

      for (const candidate of uniquePopulation) {
        const fingerprint =
          this.evaluator.fingerprint(candidate);

        if (!globalFingerprints.has(fingerprint)) {
          globalFingerprints.add(fingerprint);
          uniqueCandidatesEvaluated += 1;
        }
      }

      const evaluated = uniquePopulation.map(
        (candidate) =>
          this.evaluator.evaluate(
            candidate,
            originalDna,
            knownCompetitorPatterns,
            thresholds,
          ),
      );

      if (evaluated.length === 0) {
        break;
      }

      const paretoFront =
        this.buildParetoFront(evaluated);

      const rankedPareto = this.rank(
        paretoFront.length > 0
          ? paretoFront
          : evaluated,
        thresholds,
      );

      const rankedAll = this.rank(
        evaluated,
        thresholds,
      );

      best =
        rankedPareto[0] ??
        rankedAll[0] ??
        best;

      elites = this.selectElites(
        paretoFront,
        rankedAll,
        eliteSize,
        thresholds,
      ).map((candidate) =>
        this.stripEvaluation(candidate),
      );

      const accepted =
        best.acceptanceFailures.length === 0;

      iterations.push({
        iteration,
        populationSize: population.length,
        uniqueCandidates: uniquePopulation.length,
        selectedCandidateIds: elites.map(
          (candidate) => candidate.id,
        ),
        bestCandidateId: best.id,
        bestScore: best.scores.total,
        accepted,
        targetedWeakDimensions:
          this.adaptivePlanner.describeTargets(
            weakTargets,
          ),
        paretoFrontSize: paretoFront.length,
      });

      if (accepted) {
        break;
      }
    }

    const accepted =
      best.acceptanceFailures.length === 0;

    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '2.1.0',
      runId,
      status: accepted
        ? 'accepted'
        : 'best-effort',

      originalDna,
      finalProtectableIdeaDna: best,
      finalProtectableIdea:
        this.rebuilder.rebuild(best),

      thresholds,
      iterations,
      totalCandidatesGenerated,
      uniqueCandidatesEvaluated,
    };
  }

  getStatus() {
    return {
      success: true,
      engine:
        'Protectable Idea Novelty Generation Engine',
      version: '2.1.0',
      phase:
        'Adaptive Weak-Dimension Evolution',
      status: 'operational',

      architecture: {
        ideaDnaExtractor: true,
        conceptMutationEngine: true,
        dnaRecombinationEngine: true,
        adaptiveWeakDimensionTargeting: true,
        marketNoveltyGate: true,
        paretoSelection: true,
        evolutionaryElitism: true,
        duplicateCandidateSuppression: true,
        structuralNoveltyEvaluator: true,
        businessModelMutation: true,
        technologyMutation: true,
        marketMutation: true,
        distributionMutation: true,
        networkMutation: true,
        dataMoatMutation: true,
        intellectualPropertyMutation: true,
        riskMutation: true,
        ideaRebuilder: true,
      },

      defaultThresholds:
        this.defaultThresholds,
    };
  }

  private buildParetoFront(
    candidates: EvaluatedIdeaDna[],
  ): EvaluatedIdeaDna[] {
    return candidates.filter(
      (candidate, candidateIndex) =>
        !candidates.some(
          (challenger, challengerIndex) =>
            challengerIndex !== candidateIndex &&
            this.dominates(
              challenger.scores,
              candidate.scores,
            ),
        ),
    );
  }

  private dominates(
    left: DnaNoveltyScores,
    right: DnaNoveltyScores,
  ): boolean {
    const leftValues = [
      left.structuralNovelty,
      left.mechanismNovelty,
      left.businessModelNovelty,
      left.technologyNovelty,
      left.marketNovelty,
      left.networkNovelty,
      left.dataMoatStrength,
      left.ipProtectability,
      left.commercialValue,
      left.feasibility,
      left.diversity,
      100 - left.duplicateRisk,
    ];

    const rightValues = [
      right.structuralNovelty,
      right.mechanismNovelty,
      right.businessModelNovelty,
      right.technologyNovelty,
      right.marketNovelty,
      right.networkNovelty,
      right.dataMoatStrength,
      right.ipProtectability,
      right.commercialValue,
      right.feasibility,
      right.diversity,
      100 - right.duplicateRisk,
    ];

    const noWorse = leftValues.every(
      (value, index) =>
        value >= (rightValues[index] ?? 0),
    );

    const strictlyBetter = leftValues.some(
      (value, index) =>
        value > (rightValues[index] ?? 0),
    );

    return noWorse && strictlyBetter;
  }

  private selectElites(
    paretoFront: EvaluatedIdeaDna[],
    rankedAll: EvaluatedIdeaDna[],
    eliteSize: number,
    thresholds: NoveltyV2Thresholds,
  ): EvaluatedIdeaDna[] {
    const rankedPareto = this.rank(
      paretoFront,
      thresholds,
    );

    const combined = [
      ...rankedPareto,
      ...rankedAll,
    ];

    const seen = new Set<string>();
    const output: EvaluatedIdeaDna[] = [];

    for (const candidate of combined) {
      if (seen.has(candidate.id)) {
        continue;
      }

      seen.add(candidate.id);
      output.push(candidate);

      if (output.length >= eliteSize) {
        break;
      }
    }

    return output;
  }

  private rank(
    candidates: EvaluatedIdeaDna[],
    thresholds: NoveltyV2Thresholds,
  ): EvaluatedIdeaDna[] {
    return [...candidates].sort(
      (left, right) => {
        const leftPenalty =
          this.thresholdPenalty(
            left,
            thresholds,
          );

        const rightPenalty =
          this.thresholdPenalty(
            right,
            thresholds,
          );

        if (leftPenalty !== rightPenalty) {
          return leftPenalty - rightPenalty;
        }

        if (
          left.acceptanceFailures.length !==
          right.acceptanceFailures.length
        ) {
          return (
            left.acceptanceFailures.length -
            right.acceptanceFailures.length
          );
        }

        if (
          right.scores.marketNovelty !==
          left.scores.marketNovelty
        ) {
          return (
            right.scores.marketNovelty -
            left.scores.marketNovelty
          );
        }

        if (
          right.scores.total !==
          left.scores.total
        ) {
          return (
            right.scores.total -
            left.scores.total
          );
        }

        if (
          left.scores.duplicateRisk !==
          right.scores.duplicateRisk
        ) {
          return (
            left.scores.duplicateRisk -
            right.scores.duplicateRisk
          );
        }

        return (
          right.scores.diversity -
          left.scores.diversity
        );
      },
    );
  }

  private thresholdPenalty(
    candidate: EvaluatedIdeaDna,
    thresholds: NoveltyV2Thresholds,
  ): number {
    const scores = candidate.scores;

    const deficits = [
      Math.max(
        0,
        thresholds.structuralNovelty -
          scores.structuralNovelty,
      ),
      Math.max(
        0,
        thresholds.mechanismNovelty -
          scores.mechanismNovelty,
      ),
      Math.max(
        0,
        thresholds.ipProtectability -
          scores.ipProtectability,
      ),
      Math.max(
        0,
        thresholds.dataMoatStrength -
          scores.dataMoatStrength,
      ),
      Math.max(
        0,
        thresholds.commercialValue -
          scores.commercialValue,
      ),
      Math.max(
        0,
        thresholds.feasibility -
          scores.feasibility,
      ),
      Math.max(
        0,
        thresholds.marketNovelty -
          scores.marketNovelty,
      ) * 1.5,
      Math.max(
        0,
        scores.duplicateRisk -
          thresholds.maximumDuplicateRisk,
      ),
      Math.max(
        0,
        thresholds.total -
          scores.total,
      ),
    ];

    return deficits.reduce(
      (sum, value) => sum + value,
      0,
    );
  }

  private removeDuplicateFingerprints(
    population: IdeaDna[],
  ): IdeaDna[] {
    const seen = new Set<string>();
    const output: IdeaDna[] = [];

    for (const candidate of population) {
      const fingerprint =
        this.evaluator.fingerprint(candidate);

      if (seen.has(fingerprint)) {
        continue;
      }

      seen.add(fingerprint);
      output.push(candidate);
    }

    return output;
  }

  private stripEvaluation(
    evaluated: EvaluatedIdeaDna,
  ): IdeaDna {
    const {
      scores: _scores,
      weaknesses: _weaknesses,
      acceptanceFailures:
        _acceptanceFailures,
      ...idea
    } = evaluated;

    return idea;
  }

  private validate(
    dto: GenerateNoveltyV2Dto,
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
}
