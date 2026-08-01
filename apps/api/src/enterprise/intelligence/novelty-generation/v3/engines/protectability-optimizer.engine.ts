import { Injectable } from '@nestjs/common';
import type { EvaluatedIdeaDna } from '../../v2/models/novelty-v2.models';
import type {
  InventiveMechanism,
  PriorArtReasoningItem,
  ProtectabilityOptimization,
} from '../models/novelty-v3.models';

@Injectable()
export class ProtectabilityOptimizerEngine {
  optimize(
    idea: EvaluatedIdeaDna,
    mechanisms: InventiveMechanism[],
    priorArt: PriorArtReasoningItem[],
  ): ProtectabilityOptimization {
    const strengthenedElements = mechanisms.flatMap(
      (mechanism) => [
        mechanism.name,
        mechanism.mechanism,
        mechanism.technicalEffect,
      ],
    );

    const averageRisk =
      priorArt.length === 0
        ? 20
        : priorArt.reduce(
            (sum, item) => sum + item.residualRisk,
            0,
          ) / priorArt.length;

    const specificityBonus = Math.min(
      22,
      mechanisms.reduce(
        (sum, mechanism) =>
          sum +
          mechanism.inputs.length +
          mechanism.processingSteps.length +
          mechanism.outputs.length,
        0,
      ) * 0.35,
    );

    const afterScore = this.clamp(
      idea.scores.ipProtectability * 0.65 +
        specificityBonus +
        (100 - averageRisk) * 0.2,
    );

    return {
      beforeScore: idea.scores.ipProtectability,
      afterScore: this.round(afterScore),
      strengthenedElements: [
        ...new Set(strengthenedElements),
      ],
      remainingRisks:
        averageRisk > 30
          ? [
              'يلزم بحث فني سابق خارجي أوسع.',
              'بعض العناصر قد تكون معروفة إذا صيغت بصورة عامة.',
            ]
          : [
              'الدرجات تقديرية ولا تثبت الجدة القانونية.',
              'يلزم التحقق من البراءات والمنشورات الفعلية.',
            ],
      recommendedEvidence: [
        'مخطط تدفق تقني لكل آلية.',
        'تعريف رسمي للمدخلات والمخرجات.',
        'نتائج محاكاة أو اختبار تبين الأثر التقني.',
        'سجل زمني لتطور الفكرة.',
        'أمثلة تنفيذ متعددة.',
      ],
    };
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
