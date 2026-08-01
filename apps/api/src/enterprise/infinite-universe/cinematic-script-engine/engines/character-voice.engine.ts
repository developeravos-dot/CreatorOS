import { Injectable } from '@nestjs/common';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import type {
  DialogueDelivery,
  ScriptDialogueLine,
} from '../models/cinematic-script.models';

export interface DynamicDialogueContext {
  sceneNumber: number;
  sceneType: string;

  scenePurpose: string;
  storyThread: string;

  location: string;
  emotionalTarget: string;

  previousDialogueLines: string[];

  otherCharacterNames: string[];

  discoveryDetail?: string;
  conflictDetail?: string;
  decisionDetail?: string;
  reversalDetail?: string;
}

@Injectable()
export class CharacterVoiceEngine {
  createDialogue(
    character: LivingCharacter,
    lineNumber: number,
    context: DynamicDialogueContext,
    includeSubtext: boolean,
  ): ScriptDialogueLine {
    const activeGoal =
      character.goals.find(
        (goal) => goal.active,
      )?.title ?? 'فهم ما يحدث';

    const activeFear =
      character.fears
        .filter(
          (fear) => !fear.resolved,
        )
        .sort(
          (left, right) =>
            right.intensity -
            left.intensity,
        )[0]?.name ?? 'الفشل';

    const dialogue =
      this.buildUniqueDialogue(
        character,
        context,
      );

    return {
      lineNumber,

      characterId:
        character.identity.characterId,

      characterName:
        character.identity.canonicalName,

      dialogue,

      delivery:
        this.delivery(
          character,
          context,
        ),

      visibleEmotion:
        context.emotionalTarget,

      hiddenEmotion:
        activeFear,

      subtext:
        includeSubtext
          ? this.createSubtext(
              character,
              context,
              activeGoal,
              activeFear,
            )
          : '',

      bodyLanguage:
        this.bodyLanguage(
          character,
          context,
        ),

      pauseAfterSeconds:
        this.pauseDuration(
          character,
          context,
        ),

      continuityReferences:
        character.memories
          .filter(
            (memory) =>
              memory.importance >= 60,
          )
          .slice(-3)
          .map(
            (memory) => memory.id,
          ),
    };
  }

  private buildUniqueDialogue(
    character: LivingCharacter,
    context: DynamicDialogueContext,
  ): string {
    const name =
      character.identity.canonicalName;

    const style =
      character.psychology.decisionStyle;

    const role =
      character.identity.role;

    const sceneType =
      context.sceneType;

    let candidates: string[] = [];

    if (sceneType === 'opening-hook') {
      candidates =
        this.openingHookDialogue(
          name,
          style,
          role,
          context,
        );
    } else if (sceneType === 'setup') {
      candidates =
        this.setupDialogue(
          name,
          style,
          role,
          context,
        );
    } else if (sceneType === 'discovery') {
      candidates =
        this.discoveryDialogue(
          name,
          style,
          role,
          context,
        );
    } else if (sceneType === 'conflict') {
      candidates =
        this.conflictDialogue(
          name,
          style,
          role,
          context,
        );
    } else if (sceneType === 'decision') {
      candidates =
        this.decisionDialogue(
          name,
          style,
          role,
          context,
        );
    } else if (sceneType === 'reversal') {
      candidates =
        this.reversalDialogue(
          name,
          style,
          role,
          context,
        );
    } else if (
      sceneType === 'emotional-payoff'
    ) {
      candidates =
        this.emotionalPayoffDialogue(
          name,
          style,
          role,
          context,
        );
    } else if (
      sceneType === 'cliffhanger'
    ) {
      candidates =
        this.cliffhangerDialogue(
          name,
          style,
          role,
          context,
        );
    } else {
      candidates =
        this.fallbackDialogue(
          name,
          style,
          context,
        );
    }

    const unique =
      candidates.find(
        (candidate) =>
          !context.previousDialogueLines
            .map((line) =>
              this.normalize(line),
            )
            .includes(
              this.normalize(candidate),
            ),
      );

    if (unique) {
      return unique;
    }

    return `${name} ينظر إلى ${context.otherCharacterNames[0] ?? 'الآخرين'} ويقول: هذه المرة هناك شيء مختلف في ${context.location}، ولا أظن أنه حدث بالصدفة.`;
  }

  private openingHookDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `انتظروا... هل رأيتم الوميض قرب الطريق؟ ظهر للحظة ثم اختفى.`,
        `لا تتحركوا بعد. كل واحد منكم، أخبرني ما الذي لاحظه بالضبط.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `ذلك الضوء تكرر ثلاث مرات بالترتيب نفسه. لا يبدو عشوائيًا.`,
        `المسافة بين الومضات ثابتة. ربما تكون إشارة، وليست مجرد انعكاس.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `رأيتموه، أليس كذلك؟ ممتاز! كنت أخشى أن تكون نظارتي قد تعطلت من جديد.`,
        `هناك شيء يتحرك خلف ذلك الجدار، وسأكتشف ما هو قبل أن يختفي.`,
      ];
    }

    if (role === 'rival') {
      return [
        `لا تقتربوا. الإشارات القديمة لا تظهر بلا سبب.`,
      ];
    }

    return [
      `هناك علامة جديدة مرتبطة بـ ${context.storyThread}.`,
    ];
  }

  private setupDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `قبل أن نذهب إلى أي مكان، لنتفق على شيء: لا أحد يخفي ما يجده.`,
        `سنقسم الطريق بيننا، لكننا نبقى قريبين بما يكفي لسماع بعضنا.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `الخريطة القديمة لا تذكر هذا الممر، ومع ذلك آثار الأقدام تتجه نحوه.`,
        `لدينا معلومتان متعارضتان. إما أن السجل ناقص، أو أن الطريق أُنشئ حديثًا.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `أحضرت الأدوات المناسبة... وبعض الأدوات التي لا أعرف فائدتها بعد.`,
        `لا تقلقوا، اختبرت الجهاز صباحًا. حسنًا... اختبرت نصفه.`,
      ];
    }

    return [
      `${context.location} تبدو مختلفة اليوم، وكأنها تنتظر حدوث شيء.`,
    ];
  }

  private discoveryDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `هذا الرمز يشبه العلامة الموجودة في حقيبتي، لكنه ليس مطابقًا تمامًا.`,
        `إذا جمعنا هذا الجزء مع نصف الخريطة، فقد نعرف إلى أين تشير العلامة.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `النقش أحدث من الجدار نفسه. شخص ما أضافه بعد إغلاق المكان.`,
        `هذه ليست خريطة للموقع، بل خريطة للطريق الذي يتحرك داخله.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `وجدت فتحة صغيرة! جهاز القياس يقول إنها آمنة... أو أنه لا يعمل.`,
        `الرمز يستجيب للصوت. جربوا قول الكلمة المكتوبة تحته.`,
      ];
    }

    return [
      `هذا الاكتشاف يغير ما نعرفه عن ${context.storyThread}.`,
    ];
  }

  private conflictDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `ساهر، أعرف أنك تريد حماية المكان، لكن إخفاء الحقيقة لن يجعلنا أكثر أمانًا.`,
        `رام، لا تلمس الجهاز قبل أن نفهم ما يفعله. هذه ليست مسابقة.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `نور، الفضول وحده ليس دليلًا كافيًا لفتح باب حُظر منذ سنوات.`,
        `كل خطوة إلى الداخل تزيد احتمال تفعيل شيء لا نستطيع إيقافه.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `أنا لا أتصرف بلا تفكير! أنا فقط أفكر بسرعة أكثر من الجهاز.`,
        `إذا انتظرنا طويلًا، فقد تختفي الإشارة ونعود من دون أي جواب.`,
      ];
    }

    if (role === 'rival') {
      return [
        `لن أسمح بأن يتحول بحثكم عن جواب إلى خطر على المدينة.`,
      ];
    }

    return [
      `علينا الاختيار بين التقدم والحفاظ على الأمان.`,
    ];
  }

  private decisionDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `لن أفتح الباب وحدي. إما أن ندخل باتفاق واضح، أو نعود جميعًا.`,
        `سأختار الحقيقة، لكن ليس على حساب ثقتنا ببعضنا.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `هناك خيار ثالث: نثبت الباب ونفحص الآلية من الخارج أولًا.`,
        `إذا دخلنا، سنضع علامة على كل خطوة ونعود عند أول تغير غير مفهوم.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `حسنًا، لن أضغط أي زر. سأحمل الجهاز فقط... بعيدًا عن الأزرار.`,
        `أنا موافق على الخطة، لكن يجب أن نتحرك قبل أن تنطفئ الإشارة.`,
      ];
    }

    return [
      `القرار الآن سيغير علاقتنا بـ ${context.storyThread}.`,
    ];
  }

  private reversalDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `هذا ليس مدخل الأرشيف... إنه تحذير أرسله شخص كان يحاول حمايتنا.`,
        `الرمز لم يكن يقودنا إلى الداخل، بل كان يحاول إبعادنا عن شيء آخر.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `توقفوا. اتجاه الأسهم معكوس. نحن نقرأ الرسالة من الجهة الخطأ.`,
        `السجل يقول إن الحراس أغلقوا الأرشيف، لكن هذا الدليل يثبت أنهم كانوا يبحثون عنه أيضًا.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `الجهاز لا يشير إلى الباب... إنه يشير إلى أسفلنا!`,
        `أظن أنني اكتشفت المشكلة. الشيء الذي نبحث عنه ليس خلف الجدار، بل تحته.`,
      ];
    }

    return [
      `ما اكتشفناه ليس الحقيقة التي توقعناها.`,
    ];
  }

  private emotionalPayoffDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `قد نختلف في الطريقة، لكنني لا أريد أن نخسر بعضنا ونحن نبحث عن الحقيقة.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `كنت أظن أن الحذر يعني أن أعمل وحدي. ربما كان ذلك جزءًا من المشكلة.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `سأخبركم قبل أن أجرب اختراعي القادم... حتى لو كان ناجحًا جدًا.`,
      ];
    }

    return [
      `تعلمنا أن الثقة لا تعني غياب الخلاف.`,
    ];
  }

  private cliffhangerDialogue(
    name: string,
    style: string,
    role: string,
    context: DynamicDialogueContext,
  ): string[] {
    if (style === 'collaborative') {
      return [
        `اسمعوا... الصوت يأتي من تحت المدينة.`,
      ];
    }

    if (style === 'analytical') {
      return [
        `الإشارة الجديدة تحمل اسمًا واحدًا: مدينة البدايات.`,
      ];
    }

    if (style === 'impulsive') {
      return [
        `أرجو أن يكون هذا الرقم خطأ... لأن الجهاز يقول إن الباب فُتح بالفعل.`,
      ];
    }

    return [
      `هذه ليست نهاية الإشارة، بل بدايتها.`,
    ];
  }

  private fallbackDialogue(
    name: string,
    style: string,
    context: DynamicDialogueContext,
  ): string[] {
    return [
      `${name} يقول: ما حدث في ${context.location} يغير فهمنا لـ ${context.storyThread}.`,
      `${name} يقول: علينا مراجعة كل ما عرفناه قبل هذه اللحظة.`,
    ];
  }

  private createSubtext(
    character: LivingCharacter,
    context: DynamicDialogueContext,
    activeGoal: string,
    activeFear: string,
  ): string {
    const sceneType =
      context.sceneType;

    if (sceneType === 'conflict') {
      return `يدافع عن موقفه علنًا، لكنه يخشى أن يؤدي الخلاف إلى "${activeFear}".`;
    }

    if (sceneType === 'decision') {
      return `يحاول الوصول إلى "${activeGoal}" دون الاعتراف بمدى تأثير "${activeFear}" على اختياره.`;
    }

    if (sceneType === 'reversal') {
      return `المعلومة الجديدة تهدد فهمه السابق لنفسه وللعالم.`;
    }

    return `يتصرف بما ينسجم مع هدف "${activeGoal}" بينما يبقى خوف "${activeFear}" حاضرًا في الخلفية.`;
  }

  private delivery(
    character: LivingCharacter,
    context: DynamicDialogueContext,
  ): DialogueDelivery {
    const style =
      character.psychology.decisionStyle;

    if (
      context.sceneType ===
      'reversal'
    ) {
      return 'excited';
    }

    if (
      context.sceneType ===
      'decision'
    ) {
      return style === 'analytical'
        ? 'serious'
        : 'emotional';
    }

    if (
      context.sceneType ===
      'conflict'
    ) {
      return style === 'impulsive'
        ? 'excited'
        : 'serious';
    }

    if (
      context.sceneType ===
      'discovery'
    ) {
      return 'curious';
    }

    if (
      style === 'impulsive'
    ) {
      return 'playful';
    }

    if (
      style === 'analytical'
    ) {
      return 'serious';
    }

    return 'calm';
  }

  private bodyLanguage(
    character: LivingCharacter,
    context: DynamicDialogueContext,
  ): string {
    const style =
      character.psychology.decisionStyle;

    if (
      context.sceneType ===
      'reversal'
    ) {
      return 'يتجمد للحظة، ثم يلتفت بسرعة نحو مصدر الدليل الجديد.';
    }

    if (
      context.sceneType ===
      'decision'
    ) {
      return 'يأخذ نفسًا عميقًا وينظر إلى الآخرين قبل تثبيت موقفه.';
    }

    if (
      context.sceneType ===
      'conflict'
    ) {
      return style === 'impulsive'
        ? 'يتقدم خطوة ثم يتوقف عندما يلاحظ رد فعل الآخرين.'
        : 'يشد كتفيه ويحافظ على مسافة واضحة بينه وبين الدليل.';
    }

    if (
      style === 'analytical'
    ) {
      return 'يميل برأسه نحو الدليل ويتتبع تفاصيله بعينيه قبل الكلام.';
    }

    if (
      style === 'impulsive'
    ) {
      return 'يحرك يديه بسرعة ويقترب من العنصر قبل أن يتراجع قليلًا.';
    }

    return 'ينظر إلى كل شخصية بالتتابع ويترك مساحة واضحة للرد.';
  }

  private pauseDuration(
    character: LivingCharacter,
    context: DynamicDialogueContext,
  ): number {
    if (
      context.sceneType ===
      'decision' ||
      context.sceneType ===
      'reversal'
    ) {
      return 1.4;
    }

    if (
      character.psychology
        .decisionStyle ===
      'analytical'
    ) {
      return 1.1;
    }

    if (
      character.psychology
        .decisionStyle ===
      'impulsive'
    ) {
      return 0.35;
    }

    return 0.75;
  }

  private normalize(
    value: string,
  ): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .replace(/\s+/g, ' ');
  }
}
