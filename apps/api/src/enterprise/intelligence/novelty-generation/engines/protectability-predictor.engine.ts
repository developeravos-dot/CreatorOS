import { Injectable } from '@nestjs/common';
import type {
  NoveltyGenerationThresholds,
  ScoredIdeaCandidate,
} from '../models/novelty-generation.models';

@Injectable()
export class ProtectabilityPredictorEngine {
  satisfies(
    candidate: ScoredIdeaCandidate,
    thresholds: NoveltyGenerationThresholds,
  ): boolean {
    return (
      candidate.scores.originality >= thresholds.originality &&
      candidate.scores.duplicateRisk <=
        thresholds.maximumDuplicateRisk &&
      candidate.scores.protectability >=
        thresholds.protectability &&
      candidate.scores.commercialValue >=
        thresholds.commercialValue &&
      candidate.scores.technicalFeasibility >=
        thresholds.technicalFeasibility &&
      candidate.scores.innovation >= thresholds.innovation
    );
  }

  rank(candidates: ScoredIdeaCandidate[]): ScoredIdeaCandidate[] {
    return [...candidates].sort((left, right) => {
      if (right.scores.total !== left.scores.total) {
        return right.scores.total - left.scores.total;
      }

      if (
        right.scores.originality !== left.scores.originality
      ) {
        return (
          right.scores.originality -
          left.scores.originality
        );
      }

      return (
        left.scores.duplicateRisk -
        right.scores.duplicateRisk
      );
    });
  }
}
