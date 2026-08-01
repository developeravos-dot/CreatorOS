import { Injectable } from '@nestjs/common';
import type {
  DnaNoveltyScores,
  EvaluatedIdeaDna,
  IdeaDna,
  NoveltyV2Thresholds,
} from '../models/novelty-v2.models';

@Injectable()
export class DnaNoveltyEvaluatorEngine {
  evaluate(
    candidate: IdeaDna,
    original: IdeaDna,
    knownCompetitorPatterns: string[],
    thresholds: NoveltyV2Thresholds,
  ): EvaluatedIdeaDna {
    const structuralDistance = this.structuralDistance(
      candidate,
      original,
    );

    const mechanismRichness =
      candidate.mechanism.workflow.length * 4 +
      candidate.mechanism.decisions.length * 3 +
      candidate.mechanism.automationLevel * 0.3;

    const businessDistinctiveness =
      candidate.businessModel.revenueStreams.length * 10 +
      candidate.businessModel.pricingLogic.length * 8 +
      candidate.businessModel.payer.length * 4;

    const technologyDepth =
      candidate.technology.proprietaryComponents.length * 12 +
      candidate.technology.integrationPoints.length * 4 +
      candidate.execution.autonomousRoles.length * 6;

    const networkStrength =
      candidate.network.networkEffects.length * 18 +
      candidate.network.interactions.length * 5 +
      candidate.network.actors.length * 2;

    const dataMoatStrength =
      candidate.dataMoat.capturedData.length * 10 +
      candidate.dataMoat.derivedKnowledge.length * 12 +
      candidate.dataMoat.compoundingLoop.length * 22;

    const ipStrength =
      candidate.intellectualProperty.protectableMechanisms.length * 14 +
      candidate.intellectualProperty.protectableProcesses.length * 12 +
      candidate.intellectualProperty.tradeSecrets.length * 10 +
      candidate.intellectualProperty.defensibility.length * 6;

    const commercialStrength =
      candidate.valueProposition.measurableValue.length * 7 +
      candidate.businessModel.revenueStreams.length * 8 +
      candidate.distribution.embeddedDistribution.length * 7 +
      candidate.distribution.partnerships.length * 4 +
      candidate.market.adjacentSegments.length * 3;

    const complexity =
      candidate.technology.proprietaryComponents.length +
      candidate.execution.autonomousRoles.length +
      candidate.network.actors.length +
      candidate.mechanism.workflow.length;

    const controlCoverage =
      candidate.riskModel.controls.length * 7;

    const feasibility =
      90 -
      Math.max(0, complexity - 22) * 2.2 +
      controlCoverage;

    const competitorRisk = this.competitorSimilarityRisk(
      candidate,
      knownCompetitorPatterns,
    );

    const genericRisk = this.genericPatternRisk(candidate);

    const duplicateRisk =
      competitorRisk * 0.65 +
      genericRisk * 0.35;

    const diversity = this.dimensionDiversity(candidate);

    const scores: DnaNoveltyScores = {
      structuralNovelty: this.clamp(
        35 + structuralDistance * 65,
      ),

      mechanismNovelty: this.clamp(
        25 +
          mechanismRichness +
          candidate.network.interactions.length * 5,
      ),

      businessModelNovelty: this.clamp(
        25 + businessDistinctiveness,
      ),

      technologyNovelty: this.clamp(
        20 + technologyDepth,
      ),

      marketNovelty: this.clamp(
        35 +
          candidate.market.adjacentSegments.length * 8 +
          candidate.distribution.embeddedDistribution.length * 7,
      ),

      networkNovelty: this.clamp(
        25 + networkStrength,
      ),

      dataMoatStrength: this.clamp(
        15 + dataMoatStrength,
      ),

      ipProtectability: this.clamp(
        18 + ipStrength,
      ),

      commercialValue: this.clamp(
        35 + commercialStrength,
      ),

      feasibility: this.clamp(feasibility),

      duplicateRisk: this.clamp(duplicateRisk),

      diversity: this.clamp(diversity),

      total: 0,
    };

    scores.total = this.round(
      scores.structuralNovelty * 0.13 +
        scores.mechanismNovelty * 0.12 +
        scores.businessModelNovelty * 0.08 +
        scores.technologyNovelty * 0.08 +
        scores.marketNovelty * 0.05 +
        scores.networkNovelty * 0.08 +
        scores.dataMoatStrength * 0.12 +
        scores.ipProtectability * 0.15 +
        scores.commercialValue * 0.08 +
        scores.feasibility * 0.06 +
        (100 - scores.duplicateRisk) * 0.03 +
        scores.diversity * 0.02,
    );

    const weaknesses = this.detectWeaknesses(scores);
    const acceptanceFailures =
      this.acceptanceFailures(scores, thresholds);

    return {
      ...candidate,
      scores: this.roundScores(scores),
      weaknesses,
      acceptanceFailures,
    };
  }

  fingerprint(candidate: IdeaDna): string {
    const dimensions = [
      candidate.problem.rootCause,
      candidate.mechanism.core,
      ...candidate.mechanism.workflow,
      ...candidate.businessModel.revenueStreams,
      ...candidate.technology.proprietaryComponents,
      ...candidate.network.networkEffects,
      ...candidate.dataMoat.derivedKnowledge,
      ...candidate.intellectualProperty.protectableMechanisms,
      ...candidate.execution.autonomousRoles,
    ];

    return [...new Set(this.tokens(dimensions.join(' ')))]
      .sort()
      .join('|');
  }

  private structuralDistance(
    candidate: IdeaDna,
    original: IdeaDna,
  ): number {
    const candidateDimensions = this.dimensionSets(candidate);
    const originalDimensions = this.dimensionSets(original);

    let totalDistance = 0;

    for (let index = 0; index < candidateDimensions.length; index += 1) {
      const left = candidateDimensions[index] ?? new Set<string>();
      const right = originalDimensions[index] ?? new Set<string>();

      totalDistance += 1 - this.jaccard(left, right);
    }

    return candidateDimensions.length === 0
      ? 0
      : totalDistance / candidateDimensions.length;
  }

  private dimensionSets(idea: IdeaDna): Set<string>[] {
    return [
      this.tokenSet(
        `${idea.problem.statement} ${idea.problem.rootCause}`,
      ),
      this.tokenSet(
        `${idea.mechanism.core} ${idea.mechanism.workflow.join(' ')}`,
      ),
      this.tokenSet(
        idea.businessModel.revenueStreams.join(' '),
      ),
      this.tokenSet(
        idea.technology.proprietaryComponents.join(' '),
      ),
      this.tokenSet(
        idea.network.networkEffects.join(' '),
      ),
      this.tokenSet(
        idea.dataMoat.derivedKnowledge.join(' '),
      ),
      this.tokenSet(
        idea.intellectualProperty.protectableMechanisms.join(' '),
      ),
      this.tokenSet(
        idea.execution.autonomousRoles.join(' '),
      ),
      this.tokenSet(
        idea.market.adjacentSegments.join(' '),
      ),
    ];
  }

  private competitorSimilarityRisk(
    candidate: IdeaDna,
    patterns: string[],
  ): number {
    if (patterns.length === 0) {
      return 20;
    }

    const candidateSet = this.tokenSet(
      [
        candidate.problem.statement,
        candidate.mechanism.core,
        ...candidate.mechanism.workflow,
        ...candidate.businessModel.revenueStreams,
        ...candidate.technology.proprietaryComponents,
      ].join(' '),
    );

    let highest = 0;

    for (const pattern of patterns) {
      const similarity = this.jaccard(
        candidateSet,
        this.tokenSet(pattern),
      );

      highest = Math.max(highest, similarity);
    }

    return highest * 100;
  }

  private genericPatternRisk(candidate: IdeaDna): number {
    const text = [
      candidate.mechanism.core,
      ...candidate.businessModel.revenueStreams,
      ...candidate.technology.components,
    ].join(' ');

    const genericTerms = [
      'منصة',
      'تطبيق',
      'اشتراك',
      'عمولة',
      'ذكاء اصطناعي',
      'مطابقة',
      'سوق',
    ];

    const matches = genericTerms.filter((term) =>
      text.includes(term),
    ).length;

    const protectionOffset =
      candidate.intellectualProperty.protectableMechanisms.length * 5 +
      candidate.dataMoat.compoundingLoop.length * 8 +
      candidate.network.networkEffects.length * 5;

    return this.clamp(
      25 + matches * 8 - protectionOffset,
    );
  }

  private dimensionDiversity(candidate: IdeaDna): number {
    const changedDimensions = new Set(
      candidate.mutationHistory.map(
        (record) => record.dimension,
      ),
    ).size;

    return changedDimensions * 9;
  }

  private detectWeaknesses(
    scores: DnaNoveltyScores,
  ): string[] {
    const output: string[] = [];

    if (scores.structuralNovelty < 70) {
      output.push('الاختلاف البنيوي عن الفكرة الأصلية ما زال محدودًا.');
    }

    if (scores.mechanismNovelty < 75) {
      output.push('آلية التشغيل تحتاج إلى ابتكار إضافي.');
    }

    if (scores.dataMoatStrength < 70) {
      output.push('ميزة البيانات التراكمية غير كافية.');
    }

    if (scores.ipProtectability < 75) {
      output.push('العناصر التقنية أو الإجرائية القابلة للحماية غير كافية.');
    }

    if (scores.duplicateRisk > 25) {
      output.push('مخاطر التشابه مع الأنماط المعروفة مرتفعة.');
    }

    if (scores.feasibility < 65) {
      output.push('التعقيد التشغيلي أو التقني مرتفع.');
    }

    return output;
  }

  private acceptanceFailures(
    scores: DnaNoveltyScores,
    thresholds: NoveltyV2Thresholds,
  ): string[] {
    const output: string[] = [];

    if (
      scores.structuralNovelty <
      thresholds.structuralNovelty
    ) {
      output.push('structuralNovelty');
    }

    if (
      scores.mechanismNovelty <
      thresholds.mechanismNovelty
    ) {
      output.push('mechanismNovelty');
    }

    if (
      scores.ipProtectability <
      thresholds.ipProtectability
    ) {
      output.push('ipProtectability');
    }

    if (
      scores.dataMoatStrength <
      thresholds.dataMoatStrength
    ) {
      output.push('dataMoatStrength');
    }

    if (
      scores.commercialValue <
      thresholds.commercialValue
    ) {
      output.push('commercialValue');
    }

    if (scores.feasibility < thresholds.feasibility) {
      output.push('feasibility');
    }

    if (
      scores.duplicateRisk >
      thresholds.maximumDuplicateRisk
    ) {
      output.push('duplicateRisk');
    }

    if (
      scores.marketNovelty <
      thresholds.marketNovelty
    ) {
      output.push('marketNovelty');
    }

    if (scores.total < thresholds.total) {
      output.push('total');
    }

    return output;
  }

  private tokenSet(value: string): Set<string> {
    return new Set(this.tokens(value));
  }

  private tokens(value: string): string[] {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 3);
  }

  private jaccard(
    left: Set<string>,
    right: Set<string>,
  ): number {
    const union = new Set([
      ...left,
      ...right,
    ]);

    if (union.size === 0) {
      return 0;
    }

    let intersection = 0;

    for (const value of left) {
      if (right.has(value)) {
        intersection += 1;
      }
    }

    return intersection / union.size;
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private roundScores(
    scores: DnaNoveltyScores,
  ): DnaNoveltyScores {
    return {
      structuralNovelty: this.round(scores.structuralNovelty),
      mechanismNovelty: this.round(scores.mechanismNovelty),
      businessModelNovelty: this.round(
        scores.businessModelNovelty,
      ),
      technologyNovelty: this.round(
        scores.technologyNovelty,
      ),
      marketNovelty: this.round(scores.marketNovelty),
      networkNovelty: this.round(scores.networkNovelty),
      dataMoatStrength: this.round(scores.dataMoatStrength),
      ipProtectability: this.round(scores.ipProtectability),
      commercialValue: this.round(scores.commercialValue),
      feasibility: this.round(scores.feasibility),
      duplicateRisk: this.round(scores.duplicateRisk),
      diversity: this.round(scores.diversity),
      total: this.round(scores.total),
    };
  }
}

