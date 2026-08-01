import { Injectable } from '@nestjs/common';
import type {
  DnaNoveltyScores,
  IdeaDna,
  IdeaDnaDimension,
  NoveltyV2Thresholds,
} from '../models/novelty-v2.models';

export interface WeakDimensionTarget {
  metric: keyof DnaNoveltyScores;
  score: number;
  threshold: number;
  gap: number;
  priority: number;
  mutationDimensions: IdeaDnaDimension[];
}

@Injectable()
export class AdaptiveMutationPlannerEngine {
  identifyTargets(
    scores: DnaNoveltyScores,
    thresholds: NoveltyV2Thresholds,
  ): WeakDimensionTarget[] {
    const targets: WeakDimensionTarget[] = [
      this.target(
        'structuralNovelty',
        scores.structuralNovelty,
        thresholds.structuralNovelty,
        [
          'problem',
          'mechanism',
          'businessModel',
          'market',
          'execution',
        ],
      ),

      this.target(
        'mechanismNovelty',
        scores.mechanismNovelty,
        thresholds.mechanismNovelty,
        [
          'mechanism',
          'technology',
          'execution',
          'riskModel',
        ],
      ),

      this.target(
        'ipProtectability',
        scores.ipProtectability,
        thresholds.ipProtectability,
        [
          'intellectualProperty',
          'technology',
          'dataMoat',
          'mechanism',
        ],
      ),

      this.target(
        'dataMoatStrength',
        scores.dataMoatStrength,
        thresholds.dataMoatStrength,
        [
          'dataMoat',
          'network',
          'technology',
        ],
      ),

      this.target(
        'commercialValue',
        scores.commercialValue,
        thresholds.commercialValue,
        [
          'businessModel',
          'valueProposition',
          'distribution',
          'market',
        ],
      ),

      this.target(
        'feasibility',
        scores.feasibility,
        thresholds.feasibility,
        [
          'execution',
          'riskModel',
          'technology',
        ],
      ),

      this.target(
        'marketNovelty',
        scores.marketNovelty,
        thresholds.marketNovelty,
        [
          'market',
          'customer',
          'distribution',
          'businessModel',
        ],
      ),
    ];

    if (
      scores.duplicateRisk >
      thresholds.maximumDuplicateRisk
    ) {
      targets.push({
        metric: 'duplicateRisk',
        score: scores.duplicateRisk,
        threshold: thresholds.maximumDuplicateRisk,
        gap:
          scores.duplicateRisk -
          thresholds.maximumDuplicateRisk,
        priority:
          100 +
          scores.duplicateRisk -
          thresholds.maximumDuplicateRisk,
        mutationDimensions: [
          'mechanism',
          'intellectualProperty',
          'market',
          'dataMoat',
        ],
      });
    }

    return targets
      .filter((target) => target.gap > 0)
      .sort(
        (left, right) =>
          right.priority - left.priority,
      );
  }

  selectTargetedPopulation(
    candidates: IdeaDna[],
    targets: WeakDimensionTarget[],
    desiredSize: number,
  ): IdeaDna[] {
    if (candidates.length <= desiredSize) {
      return candidates;
    }

    if (targets.length === 0) {
      return candidates.slice(0, desiredSize);
    }

    const priorityDimensions = new Set(
      targets
        .slice(0, 3)
        .flatMap(
          (target) => target.mutationDimensions,
        ),
    );

    const stronglyTargeted: IdeaDna[] = [];
    const complementary: IdeaDna[] = [];
    const untargeted: IdeaDna[] = [];

    for (const candidate of candidates) {
      const dimensions = new Set(
        candidate.mutationHistory
          .slice(-3)
          .map((record) => record.dimension),
      );

      const matchCount = [...dimensions].filter(
        (dimension) =>
          priorityDimensions.has(dimension),
      ).length;

      if (matchCount >= 2) {
        stronglyTargeted.push(candidate);
      } else if (matchCount === 1) {
        complementary.push(candidate);
      } else {
        untargeted.push(candidate);
      }
    }

    return this.uniqueById([
      ...stronglyTargeted,
      ...complementary,
      ...untargeted,
    ]).slice(0, desiredSize);
  }

  describeTargets(
    targets: WeakDimensionTarget[],
  ): string[] {
    return targets.slice(0, 5).map(
      (target) =>
        `${String(target.metric)}: ` +
        `${target.score} / ${target.threshold} ` +
        `(gap ${this.round(target.gap)})`,
    );
  }

  private target(
    metric: keyof DnaNoveltyScores,
    score: number,
    threshold: number,
    mutationDimensions: IdeaDnaDimension[],
  ): WeakDimensionTarget {
    const gap = Math.max(0, threshold - score);

    return {
      metric,
      score,
      threshold,
      gap,
      priority:
        gap === 0
          ? 0
          : (gap / Math.max(threshold, 1)) * 100,
      mutationDimensions,
    };
  }

  private uniqueById(
    candidates: IdeaDna[],
  ): IdeaDna[] {
    const seen = new Set<string>();
    const output: IdeaDna[] = [];

    for (const candidate of candidates) {
      if (seen.has(candidate.id)) {
        continue;
      }

      seen.add(candidate.id);
      output.push(candidate);
    }

    return output;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
