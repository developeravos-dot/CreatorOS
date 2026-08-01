import { Injectable } from '@nestjs/common';
import { AiCriticResult } from './ai-semantic-critic.service';

export interface DomainExpertInput {
  taskType: string;
  request: string;
  content: string;
}

@Injectable()
export class AiDomainExpertService {
  review(input: DomainExpertInput): AiCriticResult {
    const content =
      input.content?.trim() ?? '';

    const request =
      input.request?.trim() ?? '';

    const warnings: string[] = [];
    const recommendations: string[] = [];
    const reasons: string[] = [];

    const hasContent =
      content.length >= 80;

    const hasUnsupportedCertainty =
      /(مضمون بنسبة 100|مؤكد تمامًا|لا يمكن أن يفشل|نتيجة مضمونة|دون أي مخاطر)/i.test(
        content,
      );

    const hasPracticalMechanism =
      /(كيف|خطوات|آلية|نظام|محرك|تحليل|اختبار|مقارنة|تنفيذ|تطبيق|قياس|تجربة|استراتيجية)/i.test(
        content,
      );

    const requestKeywords = request
      .toLowerCase()
      .replace(
        /[^\p{L}\p{N}\s]/gu,
        ' ',
      )
      .split(/\s+/)
      .filter(
        (token) => token.length >= 4,
      );

    const normalizedContent =
      content.toLowerCase();

    const coveredKeywords =
      requestKeywords.filter(
        (token) =>
          normalizedContent.includes(token),
      );

    const coverage =
      requestKeywords.length > 0
        ? coveredKeywords.length /
          requestKeywords.length
        : 1;

    let score = 100;

    if (!hasContent) {
      score -= 50;
      warnings.push(
        'المحتوى قصير ولا يسمح بمراجعة تخصصية كافية.',
      );
    }

    if (!hasPracticalMechanism) {
      score -= 20;
      warnings.push(
        'المحتوى يفتقر إلى آلية أو تطبيق عملي واضح.',
      );

      recommendations.push(
        'أضف طريقة تنفيذ أو مثالًا عمليًا لكل اقتراح رئيسي.',
      );
    }

    if (coverage < 0.25) {
      score -= 25;
      warnings.push(
        'تغطية المصطلحات الأساسية في الطلب منخفضة.',
      );

      recommendations.push(
        'اربط الإجابة بصورة أوضح بموضوع المستخدم ومتطلباته الأساسية.',
      );
    }

    if (hasUnsupportedCertainty) {
      score -= 30;
      warnings.push(
        'تم اكتشاف ادعاء قطعي أو ضمان غير مدعوم.',
      );

      recommendations.push(
        'استبدل الادعاءات القطعية بصياغة دقيقة ومشروطة.',
      );
    }

    score = Math.max(
      0,
      Math.min(100, score),
    );

    const passed =
      score >= 70 &&
      !hasUnsupportedCertainty;

    reasons.push(
      passed
        ? 'المحتوى مناسب مبدئيًا للمجال ويحتوي على قيمة قابلة للاستخدام.'
        : 'المحتوى يحتاج إلى مراجعة تخصصية أو تفاصيل عملية إضافية.',
    );

    return {
      passed,
      score,
      confidence:
        requestKeywords.length >= 3
          ? 85
          : 70,
      reasons,
      warnings,
      recommendations,
    };
  }
}
