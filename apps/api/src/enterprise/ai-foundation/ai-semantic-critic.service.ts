import { Injectable } from '@nestjs/common';

export interface AiCriticResult {
  passed: boolean;
  score: number;
  confidence: number;
  reasons: string[];
  warnings: string[];
  recommendations: string[];
  metadata?: Record<string, unknown>;
}

export interface SemanticCriticInput {
  semanticValidation: {
    passed: boolean;
    confidence?: number;
    everyItemSatisfiesCoreRequirement?: boolean;
    structureValid?: boolean;
    languageValid?: boolean;
    missingRequirements?: string[];
    reasons?: string[];
  };
}

@Injectable()
export class AiSemanticCriticService {
  review(input: SemanticCriticInput): AiCriticResult {
    const validation = input.semanticValidation;

    const missingRequirements =
      validation.missingRequirements ?? [];

    const reasons = [
      ...(validation.reasons ?? []),
    ];

    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (missingRequirements.length > 0) {
      warnings.push(
        ...missingRequirements.map(
          (requirement) =>
            `متطلب مفقود: ${requirement}`,
        ),
      );

      recommendations.push(
        'غطِّ جميع المتطلبات المفقودة بصورة صريحة.',
      );
    }

    if (validation.structureValid === false) {
      warnings.push(
        'بنية الإجابة لا تحقق الشكل المطلوب.',
      );

      recommendations.push(
        'أعد تنظيم المحتوى إلى عناصر مستقلة وواضحة.',
      );
    }

    if (validation.languageValid === false) {
      warnings.push(
        'لغة الإجابة لا تطابق اللغة المطلوبة.',
      );

      recommendations.push(
        'أعد كتابة الإجابة باللغة المطلوبة.',
      );
    }

    const score = Math.max(
      0,
      Math.min(
        100,
        validation.passed
          ? validation.confidence ?? 90
          : validation.confidence ?? 40,
      ),
    );

    return {
      passed: validation.passed,
      score,
      confidence:
        validation.confidence ?? score,
      reasons:
        reasons.length > 0
          ? reasons
          : [
              validation.passed
                ? 'المحتوى يحقق المتطلبات الدلالية.'
                : 'المحتوى لا يحقق جميع المتطلبات الدلالية.',
            ],
      warnings,
      recommendations,
      metadata: {
        missingRequirements,
        structureValid:
          validation.structureValid ?? true,
        languageValid:
          validation.languageValid ?? true,
      },
    };
  }
}
