import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  DnaMutationRecord,
  IdeaDna,
  IdeaDnaDimension,
} from '../models/novelty-v2.models';

interface MutationStrategy {
  name: string;
  dimension: IdeaDnaDimension;
  mutate: (source: IdeaDna) => IdeaDna;
}

@Injectable()
export class ConceptMutationEngine {
  generate(
    parents: IdeaDna[],
    generation: number,
    populationSize: number,
  ): IdeaDna[] {
    const strategies = this.createStrategies();
    const output: IdeaDna[] = [];
    const maximum = Math.max(6, Math.min(populationSize, 60));

    for (let index = 0; index < maximum; index += 1) {
      const parent = parents[index % parents.length];

      if (!parent) {
        break;
      }

      const strategy = strategies[index % strategies.length];

      if (!strategy) {
        continue;
      }

      const mutated = strategy.mutate(this.clone(parent));

      mutated.id = randomUUID();
      mutated.generation = generation;
      mutated.parentIds = [parent.id];
      mutated.title = `${this.baseTitle(parent.title)} — ${strategy.name}`;

      const record = this.createRecord(
        parent,
        mutated,
        strategy,
        generation,
      );

      mutated.mutationHistory = [
        ...parent.mutationHistory,
        record,
      ];

      output.push(this.normalize(mutated));
    }

    return output;
  }

  private createStrategies(): MutationStrategy[] {
    return [
      {
        name: 'Collective Demand Protocol',
        dimension: 'mechanism',
        mutate: (idea) => {
          idea.mechanism.core =
            'تجميع الاحتياجات المتشابهة آليًا في طلبات مشتركة قابلة للتفاوض والتنفيذ.';
          idea.mechanism.workflow = [
            'التقاط نية الشراء',
            'توحيد مواصفات الطلب',
            'تكوين مجموعة شراء مؤقتة',
            'التفاوض الجماعي',
            'تقسيم الالتزامات والكميات',
            'تنسيق التسليم',
          ];
          idea.mechanism.automationLevel = 82;
          idea.valueProposition.unfairAdvantage.push(
            'تكوين مجموعات شراء لحظية بحسب تطابق الحاجة',
          );
          return idea;
        },
      },
      {
        name: 'Reverse Marketplace',
        dimension: 'businessModel',
        mutate: (idea) => {
          idea.businessModel.payer = [
            'المورد الفائز',
            'الشريك اللوجستي',
          ];
          idea.businessModel.revenueStreams = [
            'رسوم فوز المورد بالمجموعة',
            'رسوم تنسيق وتنفيذ',
            'حصة من التوفير المحقق',
          ];
          idea.businessModel.pricingLogic = [
            'السعر مرتبط بالتوفير الفعلي',
            'الموردون يتنافسون على الطلب المجمع',
          ];
          idea.businessModel.unitOfValue =
            'طلب جماعي تم تنفيذه بتوفير مثبت';
          return idea;
        },
      },
      {
        name: 'Autonomous Procurement Agents',
        dimension: 'technology',
        mutate: (idea) => {
          idea.technology.proprietaryComponents.push(
            'وكيل شراء مستقل لكل تاجر',
            'وكيل تفاوض جماعي',
            'وكيل تخصيص الكميات',
            'وكيل مراقبة الالتزام',
          );
          idea.execution.autonomousRoles.push(
            'التفاوض مع الموردين',
            'اختيار العرض',
            'تجميع الطلبات',
            'توزيع الحصص',
          );
          idea.mechanism.automationLevel = 92;
          return idea;
        },
      },
      {
        name: 'Demand Intelligence Moat',
        dimension: 'dataMoat',
        mutate: (idea) => {
          idea.dataMoat.capturedData.push(
            'الطلب الحقيقي غير المنفذ',
            'حساسية كل تاجر للسعر والوقت',
            'أنماط تكرار الشراء',
            'موثوقية المورد',
          );
          idea.dataMoat.derivedKnowledge.push(
            'خريطة طلب مستقبلية',
            'توقع تكوّن مجموعات الشراء',
            'توقع السعر المقبول',
            'تقييم جودة التنفيذ',
          );
          idea.dataMoat.compoundingLoop.push(
            'كل معاملة تحسن التنبؤ بالطلب وتزيد دقة تكوين المجموعات، ما يجذب موردين أكثر ويخفض الأسعار.',
          );
          return idea;
        },
      },
      {
        name: 'Protectable Allocation Mechanism',
        dimension: 'intellectualProperty',
        mutate: (idea) => {
          idea.intellectualProperty.protectableMechanisms.push(
            'آلية ديناميكية لتكوين مجموعة شراء وتخصيص الكميات وفق القيود المختلفة لكل عضو',
            'آلية إعادة توزيع الحصص عند انسحاب عضو دون إلغاء الصفقة',
          );
          idea.intellectualProperty.protectableProcesses.push(
            'عملية متعددة المراحل لتحويل طلبات فردية غير المؤهلة إلى طلب جملة قابل للتنفيذ',
            'عملية مزايدة عكسية مرتبطة بقيود المجموعة والتسليم',
          );
          idea.intellectualProperty.tradeSecrets.push(
            'معادلة تقييم توافق أعضاء المجموعة',
            'خوارزمية تقدير احتمالية إتمام الصفقة',
          );
          idea.intellectualProperty.defensibility.push(
            'تراكم بيانات الطلب المخفي',
            'شبكة موردين وتجار مرتبطة بتاريخ أداء',
          );
          return idea;
        },
      },
      {
        name: 'Embedded Supplier Distribution',
        dimension: 'distribution',
        mutate: (idea) => {
          idea.distribution.embeddedDistribution.push(
            'زر تكوين طلب جماعي داخل أنظمة الموردين',
            'تكامل مباشر مع أنظمة نقاط البيع',
            'واجهات API لمنصات التجارة',
          );
          idea.distribution.partnerships.push(
            'الموزعون',
            'المستودعات',
            'شركات التوصيل',
            'مزودو التمويل التجاري',
          );
          return idea;
        },
      },
      {
        name: 'Temporary Buying Cooperative',
        dimension: 'network',
        mutate: (idea) => {
          idea.network.actors.push(
            'قائد مجموعة آلي',
            'ضامن دفع',
            'مزود تمويل',
          );
          idea.network.interactions.push(
            'تشكيل تعاون شراء مؤقت لكل صفقة',
            'تصويت أو تفويض تلقائي على العرض',
            'تبادل حصص الكمية بين الأعضاء',
          );
          idea.network.networkEffects.push(
            'زيادة التجار ترفع احتمال اكتمال الحد الأدنى للطلبات',
            'زيادة الموردين تحسن المنافسة والأسعار',
            'زيادة المعاملات تحسن موثوقية المطابقة',
          );
          return idea;
        },
      },
      {
        name: 'Inventory-Free Wholesale',
        dimension: 'execution',
        mutate: (idea) => {
          idea.execution.operatingModel = [
            'المنصة لا تشتري أو تخزن البضاعة',
            'تنسيق الطلب والدفع والتسليم مباشرة بين الأطراف',
            'الاعتماد على نقاط تجميع أو شحن موزعة',
          ];
          idea.execution.autonomousRoles.push(
            'اختيار نقطة التسليم',
            'اختيار مسار التوزيع',
            'مطابقة الكمية مع قدرة التخزين',
          );
          return idea;
        },
      },
      {
        name: 'Cross-Industry Demand Exchange',
        dimension: 'market',
        mutate: (idea) => {
          idea.market.adjacentSegments.push(
            'المطاعم الصغيرة',
            'ورش الصيانة',
            'العيادات',
            'المتاجر الإلكترونية',
            'المقاولون الصغار',
          );
          idea.market.geographicScope = [
            'مدينة واحدة',
            'الدولة',
            'شبكة إقليمية',
          ];
          return idea;
        },
      },
      {
        name: 'Pre-Commitment Market',
        dimension: 'riskModel',
        mutate: (idea) => {
          idea.riskModel.controls.push(
            'حجز مبلغ أو تفويض دفع قبل دخول المجموعة',
            'درجة التزام لكل عضو',
            'قائمة بدلاء آلية',
            'إعادة توزيع الحصص عند الانسحاب',
            'عدم تأكيد الصفقة حتى تحقق شروط التنفيذ',
          );
          idea.riskModel.majorRisks = [
            'انسحاب أعضاء المجموعة',
            'فشل المورد',
            'اختلاف المواصفات',
            'تأخر التسليم',
          ];
          return idea;
        },
      },
      {
        name: 'Outcome-Guaranteed Procurement',
        dimension: 'valueProposition',
        mutate: (idea) => {
          idea.valueProposition.outcome =
            'تمكين التاجر الصغير من الوصول إلى شروط وأسعار الجملة دون شراء الكمية الكاملة منفردًا.';
          idea.valueProposition.measurableValue = [
            'نسبة التوفير',
            'زمن اكتمال المجموعة',
            'نسبة تنفيذ الطلبات',
            'انخفاض تكلفة الوحدة',
          ];
          idea.valueProposition.unfairAdvantage.push(
            'الدفع مرتبط بإتمام صفقة تحقق توفيرًا مثبتًا',
          );
          return idea;
        },
      },
      {
        name: 'Problem Reframing',
        dimension: 'problem',
        mutate: (idea) => {
          idea.problem.statement =
            'الطلب التجاري الصغير موجود فعليًا لكنه متفرق وغير مرئي للمورد، ولذلك يعجز السوق عن تحويله إلى قوة شراء جماعية.';
          idea.problem.rootCause =
            'غياب طبقة تنسيق تحول الطلب المبعثر إلى كتلة طلب قابلة للتسعير والتنفيذ.';
          idea.problem.urgency = 88;
          return idea;
        },
      },
    ];
  }

  private createRecord(
    beforeIdea: IdeaDna,
    afterIdea: IdeaDna,
    strategy: MutationStrategy,
    generation: number,
  ): DnaMutationRecord {
    return {
      mutationId: randomUUID(),
      generation,
      dimension: strategy.dimension,
      strategy: strategy.name,
      before: this.dimensionValues(beforeIdea, strategy.dimension),
      after: this.dimensionValues(afterIdea, strategy.dimension),
      rationale:
        'تغيير مكوّن مفهومي في DNA الفكرة لزيادة الاختلاف البنيوي وقابلية الحماية.',
    };
  }

  private dimensionValues(
    idea: IdeaDna,
    dimension: IdeaDnaDimension,
  ): string[] {
    switch (dimension) {
      case 'problem':
        return [
          idea.problem.statement,
          idea.problem.rootCause,
        ];

      case 'customer':
        return [
          ...idea.customers.primary,
          ...idea.customers.secondary,
        ];

      case 'valueProposition':
        return [
          idea.valueProposition.outcome,
          ...idea.valueProposition.unfairAdvantage,
        ];

      case 'mechanism':
        return [
          idea.mechanism.core,
          ...idea.mechanism.workflow,
        ];

      case 'businessModel':
        return [
          ...idea.businessModel.revenueStreams,
          ...idea.businessModel.pricingLogic,
        ];

      case 'technology':
        return [
          ...idea.technology.components,
          ...idea.technology.proprietaryComponents,
        ];

      case 'network':
        return [
          ...idea.network.actors,
          ...idea.network.networkEffects,
        ];

      case 'dataMoat':
        return [
          ...idea.dataMoat.capturedData,
          ...idea.dataMoat.derivedKnowledge,
        ];

      case 'intellectualProperty':
        return [
          ...idea.intellectualProperty.protectableMechanisms,
          ...idea.intellectualProperty.protectableProcesses,
        ];

      case 'execution':
        return [
          ...idea.execution.operatingModel,
          ...idea.execution.autonomousRoles,
        ];

      case 'market':
        return [
          ...idea.market.initialSegment,
          ...idea.market.adjacentSegments,
        ];

      case 'distribution':
        return [
          ...idea.distribution.acquisitionChannels,
          ...idea.distribution.embeddedDistribution,
        ];

      case 'riskModel':
        return [
          ...idea.riskModel.majorRisks,
          ...idea.riskModel.controls,
        ];
    }
  }

  private normalize(idea: IdeaDna): IdeaDna {
    idea.customers.primary = this.unique(idea.customers.primary);
    idea.customers.secondary = this.unique(idea.customers.secondary);
    idea.customers.beneficiaries = this.unique(
      idea.customers.beneficiaries,
    );

    idea.valueProposition.measurableValue = this.unique(
      idea.valueProposition.measurableValue,
    );
    idea.valueProposition.unfairAdvantage = this.unique(
      idea.valueProposition.unfairAdvantage,
    );

    idea.mechanism.workflow = this.unique(idea.mechanism.workflow);
    idea.mechanism.decisions = this.unique(idea.mechanism.decisions);

    idea.businessModel.payer = this.unique(idea.businessModel.payer);
    idea.businessModel.revenueStreams = this.unique(
      idea.businessModel.revenueStreams,
    );
    idea.businessModel.pricingLogic = this.unique(
      idea.businessModel.pricingLogic,
    );

    idea.technology.components = this.unique(
      idea.technology.components,
    );
    idea.technology.proprietaryComponents = this.unique(
      idea.technology.proprietaryComponents,
    );
    idea.technology.integrationPoints = this.unique(
      idea.technology.integrationPoints,
    );

    idea.network.actors = this.unique(idea.network.actors);
    idea.network.interactions = this.unique(
      idea.network.interactions,
    );
    idea.network.networkEffects = this.unique(
      idea.network.networkEffects,
    );

    idea.dataMoat.capturedData = this.unique(
      idea.dataMoat.capturedData,
    );
    idea.dataMoat.derivedKnowledge = this.unique(
      idea.dataMoat.derivedKnowledge,
    );
    idea.dataMoat.compoundingLoop = this.unique(
      idea.dataMoat.compoundingLoop,
    );

    idea.intellectualProperty.protectableMechanisms = this.unique(
      idea.intellectualProperty.protectableMechanisms,
    );
    idea.intellectualProperty.protectableProcesses = this.unique(
      idea.intellectualProperty.protectableProcesses,
    );
    idea.intellectualProperty.tradeSecrets = this.unique(
      idea.intellectualProperty.tradeSecrets,
    );
    idea.intellectualProperty.defensibility = this.unique(
      idea.intellectualProperty.defensibility,
    );

    idea.execution.operatingModel = this.unique(
      idea.execution.operatingModel,
    );
    idea.execution.humanRoles = this.unique(
      idea.execution.humanRoles,
    );
    idea.execution.autonomousRoles = this.unique(
      idea.execution.autonomousRoles,
    );

    idea.market.initialSegment = this.unique(
      idea.market.initialSegment,
    );
    idea.market.adjacentSegments = this.unique(
      idea.market.adjacentSegments,
    );
    idea.market.geographicScope = this.unique(
      idea.market.geographicScope,
    );

    idea.distribution.acquisitionChannels = this.unique(
      idea.distribution.acquisitionChannels,
    );
    idea.distribution.embeddedDistribution = this.unique(
      idea.distribution.embeddedDistribution,
    );
    idea.distribution.partnerships = this.unique(
      idea.distribution.partnerships,
    );

    idea.riskModel.majorRisks = this.unique(
      idea.riskModel.majorRisks,
    );
    idea.riskModel.controls = this.unique(
      idea.riskModel.controls,
    );

    return idea;
  }

  private unique(values: string[]): string[] {
    return [
      ...new Set(
        values
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }

  private baseTitle(value: string): string {
    return value.split('—')[0]?.trim() || value.trim();
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
