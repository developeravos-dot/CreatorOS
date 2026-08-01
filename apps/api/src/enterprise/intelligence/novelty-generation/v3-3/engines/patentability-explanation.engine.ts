import { Injectable } from '@nestjs/common';

import type {
  ClaimCoverageAnalysis,
  ExplainablePatentabilityReport,
  InventiveStepReasoning,
  MechanismSimilarityResult,
} from '../models/novelty-v3-3.models';

@Injectable()
export class PatentabilityExplanationEngine {
  generate(
    claimCoverage: ClaimCoverageAnalysis[],
    inventiveStep: InventiveStepReasoning[],
    similarities: MechanismSimilarityResult[],
    verifiedDocuments: number,
  ): ExplainablePatentabilityReport {
    const highRisk =
      similarities.filter(
        (result) =>
          result.verified &&
          (
            result.risk === 'high' ||
            result.risk === 'critical'
          ),
      );

    const strongMechanisms =
      inventiveStep.filter(
        (item) =>
          item.conclusion === 'strong' ||
          item.conclusion ===
            'plausible',
      );

    const weakClaims =
      claimCoverage.filter(
        (claim) =>
          claim.finalCoverageScore < 60 ||
          claim.unsupportedElements
            .length > 0,
      );

    const conclusion =
      this.conclusion(
        verifiedDocuments,
        highRisk.length,
        strongMechanisms.length,
        weakClaims.length,
      );

    return {
      overallConclusion:
        conclusion,

      noveltyExplanation: [
        verifiedDocuments === 0
          ? 'لا توجد وثائق خارجية متحققة كافية لإثبات الجدة.'
          : `تم تحليل ${verifiedDocuments} وثيقة خارجية متحققة.`,

        highRisk.length > 0
          ? `تم اكتشاف ${highRisk.length} علاقات تشابه مرتفعة مع وثائق متحققة.`
          : 'لم يتم اكتشاف تشابه مرتفع متحقق مع التركيب الكامل للآليات.',
      ],

      inventiveStepExplanation:
        inventiveStep.map(
          (item) =>
            `${item.mechanismName}: ${item.conclusion} بدرجة ${item.inventiveStepScore}%.`,
        ),

      claimSupportExplanation:
        claimCoverage.map(
          (claim) =>
            `المطالبة ${claim.claimNumber}: دعم داخلي ${claim.internalSupportCoverage}%، تميّز ${claim.distinguishingCoverage}%، والنتيجة ${claim.finalCoverageScore}%.`,
        ),

      riskExplanation: [
        ...highRisk.map(
          (result) =>
            `${result.sourceMechanismName} يتشابه بنسبة ${result.totalSimilarity}% مع ${result.targetDocumentTitle}.`,
        ),

        ...weakClaims.map(
          (claim) =>
            `المطالبة ${claim.claimNumber} تحتوي على ${claim.unsupportedElements.length} عناصر غير مدعومة.`,
        ),
      ],

      strongestProtectableElements:
        this.strongestElements(
          inventiveStep,
        ),

      weakestElements:
        this.weakestElements(
          claimCoverage,
          similarities,
        ),

      designAroundRecommendations:
        this.designAround(
          similarities,
          inventiveStep,
        ),

      evidenceRequired:
        this.evidenceRequired(
          verifiedDocuments,
          weakClaims.length,
        ),
    };
  }

  private conclusion(
    verifiedDocuments: number,
    highRiskCount: number,
    strongMechanismCount: number,
    weakClaimCount: number,
  ): ExplainablePatentabilityReport['overallConclusion'] {
    if (verifiedDocuments === 0) {
      return 'insufficient-evidence';
    }

    if (highRiskCount > 0) {
      return 'high-prior-art-risk';
    }

    if (
      strongMechanismCount >= 2 &&
      weakClaimCount === 0
    ) {
      return 'strong-provisional-case';
    }

    return 'potentially-distinguishable';
  }

  private strongestElements(
    inventiveStep: InventiveStepReasoning[],
  ): string[] {
    return inventiveStep
      .filter(
        (item) =>
          item.inventiveStepScore >=
          65,
      )
      .flatMap((item) => [
        item.mechanismName,
        ...item.differences.slice(
          0,
          3,
        ),
        ...item.technicalEffects.slice(
          0,
          2,
        ),
      ])
      .filter(Boolean)
      .slice(0, 20);
  }

  private weakestElements(
    claims: ClaimCoverageAnalysis[],
    similarities: MechanismSimilarityResult[],
  ): string[] {
    return [
      ...claims.flatMap(
        (claim) =>
          claim.unsupportedElements,
      ),

      ...similarities
        .filter(
          (item) =>
            item.risk === 'high' ||
            item.risk === 'critical',
        )
        .flatMap(
          (item) =>
            item.sharedElements,
        ),
    ]
      .filter(Boolean)
      .slice(0, 20);
  }

  private designAround(
    similarities: MechanismSimilarityResult[],
    inventiveStep: InventiveStepReasoning[],
  ): string[] {
    const recommendations: string[] = [];

    for (const result of similarities) {
      if (
        result.risk === 'high' ||
        result.risk === 'critical'
      ) {
        recommendations.push(
          `أعد صياغة آلية ${result.sourceMechanismName} حول العناصر المميزة: ${result.distinguishingElements.slice(0, 4).join('، ')}.`,
        );
      }
    }

    for (const item of inventiveStep) {
      if (
        item.conclusion === 'weak' ||
        item.conclusion === 'uncertain'
      ) {
        recommendations.push(
          `أضف قيودًا تقنية محددة ومدخلات ومخرجات قابلة للقياس إلى ${item.mechanismName}.`,
        );
      }
    }

    return [
      ...new Set(
        recommendations,
      ),
    ];
  }

  private evidenceRequired(
    verifiedDocuments: number,
    weakClaims: number,
  ): string[] {
    const output = [
      'مخططات تدفق تفصيلية للآليات الأساسية.',
      'تعريف رسمي لمدخلات ومخرجات كل محرك.',
      'نتائج اختبار تثبت الأثر التقني.',
    ];

    if (verifiedDocuments < 5) {
      output.push(
        'خمس وثائق براءات خارجية متحققة على الأقل.',
      );
    }

    if (weakClaims > 0) {
      output.push(
        'دعم وصفي وتقني لكل عنصر غير مدعوم في المطالبات.',
      );
    }

    return output;
  }
}
