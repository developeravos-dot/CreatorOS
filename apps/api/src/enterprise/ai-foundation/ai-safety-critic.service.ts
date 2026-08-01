import { Injectable } from '@nestjs/common';
import { AiCriticResult } from './ai-semantic-critic.service';

export interface SafetyCriticInput {
  originalityEvaluation: {
    safetyPassed: boolean;
    riskFlags?: string[];
    warnings?: string[];
  };
}

@Injectable()
export class AiSafetyCriticService {
  review(input: SafetyCriticInput): AiCriticResult {
    const evaluation =
      input.originalityEvaluation;

    const riskFlags =
      evaluation.riskFlags ?? [];

    const warnings =
      evaluation.safetyPassed
        ? []
        : [
            ...(evaluation.warnings ?? []),
            ...riskFlags.map(
              (flag) =>
                `مؤشر خطورة: ${flag}`,
            ),
          ];

    return {
      passed: evaluation.safetyPassed,
      score:
        riskFlags.length === 0
          ? 100
          : Math.max(
              0,
              100 - riskFlags.length * 35,
            ),
      confidence: 95,
      reasons: [
        evaluation.safetyPassed
          ? 'لم يكتشف ناقد السلامة مخاطر مباشرة.'
          : 'اكتشف ناقد السلامة مخاطر تمنع القبول التلقائي.',
      ],
      warnings,
      recommendations:
        evaluation.safetyPassed
          ? []
          : [
              'أزل أو أعد صياغة المحتوى المرتبط بمؤشرات الخطورة.',
              'حوّل المهمة إلى المراجعة البشرية عند بقاء المخاطر.',
            ],
    };
  }
}
