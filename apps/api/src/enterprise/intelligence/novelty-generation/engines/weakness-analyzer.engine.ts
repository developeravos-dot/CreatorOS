import { Injectable } from '@nestjs/common';
import type {
  IdeaCandidate,
  ScoredIdeaCandidate,
} from '../models/novelty-generation.models';

@Injectable()
export class WeaknessAnalyzerEngine {
  analyze(candidate: IdeaCandidate): string[] {
    const weaknesses: string[] = [];
    const text = this.normalize(
      [
        candidate.title,
        candidate.description,
        candidate.problem,
        candidate.solution,
        candidate.businessModel,
        ...candidate.differentiators,
      ].join(' '),
    );

    if (candidate.description.trim().length < 80) {
      weaknesses.push('الفكرة غير موصوفة بتفصيل كافٍ.');
    }

    if (!candidate.problem.trim()) {
      weaknesses.push('المشكلة الأساسية غير محددة.');
    }

    if (!candidate.solution.trim()) {
      weaknesses.push('آلية الحل غير محددة.');
    }

    if (!candidate.businessModel.trim()) {
      weaknesses.push('نموذج الإيرادات غير محدد.');
    }

    if (candidate.targetUsers.length === 0) {
      weaknesses.push('الفئة المستهدفة غير محددة.');
    }

    if (candidate.differentiators.length < 2) {
      weaknesses.push('عناصر التميز قليلة أو قابلة للتقليد.');
    }

    const genericTerms = [
      'منصة',
      'تطبيق',
      'ذكاء اصطناعي',
      'سوق',
      'مستخدم',
      'خدمة',
      'نظام ذكي',
    ];

    const genericMatches = genericTerms.filter((term) =>
      text.includes(this.normalize(term)),
    ).length;

    if (genericMatches >= 4 && candidate.differentiators.length < 3) {
      weaknesses.push('تعتمد الفكرة على مكونات عامة دون آلية ابتكارية واضحة.');
    }

    if (candidate.technology.length === 0) {
      weaknesses.push('البنية التقنية أو آلية التنفيذ غير محددة.');
    }

    return weaknesses;
  }

  analyzeScored(candidate: ScoredIdeaCandidate): string[] {
    const weaknesses = [...this.analyze(candidate)];

    if (candidate.scores.originality < 80) {
      weaknesses.push('درجة الأصالة منخفضة.');
    }

    if (candidate.scores.duplicateRisk > 20) {
      weaknesses.push('مخاطر التشابه مع أفكار شائعة مرتفعة.');
    }

    if (candidate.scores.protectability < 75) {
      weaknesses.push('العناصر القابلة للحماية غير محددة بما يكفي.');
    }

    return [...new Set(weaknesses)];
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
