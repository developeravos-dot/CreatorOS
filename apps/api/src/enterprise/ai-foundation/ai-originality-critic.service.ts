import { Injectable } from '@nestjs/common';
import { AiCriticResult } from './ai-semantic-critic.service';

export interface OriginalityCriticInput {
  originalityEvaluation: {
    passed: boolean;
    originalityPassed: boolean;
    originalityScore: number;
    duplicationScore: number;
    distinctItemCount: number;
    detectedItemCount: number;
    genericContentDetected: boolean;
    duplicatedPairs?: Array<{
      firstItem: number;
      secondItem: number;
      similarity: number;
    }>;
    genericItems?: number[];
    warnings?: string[];
    reasons?: string[];
  };
}

@Injectable()
export class AiOriginalityCriticService {
  review(input: OriginalityCriticInput): AiCriticResult {
    const evaluation =
      input.originalityEvaluation;

    const warnings = [
      ...(evaluation.warnings ?? []),
    ];

    const recommendations: string[] = [];

    if (evaluation.duplicationScore > 30) {
      recommendations.push(
        'استبدل الأفكار المتشابهة بأفكار مختلفة في الموضوع والآلية والجمهور.',
      );
    }

    if (evaluation.genericContentDetected) {
      recommendations.push(
        'أضف آلية تنفيذ واضحة وميزة تنافسية محددة لكل عنصر.',
      );
    }

    if (
      evaluation.distinctItemCount <
      evaluation.detectedItemCount
    ) {
      recommendations.push(
        'ارفع عدد العناصر المستقلة فعليًا لتطابق العدد المطلوب.',
      );
    }

    return {
      passed: evaluation.originalityPassed,
      score: evaluation.originalityScore,
      confidence: Math.max(
        50,
        Math.min(
          100,
          100 - evaluation.duplicationScore,
        ),
      ),
      reasons:
        evaluation.reasons?.length
          ? evaluation.reasons
          : [
              evaluation.originalityPassed
                ? 'المحتوى يحقق مستوى الأصالة المطلوب.'
                : 'المحتوى يحتاج إلى تنوع وأصالة أكبر.',
            ],
      warnings,
      recommendations,
    };
  }
}
