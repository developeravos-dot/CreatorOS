import { Injectable } from '@nestjs/common';
import type { EvaluatedIdeaDna } from '../../v2/models/novelty-v2.models';
import type { CrossIndustryTransfer } from '../models/novelty-v3.models';

@Injectable()
export class CrossIndustryTransferEngine {
  transfer(
    idea: EvaluatedIdeaDna,
    preferredIndustries: string[],
    maximumTransfers: number,
  ): CrossIndustryTransfer[] {
    const library: CrossIndustryTransfer[] = [
      {
        sourceIndustry: 'الأسواق المالية',
        sourceMechanism:
          'دفتر الأوامر وتجميع السيولة والمزاد المستمر.',
        transferredMechanism:
          'دفتر طلب جماعي يعرض الكميات والأسعار والمهل دون كشف هوية كل تاجر للمورد.',
        noveltyReason:
          'ينقل مفهوم تجميع السيولة إلى تجميع الطلب التجاري المبعثر.',
        implementationElements: [
          'Demand Order Book',
          'price bands',
          'conditional commitments',
          'clearing event',
        ],
      },
      {
        sourceIndustry: 'شركات الطيران',
        sourceMechanism:
          'إدارة العائد والتسعير الديناميكي بحسب السعة والوقت.',
        transferredMechanism:
          'تسعير الحصة داخل المجموعة بحسب توقيت الانضمام ومرونة التسليم وقيمة الالتزام.',
        noveltyReason:
          'يحوّل المجموعة من تقسيم متساوٍ إلى تخصيص وتسعير متعدد القيود.',
        implementationElements: [
          'capacity pricing',
          'time-based incentives',
          'commitment scoring',
        ],
      },
      {
        sourceIndustry: 'الحوسبة السحابية',
        sourceMechanism:
          'تجميع الموارد وتخصيصها ديناميكيًا عند الطلب.',
        transferredMechanism:
          'تجميع قدرة الشراء والتخزين والنقل للأعضاء وتخصيصها كموارد مشتركة مؤقتة.',
        noveltyReason:
          'يعامل قدرة الشراء والتخزين كموارد قابلة للتجميع والتخصيص.',
        implementationElements: [
          'resource pool',
          'dynamic allocation',
          'capacity reservation',
        ],
      },
      {
        sourceIndustry: 'شبكات الاتصالات',
        sourceMechanism:
          'توجيه الحركة وإعادة المسار عند تعطل عقدة.',
        transferredMechanism:
          'إعادة توجيه حصة العضو المنسحب إلى أعضاء أو مجموعات بديلة دون إسقاط الصفقة.',
        noveltyReason:
          'ينقل مفهوم مقاومة الأعطال إلى استمرارية صفقات الشراء الجماعي.',
        implementationElements: [
          'fallback members',
          'share rerouting',
          'transaction continuity',
        ],
      },
      {
        sourceIndustry: 'التأمين',
        sourceMechanism:
          'تجميع المخاطر والتسعير بحسب احتمالية الخسارة.',
        transferredMechanism:
          'صندوق ضمان أو رسم مخاطر ديناميكي يعتمد على احتمالية انسحاب الأعضاء وفشل المورد.',
        noveltyReason:
          'يضيف طبقة تسعير مخاطر إلى تكوين المجموعة.',
        implementationElements: [
          'risk pool',
          'default probability',
          'dynamic guarantee fee',
        ],
      },
      {
        sourceIndustry: 'الألعاب الجماعية',
        sourceMechanism:
          'تكوين الفرق والمطابقة بحسب المهارة والدور والهدف.',
        transferredMechanism:
          'مطابقة أعضاء المجموعة بحسب الكمية والوقت والموقع ومرونة البدائل ودرجة الالتزام.',
        noveltyReason:
          'يحوّل المطابقة من تشابه المنتج فقط إلى توافق متعدد الأبعاد.',
        implementationElements: [
          'compatibility score',
          'role assignment',
          'dynamic team formation',
        ],
      },
      {
        sourceIndustry: 'سلاسل الكتل',
        sourceMechanism:
          'قواعد تنفيذ مشروطة وتسجيل غير قابل للتلاعب.',
        transferredMechanism:
          'التزام شراء مشروط ينفذ فقط عند تحقق الكمية والسعر والتسليم والضمان.',
        noveltyReason:
          'يجعل إتمام الصفقة نتيجة تحقق مجموعة شروط قابلة للتدقيق.',
        implementationElements: [
          'conditional execution',
          'audit trail',
          'commitment state machine',
        ],
      },
      {
        sourceIndustry: 'الخدمات اللوجستية',
        sourceMechanism:
          'تجميع الشحنات والتوجيه متعدد المحطات.',
        transferredMechanism:
          'اختيار نقاط تقسيم وتسليم تسمح بشراء طلب واحد وتوزيعه بأقل تكلفة إجمالية.',
        noveltyReason:
          'يربط تكوين المجموعة بتكلفة التوزيع بدل فصل الشراء عن التسليم.',
        implementationElements: [
          'shipment consolidation',
          'delivery clusters',
          'route optimization',
        ],
      },
    ];

    const normalizedPreferred = preferredIndustries.map((item) =>
      item.trim().toLowerCase(),
    );

    const ranked = [...library].sort((left, right) => {
      const leftPreferred = normalizedPreferred.some((industry) =>
        left.sourceIndustry.toLowerCase().includes(industry),
      );

      const rightPreferred = normalizedPreferred.some((industry) =>
        right.sourceIndustry.toLowerCase().includes(industry),
      );

      return Number(rightPreferred) - Number(leftPreferred);
    });

    const existing = [
      ...idea.technology.proprietaryComponents,
      ...idea.mechanism.workflow,
    ].join(' ');

    return ranked
      .filter(
        (transfer) =>
          !existing.includes(transfer.transferredMechanism),
      )
      .slice(
        0,
        Math.max(1, Math.min(maximumTransfers, 10)),
      );
  }
}
