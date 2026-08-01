import { Injectable } from '@nestjs/common';
import type { EvaluatedIdeaDna } from '../../v2/models/novelty-v2.models';
import type { TrizPrincipleApplication } from '../models/novelty-v3.models';

@Injectable()
export class TrizReasoningEngine {
  apply(
    idea: EvaluatedIdeaDna,
    maximumPrinciples: number,
  ): TrizPrincipleApplication[] {
    const applications: TrizPrincipleApplication[] = [
      {
        principleNumber: 1,
        principleName: 'Segmentation',
        contradiction:
          'يحتاج النظام إلى طلب كبير للوصول إلى سعر الجملة، بينما كل عضو يريد كمية صغيرة مستقلة.',
        application:
          'تقسيم الطلب الجماعي إلى حصص مرنة مستقلة مع الاحتفاظ بكيان تفاوضي موحد أمام المورد.',
        affectedDimensions: [
          'mechanism',
          'allocation',
          'fulfilment',
        ],
      },
      {
        principleNumber: 10,
        principleName: 'Preliminary Action',
        contradiction:
          'لا يمكن تأكيد الصفقة قبل اكتمال المجموعة، لكن انتظار اكتمالها يبطئ التنفيذ.',
        application:
          'إنشاء التزامات شراء مسبقة مشروطة وتكوين مجموعات متوقعة قبل الوصول إلى حد المورد.',
        affectedDimensions: [
          'commitment',
          'prediction',
          'group formation',
        ],
      },
      {
        principleNumber: 15,
        principleName: 'Dynamics',
        contradiction:
          'المجموعة تحتاج إلى الاستقرار لإتمام الصفقة، لكن احتياجات الأعضاء والكميات تتغير.',
        application:
          'جعل بنية المجموعة والكميات والتخصيص قابلة لإعادة التكوين لحظيًا دون إلغاء الصفقة.',
        affectedDimensions: [
          'dynamic allocation',
          'membership',
          'quantity redistribution',
        ],
      },
      {
        principleNumber: 23,
        principleName: 'Feedback',
        contradiction:
          'النظام يحتاج إلى قرارات دقيقة من البداية، لكن جودة القرار لا تتضح إلا بعد التنفيذ.',
        application:
          'استخدام نتائج كل صفقة لتعديل نماذج التوافق والسعر والالتزام واحتمالية الإتمام.',
        affectedDimensions: [
          'data moat',
          'learning loop',
          'decision quality',
        ],
      },
      {
        principleNumber: 24,
        principleName: 'Intermediary',
        contradiction:
          'التجار والموردون يحتاجون إلى التعامل مباشرة، لكن اختلاف القيود يجعل التنسيق المباشر معقدًا.',
        application:
          'إنشاء وكيل تنسيق رقمي يعمل كوسيط تقني ينظم المطابقة والتفاوض والتخصيص دون امتلاك البضاعة.',
        affectedDimensions: [
          'agent orchestration',
          'negotiation',
          'execution',
        ],
      },
      {
        principleNumber: 25,
        principleName: 'Self-Service',
        contradiction:
          'زيادة عدد المجموعات تتطلب تشغيلًا بشريًا أكبر، بينما المطلوب توسع منخفض التكلفة.',
        application:
          'تمكين النظام من تكوين المجموعة والتفاوض والتوزيع ومعالجة الانسحاب آليًا.',
        affectedDimensions: [
          'automation',
          'scalability',
          'operating model',
        ],
      },
      {
        principleNumber: 35,
        principleName: 'Parameter Changes',
        contradiction:
          'المورد يفرض حدًا ثابتًا للكمية، بينما السوق يتكون من طلبات متفاوتة.',
        application:
          'تحويل شرط الحد الأدنى من كمية ثابتة إلى مجموعة قيود ديناميكية تشمل القيمة والوقت والمنطقة ونمط التسليم.',
        affectedDimensions: [
          'supplier constraints',
          'pricing',
          'group compatibility',
        ],
      },
      {
        principleNumber: 40,
        principleName: 'Composite Structures',
        contradiction:
          'حل واحد لا يستطيع معالجة المطابقة والتفاوض والدفع والتوزيع والمخاطر بكفاءة.',
        application:
          'بناء بنية هجينة من وكلاء متخصصين ومحرك قواعد ومحرك تنبؤ ورسم معرفة تشغيلي.',
        affectedDimensions: [
          'technology',
          'multi-agent system',
          'knowledge graph',
        ],
      },
    ];

    const relevant = applications.filter((application) => {
      const text = [
        idea.problem.statement,
        idea.mechanism.core,
        ...idea.riskModel.majorRisks,
        ...idea.execution.autonomousRoles,
      ]
        .join(' ')
        .toLowerCase();

      if (
        application.principleNumber === 15 &&
        text.includes('انسحاب')
      ) {
        return true;
      }

      if (
        application.principleNumber === 23 &&
        idea.dataMoat.capturedData.length > 0
      ) {
        return true;
      }

      if (
        application.principleNumber === 25 &&
        idea.mechanism.automationLevel >= 70
      ) {
        return true;
      }

      return true;
    });

    return relevant.slice(
      0,
      Math.max(1, Math.min(maximumPrinciples, 12)),
    );
  }
}
