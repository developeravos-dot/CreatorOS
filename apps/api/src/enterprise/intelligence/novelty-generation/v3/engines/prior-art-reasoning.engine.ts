import { Injectable } from '@nestjs/common';
import type { EvaluatedIdeaDna } from '../../v2/models/novelty-v2.models';
import type { PriorArtReasoningItem } from '../models/novelty-v3.models';

@Injectable()
export class PriorArtReasoningEngine {
  analyze(
    idea: EvaluatedIdeaDna,
    patterns: string[],
  ): PriorArtReasoningItem[] {
    const normalizedPatterns =
      patterns.length > 0
        ? patterns
        : [
            'منصة شراء جماعي تقليدية تجمع المشترين للحصول على خصم',
            'سوق إلكتروني يربط الموردين بالمشترين',
            'نظام مزايدة عكسية يتيح للموردين تقديم عروض',
            'منصة إدارة مشتريات للشركات',
          ];

    const ideaElements = this.elements(idea);

    return normalizedPatterns.map((pattern) => {
      const patternTokens = this.tokens(pattern);
      const overlaps = ideaElements.filter((element) =>
        this.hasTokenOverlap(element, patternTokens),
      );

      const differences = ideaElements
        .filter((element) => !overlaps.includes(element))
        .slice(0, 8);

      const residualRisk = this.clamp(
        15 + overlaps.length * 9 - differences.length * 3,
      );

      return {
        pattern,
        overlap: overlaps,
        differences,
        residualRisk,
        designAroundSuggestions: [
          'تحديد القيود التقنية الداخلة في تكوين المجموعة بدل وصف التجميع بصورة عامة.',
          'ربط إعادة توزيع الحصص بحالة آلية واستمرار الصفقة.',
          'تحديد مدخلات ومخرجات خوارزمية توافق أعضاء المجموعة.',
          'تضمين أثر تقني قابل للقياس مثل خفض فشل الصفقات أو زمن التكوين.',
        ],
      };
    });
  }

  private elements(idea: EvaluatedIdeaDna): string[] {
    return [
      idea.mechanism.core,
      ...idea.mechanism.workflow,
      ...idea.technology.proprietaryComponents,
      ...idea.intellectualProperty.protectableMechanisms,
      ...idea.intellectualProperty.protectableProcesses,
      ...idea.dataMoat.compoundingLoop,
      ...idea.network.networkEffects,
    ].filter(Boolean);
  }

  private hasTokenOverlap(
    element: string,
    patternTokens: Set<string>,
  ): boolean {
    const elementTokens = this.tokens(element);

    let matches = 0;

    for (const token of elementTokens) {
      if (patternTokens.has(token)) {
        matches += 1;
      }
    }

    return matches >= 2;
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

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
