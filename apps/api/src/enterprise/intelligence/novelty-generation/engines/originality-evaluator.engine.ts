import { Injectable } from '@nestjs/common';
import type {
  IdeaCandidate,
  IdeaScores,
  ScoredIdeaCandidate,
} from '../models/novelty-generation.models';

@Injectable()
export class OriginalityEvaluatorEngine {
  evaluate(
    candidate: IdeaCandidate,
    originalIdea: IdeaCandidate,
  ): ScoredIdeaCandidate {
    const candidateTokens = this.tokens(this.toText(candidate));
    const originalTokens = this.tokens(this.toText(originalIdea));

    const similarity =
      candidate.id === originalIdea.id
        ? 1
        : this.jaccard(candidateTokens, originalTokens);

    const genericPenalty = this.genericPenalty(candidateTokens);
    const differentiationStrength = Math.min(
      30,
      candidate.differentiators.length * 5,
    );
    const technologyBreadth = Math.min(
      18,
      candidate.technology.length * 3,
    );
    const multiSideBonus =
      candidate.targetUsers.length >= 2 ? 8 : 0;
    const dataMoatBonus = this.containsAny(candidateTokens, [
      'بيانات',
      'معرفة',
      'ذاكرة',
      'بصمة',
      'شبكة',
      'بروتوكول',
    ])
      ? 12
      : 0;

    const originality = this.clamp(
      35 +
        (1 - similarity) * 35 +
        differentiationStrength +
        technologyBreadth -
        genericPenalty,
    );

    const duplicateRisk = this.clamp(
      similarity * 65 + genericPenalty - differentiationStrength / 2,
    );

    const protectability = this.clamp(
      originality * 0.45 +
        differentiationStrength +
        dataMoatBonus +
        technologyBreadth * 0.6,
    );

    const commercialValue = this.clamp(
      40 +
        multiSideBonus +
        (candidate.businessModel.trim() ? 18 : 0) +
        Math.min(candidate.targetUsers.length * 6, 18) +
        dataMoatBonus,
    );

    const technicalFeasibility = this.clamp(
      82 -
        Math.max(0, candidate.technology.length - 6) * 4 +
        (candidate.solution.length >= 40 ? 8 : 0),
    );

    const innovation = this.clamp(
      originality * 0.55 +
        protectability * 0.25 +
        technologyBreadth +
        multiSideBonus,
    );

    const scores: IdeaScores = {
      originality: this.round(originality),
      duplicateRisk: this.round(duplicateRisk),
      protectability: this.round(protectability),
      commercialValue: this.round(commercialValue),
      technicalFeasibility: this.round(technicalFeasibility),
      innovation: this.round(innovation),
      total: 0,
    };

    scores.total = this.round(
      scores.originality * 0.25 +
        (100 - scores.duplicateRisk) * 0.15 +
        scores.protectability * 0.2 +
        scores.commercialValue * 0.15 +
        scores.technicalFeasibility * 0.1 +
        scores.innovation * 0.15,
    );

    return {
      ...candidate,
      scores,
      weaknesses: [],
      opportunities: [],
    };
  }

  private toText(candidate: IdeaCandidate): string {
    return [
      candidate.title,
      candidate.description,
      candidate.problem,
      candidate.solution,
      candidate.businessModel,
      ...candidate.targetUsers,
      ...candidate.technology,
      ...candidate.differentiators,
    ].join(' ');
  }

  private tokens(value: string): Set<string> {
    return new Set(
      value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .map((item) => item.trim())
        .filter((item) => item.length >= 3),
    );
  }

  private jaccard(left: Set<string>, right: Set<string>): number {
    const intersection = [...left].filter((item) =>
      right.has(item),
    ).length;

    const union = new Set([...left, ...right]).size;

    return union === 0 ? 0 : intersection / union;
  }

  private genericPenalty(tokens: Set<string>): number {
    const generic = [
      'منصة',
      'تطبيق',
      'خدمة',
      'مستخدم',
      'ذكي',
      'ذكاء',
      'اصطناعي',
      'سوق',
      'إدارة',
      'نظام',
    ];

    return Math.min(
      22,
      generic.filter((item) => tokens.has(item)).length * 2.2,
    );
  }

  private containsAny(tokens: Set<string>, values: string[]): boolean {
    return values.some((item) => tokens.has(item));
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
