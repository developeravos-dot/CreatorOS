import { Injectable } from '@nestjs/common';
import type { EvaluatedIdeaDna } from '../../v2/models/novelty-v2.models';
import type {
  CrossIndustryTransfer,
  InventiveMechanism,
  TrizPrincipleApplication,
} from '../models/novelty-v3.models';

@Injectable()
export class InventivePrincipleGeneratorEngine {
  generate(
    idea: EvaluatedIdeaDna,
    triz: TrizPrincipleApplication[],
    transfers: CrossIndustryTransfer[],
  ): InventiveMechanism[] {
    const mechanisms: InventiveMechanism[] = [
      {
        name: 'Dynamic Group Constraint Solver',
        technicalProblem:
          'تكوين مجموعة شراء تحقق في الوقت نفسه قيود الكمية والسعر والوقت والموقع والتسليم.',
        mechanism:
          'محرك قيود يبني مجموعة مؤقتة من طلبات فردية ويحسب مجموعة صالحة للتنفيذ وفق شروط المورد والأعضاء.',
        inputs: [
          'طلبات الأعضاء',
          'الحد الأدنى للمورد',
          'الأسعار',
          'الموقع',
          'مهلة التسليم',
          'مرونة البدائل',
        ],
        processingSteps: [
          'توحيد مواصفات الطلب',
          'حساب توافق الطلبات',
          'تكوين مجموعات مرشحة',
          'حساب قابلية التنفيذ',
          'اختيار المجموعة الأعلى احتمالًا للنجاح',
        ],
        outputs: [
          'مجموعة شراء قابلة للتنفيذ',
          'حصة كل عضو',
          'سعر متوقع',
          'درجة ثقة',
        ],
        technicalEffect:
          'تقليل زمن تكوين المجموعة وتقليل نسبة المجموعات التي تفشل قبل التنفيذ.',
        defensibility: [
          'تركيب القيود',
          'دالة التوافق',
          'اختيار المجموعة',
        ],
      },
      {
        name: 'Transaction-Preserving Share Reallocation',
        technicalProblem:
          'انسحاب عضو بعد تكوين المجموعة قد يخفض الكمية عن حد المورد ويؤدي إلى سقوط الصفقة.',
        mechanism:
          'آلة حالات تعيد توزيع الحصة تلقائيًا على أعضاء حاليين أو بدلاء أو مجموعة مرتبطة مع الحفاظ على شروط الصفقة.',
        inputs: [
          'حصة العضو المنسحب',
          'الحد الأدنى المتبقي',
          'مرونة الأعضاء',
          'قائمة البدلاء',
        ],
        processingSteps: [
          'اكتشاف العجز',
          'ترتيب المستلمين المحتملين',
          'محاكاة إعادة التوزيع',
          'اختيار أقل تغيير',
          'تحديث الالتزامات',
        ],
        outputs: [
          'توزيع جديد',
          'حالة استمرار الصفقة',
          'تعديل التكلفة',
        ],
        technicalEffect:
          'زيادة استمرارية الصفقة وتقليل الإلغاءات الناتجة عن انسحاب المشاركين.',
        defensibility: [
          'آلة الحالات',
          'ترتيب البدلاء',
          'معيار أقل تغيير',
        ],
      },
      {
        name: 'Demand Liquidity Order Book',
        technicalProblem:
          'الطلب الصغير غير مرئي بصورة مجمعة للمورد ولا يمكن تسعيره بكفاءة.',
        mechanism:
          'دفتر طلب يعرض سيولة الطلب المجمعة ضمن نطاقات كمية وسعر ووقت دون كشف البيانات الحساسة للأعضاء.',
        inputs: [
          'نية الشراء',
          'نطاق السعر',
          'الكمية',
          'الوقت',
          'سياسة الخصوصية',
        ],
        processingSteps: [
          'إخفاء الهوية',
          'تجميع الطلب',
          'إنشاء نطاقات سيولة',
          'استقبال عروض الموردين',
          'إغلاق المجموعة عند تحقق الشروط',
        ],
        outputs: [
          'منحنى طلب مجمع',
          'عروض موردين',
          'نقطة إغلاق',
        ],
        technicalEffect:
          'تحسين اكتشاف السعر وزيادة قدرة المورد على الاستجابة للطلب المبعثر.',
        defensibility: [
          'تمثيل سيولة الطلب',
          'شروط الإغلاق',
          'إخفاء الهوية مع الاحتفاظ بالالتزام',
        ],
      },
      {
        name: 'Self-Learning Commitment Risk Engine',
        technicalProblem:
          'صعوبة توقع انسحاب الأعضاء أو فشل المورد قبل تنفيذ الصفقة.',
        mechanism:
          'محرك يتعلم من تاريخ السلوك ويحسب درجة التزام ومخاطر لكل طرف ولكل مجموعة.',
        inputs: [
          'تاريخ الصفقات',
          'الانسحابات',
          'التأخير',
          'النزاعات',
          'تغير السعر',
        ],
        processingSteps: [
          'استخراج خصائص السلوك',
          'حساب احتمالية الانسحاب',
          'حساب مخاطر المورد',
          'تعديل الضمان أو شروط الدخول',
        ],
        outputs: [
          'درجة التزام',
          'رسم ضمان',
          'قرار قبول أو رفض',
        ],
        technicalEffect:
          'تقليل فشل المعاملات وتحسين دقة قبول الأعضاء والموردين.',
        defensibility: [
          'خصائص المخاطر',
          'معادلة الالتزام',
          'ربط الدرجة بشروط الصفقة',
        ],
      },
    ];

    const trizNames = triz.map((item) => item.principleName);
    const transferIndustries = transfers.map(
      (item) => item.sourceIndustry,
    );

    return mechanisms.map((mechanism, index) => ({
      ...mechanism,
      defensibility: [
        ...mechanism.defensibility,
        `TRIZ: ${trizNames[index % Math.max(trizNames.length, 1)] ?? 'Dynamics'}`,
        `Transfer: ${
          transferIndustries[
            index % Math.max(transferIndustries.length, 1)
          ] ?? 'الأسواق المالية'
        }`,
        ...idea.intellectualProperty.tradeSecrets.slice(0, 2),
      ],
    }));
  }
}
