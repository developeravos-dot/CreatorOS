import { Injectable } from '@nestjs/common';

import type {
  InventiveStepReasoning,
  MechanismSignature,
  MechanismSimilarityResult,
} from '../models/novelty-v3-3.models';

@Injectable()
export class InventiveStepReasoningEngine {
  analyze(
    mechanisms: MechanismSignature[],
    similarities: MechanismSimilarityResult[],
  ): InventiveStepReasoning[] {
    return mechanisms.map((mechanism) => {
      const related = similarities
        .filter(
          (result) =>
            result.sourceMechanismId ===
            mechanism.mechanismId,
        )
        .sort(
          (left, right) =>
            right.totalSimilarity -
            left.totalSimilarity,
        );

      const closestDocuments =
        related.slice(0, 5).map(
          (result) => ({
            documentId:
              result.targetDocumentId,
            title:
              result.targetDocumentTitle,
            publicationNumber:
              result.publicationNumber,
            similarity:
              result.totalSimilarity,
            verified:
              result.verified,
          }),
        );

      const distinguishingElements = [
        ...new Set(
          related
            .slice(0, 5)
            .flatMap(
              (result) =>
                result.distinguishingElements,
            ),
        ),
      ];

      const highestSimilarity =
        related[0]?.totalSimilarity ?? 0;

      const verifiedHighRisk =
        related.some(
          (result) =>
            result.verified &&
            (
              result.risk === 'high' ||
              result.risk === 'critical'
            ),
        );

      const obviousCombinationRisk =
        this.clamp(
          highestSimilarity * 0.55 +
          Math.max(
            0,
            60 -
              distinguishingElements.length *
                7,
          ) *
            0.45,
        );

      const inventiveStepScore =
        this.clamp(
          100 -
          obviousCombinationRisk +
          Math.min(
            distinguishingElements.length *
              4,
            24,
          ),
        );

      return {
        mechanismId:
          mechanism.mechanismId,
        mechanismName:
          mechanism.name,

        closestDocuments,
        differences:
          distinguishingElements,

        technicalEffects:
          mechanism.technicalEffects,

        objectiveTechnicalProblem:
          mechanism.problem ||
          `كيفية تنفيذ ${mechanism.name} بطريقة تحقق أثرًا تقنيًا مميزًا.`,

        obviousCombinationRisk:
          this.round(
            obviousCombinationRisk,
          ),

        inventiveStepScore:
          this.round(
            inventiveStepScore,
          ),

        conclusion:
          this.conclusion(
            inventiveStepScore,
            verifiedHighRisk,
          ),

        explanation:
          this.explanation(
            mechanism,
            highestSimilarity,
            distinguishingElements,
            verifiedHighRisk,
          ),
      };
    });
  }

  private explanation(
    mechanism: MechanismSignature,
    highestSimilarity: number,
    differences: string[],
    verifiedHighRisk: boolean,
  ): string[] {
    const output = [
      `أعلى تشابه مرصود للآلية ${mechanism.name}: ${this.round(highestSimilarity)}%.`,
      `عدد العناصر المميزة المرصودة: ${differences.length}.`,
    ];

    if (verifiedHighRisk) {
      output.push(
        'تم العثور على وثيقة متحققة ذات تشابه مرتفع، لذلك يلزم تضييق جوهر الآلية.',
      );
    } else {
      output.push(
        'لا توجد حاليًا وثيقة متحققة تثبت أن التركيب الكامل للآلية معروف.',
      );
    }

    if (
      mechanism.technicalEffects.length >
      0
    ) {
      output.push(
        `الأثر التقني المدعى: ${mechanism.technicalEffects.join('، ')}.`,
      );
    }

    return output;
  }

  private conclusion(
    score: number,
    verifiedHighRisk: boolean,
  ): InventiveStepReasoning['conclusion'] {
    if (
      verifiedHighRisk ||
      score < 40
    ) {
      return 'weak';
    }

    if (score < 60) {
      return 'uncertain';
    }

    if (score < 80) {
      return 'plausible';
    }

    return 'strong';
  }

  private clamp(value: number): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
