import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GenerateNoveltyV2Dto } from '../dto/generate-novelty-v2.dto';
import type { IdeaDna } from '../models/novelty-v2.models';

@Injectable()
export class IdeaDnaExtractorEngine {
  extract(dto: GenerateNoveltyV2Dto): IdeaDna {
    const targetUsers = this.clean(dto.targetUsers);
    const technologies = this.clean(dto.technology);
    const differentiators = this.clean(dto.differentiators);

    const problem =
      dto.problem?.trim() ||
      `وجود قصور أو تكلفة أو صعوبة مرتبطة بالفكرة التالية: ${dto.description.trim()}`;

    const solution =
      dto.solution?.trim() ||
      dto.description.trim();

    return {
      id: randomUUID(),
      generation: 0,
      parentIds: [],
      title: dto.title.trim(),

      problem: {
        statement: problem,
        rootCause: this.inferRootCause(problem),
        urgency: 60,
      },

      customers: {
        primary: targetUsers.length > 0 ? targetUsers : ['المستخدم المستفيد'],
        secondary: [],
        beneficiaries: targetUsers.length > 0 ? targetUsers : ['السوق المستهدف'],
      },

      valueProposition: {
        outcome: solution,
        measurableValue: [
          'تقليل الوقت',
          'تقليل التكلفة',
          'زيادة إمكانية الوصول',
        ],
        unfairAdvantage: differentiators,
      },

      mechanism: {
        core: solution,
        workflow: [
          'استقبال الحاجة',
          'تحليل المدخلات',
          'تحديد أفضل إجراء',
          'تنفيذ أو تنسيق الإجراء',
          'قياس النتيجة',
        ],
        decisions: [
          'اختيار أفضل بديل',
          'ترتيب الأولويات',
          'تخصيص الموارد',
        ],
        automationLevel: technologies.length > 0 ? 55 : 35,
      },

      businessModel: {
        payer: targetUsers.slice(0, 1),
        revenueStreams: dto.businessModel
          ? [dto.businessModel.trim()]
          : ['اشتراك', 'عمولة نجاح'],
        pricingLogic: ['الدفع بحسب الاستخدام أو القيمة المحققة'],
        unitOfValue: 'نتيجة ناجحة أو معاملة مكتملة',
      },

      technology: {
        components: technologies,
        proprietaryComponents: differentiators,
        integrationPoints: [],
      },

      network: {
        actors: targetUsers,
        interactions: [],
        networkEffects: [],
      },

      dataMoat: {
        capturedData: [],
        derivedKnowledge: [],
        compoundingLoop: [],
      },

      intellectualProperty: {
        protectableMechanisms: differentiators,
        protectableProcesses: [],
        tradeSecrets: [],
        defensibility: differentiators,
      },

      execution: {
        operatingModel: ['تشغيل رقمي مركزي'],
        humanRoles: ['مالك النظام', 'المشرف'],
        autonomousRoles: [],
      },

      market: {
        initialSegment: targetUsers,
        adjacentSegments: [],
        geographicScope: ['السوق المحلي'],
      },

      distribution: {
        acquisitionChannels: ['التواصل المباشر', 'التسويق الرقمي'],
        embeddedDistribution: [],
        partnerships: [],
      },

      riskModel: {
        majorRisks: [
          'ضعف التبني',
          'صعوبة التشغيل',
          'سهولة التقليد',
        ],
        controls: [],
      },

      mutationHistory: [],
    };
  }

  private inferRootCause(problem: string): string {
    const normalized = problem.toLowerCase();

    if (
      normalized.includes('الحد الأدنى') ||
      normalized.includes('كمية')
    ) {
      return 'عدم توافق حجم الطلب الفردي مع شروط المورد أو السوق.';
    }

    if (
      normalized.includes('تكلفة') ||
      normalized.includes('سعر')
    ) {
      return 'ارتفاع تكلفة الوصول أو التنفيذ بصورة فردية.';
    }

    if (
      normalized.includes('وقت') ||
      normalized.includes('بطيء')
    ) {
      return 'اعتماد العملية على خطوات يدوية أو متفرقة.';
    }

    return 'تشتت الأطراف والبيانات والقرارات وعدم وجود آلية تنسيق موحدة.';
  }

  private clean(values?: string[]): string[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return [
      ...new Set(
        values
          .filter((value) => typeof value === 'string')
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }
}
