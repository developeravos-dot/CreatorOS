import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { IdeaCandidate } from '../models/novelty-generation.models';

@Injectable()
export class IdeaMutationEngine {
  mutate(
    source: IdeaCandidate,
    opportunities: string[],
    generation: number,
    count: number,
  ): IdeaCandidate[] {
    const strategies = [
      {
        name: 'Autonomous Network Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          solution: `${idea.solution} ويعمل عبر شبكة وكلاء ذكية تنسق العمليات تلقائيًا دون إدارة يدوية مستمرة.`,
          technology: [
            ...idea.technology,
            'شبكة وكلاء ذكاء اصطناعي',
            'محرك تنسيق ذاتي',
          ],
          differentiators: [
            ...idea.differentiators,
            'تشغيل ذاتي متعدد الوكلاء',
          ],
        }),
      },
      {
        name: 'Data Moat Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          solution: `${idea.solution} ويحوّل كل تفاعل إلى معرفة تشغيلية متراكمة تحسن القرارات المستقبلية.`,
          technology: [
            ...idea.technology,
            'رسم معرفة',
            'ذاكرة مؤسسية',
            'محرك بيانات تراكمي',
          ],
          differentiators: [
            ...idea.differentiators,
            'أصل بيانات يصعب على المنافسين نسخه',
          ],
        }),
      },
      {
        name: 'Marketplace Protocol Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          description: `${idea.description} ولا يعمل كمنصة مغلقة فقط، بل كبروتوكول يسمح للجهات الخارجية ببناء خدمات متوافقة معه.`,
          businessModel:
            idea.businessModel ||
            'رسوم معاملات، اشتراك احترافي، وترخيص واجهات النظام',
          technology: [...idea.technology, 'واجهات API', 'بروتوكول تكامل'],
          differentiators: [
            ...idea.differentiators,
            'تحويل الفكرة إلى بنية تحتية قابلة للتوسع',
          ],
        }),
      },
      {
        name: 'Reverse Assumption Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          problem: `بدلاً من انتظار المستخدم ليبحث عن الحل، يتنبأ النظام بالحاجة قبل ظهورها: ${idea.problem}`,
          solution: `يكتشف النظام الفرصة أو المشكلة مبكرًا ثم يبني الإجراء المناسب تلقائيًا. ${idea.solution}`,
          differentiators: [
            ...idea.differentiators,
            'اكتشاف استباقي قبل الطلب',
          ],
        }),
      },
      {
        name: 'Collective Intelligence Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          solution: `${idea.solution} ويجمع المشاركين في مجموعات ديناميكية لتحقيق نتيجة لا يستطيع الفرد الوصول إليها منفردًا.`,
          technology: [
            ...idea.technology,
            'مطابقة جماعية',
            'تجميع طلب ذكي',
          ],
          differentiators: [
            ...idea.differentiators,
            'قوة تفاوض جماعية ديناميكية',
          ],
        }),
      },
      {
        name: 'Outcome Economy Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          businessModel:
            'الدفع مقابل النتيجة المحققة مع مشاركة نسبة من القيمة أو التوفير الناتج',
          differentiators: [
            ...idea.differentiators,
            'نموذج إيراد مرتبط بالنتائج الفعلية',
          ],
        }),
      },
      {
        name: 'Digital Twin Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          solution: `${idea.solution} وينشئ توأمًا رقميًا يحاكي السيناريوهات قبل تنفيذ القرار الحقيقي.`,
          technology: [
            ...idea.technology,
            'توأم رقمي',
            'محرك محاكاة سيناريوهات',
          ],
          differentiators: [
            ...idea.differentiators,
            'اختبار القرار قبل تنفيذه',
          ],
        }),
      },
      {
        name: 'Cross-Domain Fusion Mutation',
        apply: (idea: IdeaCandidate): Partial<IdeaCandidate> => ({
          description: `${idea.description} ويستعير آليات من الألعاب والأسواق المالية والأنظمة اللوجستية لإدارة الحوافز والمخاطر والتوزيع.`,
          technology: [
            ...idea.technology,
            'نظرية الألعاب',
            'تسعير ديناميكي',
            'تحسين لوجستي',
          ],
          differentiators: [
            ...idea.differentiators,
            'دمج متعدد المجالات',
          ],
        }),
      },
    ];

    const output: IdeaCandidate[] = [];
    const desiredCount = Math.max(1, Math.min(count, 24));

    for (let index = 0; index < desiredCount; index += 1) {
      const strategy = strategies[index % strategies.length]!;
      const patch = strategy.apply(source);
      const opportunity =
        opportunities[index % Math.max(opportunities.length, 1)];

      output.push({
        ...source,
        ...patch,
        id: randomUUID(),
        generation,
        parentIds: [source.id],
        title: `${source.title} — ${strategy.name}`,
        description: opportunity
          ? `${patch.description ?? source.description} ${opportunity}`
          : patch.description ?? source.description,
        targetUsers: this.unique(
          patch.targetUsers ?? source.targetUsers,
        ),
        technology: this.unique(
          patch.technology ?? source.technology,
        ),
        differentiators: this.unique(
          patch.differentiators ?? source.differentiators,
        ),
        sourceStrategy: strategy.name,
      });
    }

    return output;
  }

  private unique(values: string[]): string[] {
    return [...new Set(values.map((item) => item.trim()).filter(Boolean))];
  }
}

