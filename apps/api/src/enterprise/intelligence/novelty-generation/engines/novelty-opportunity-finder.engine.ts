import { Injectable } from '@nestjs/common';
import type { IdeaCandidate } from '../models/novelty-generation.models';

@Injectable()
export class NoveltyOpportunityFinderEngine {
  find(candidate: IdeaCandidate, weaknesses: string[]): string[] {
    const opportunities: string[] = [];

    if (candidate.targetUsers.length <= 1) {
      opportunities.push(
        'إنشاء شبكة متعددة الأطراف تربط المستخدم والمورد والشريك التشغيلي.',
      );
    }

    if (!candidate.businessModel.trim()) {
      opportunities.push(
        'تحويل القيمة الناتجة إلى اشتراك أو عمولة نجاح أو ترخيص تقني.',
      );
    }

    if (!candidate.technology.some((item) => item.includes('بيانات'))) {
      opportunities.push(
        'بناء أصل بيانات تراكمي يصبح أكثر قيمة وصعوبة في التقليد مع الاستخدام.',
      );
    }

    if (!candidate.technology.some((item) => item.includes('شبكة'))) {
      opportunities.push(
        'إضافة تأثير شبكة يجعل الخدمة أقوى كلما زاد عدد المشاركين.',
      );
    }

    if (
      !candidate.differentiators.some(
        (item) =>
          item.includes('تلقائ') ||
          item.includes('ذاتي') ||
          item.includes('تكيف'),
      )
    ) {
      opportunities.push(
        'إضافة محرك تكيف ذاتي يتعلم من النتائج ويعدل آلية التشغيل.',
      );
    }

    opportunities.push(
      'تحويل الفكرة من أداة منفردة إلى بروتوكول أو بنية تحتية يمكن للآخرين البناء فوقها.',
    );

    opportunities.push(
      'إنشاء هوية أو بصمة تشغيلية فريدة لكل فكرة أو مستخدم أو معاملة.',
    );

    if (weaknesses.length > 0) {
      opportunities.push(
        `إعادة تصميم الفكرة لمعالجة ${weaknesses.length} نقاط ضعف مكتشفة آليًا.`,
      );
    }

    return [...new Set(opportunities)];
  }
}
