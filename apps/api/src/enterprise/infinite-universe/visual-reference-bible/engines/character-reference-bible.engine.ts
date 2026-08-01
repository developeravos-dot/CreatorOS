import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import type {
  CharacterExpressionReference,
  CharacterPoseReference,
  CharacterReferenceSheet,
  CanonicalColor,
} from '../models/visual-reference-bible.models';

@Injectable()
export class CharacterReferenceBibleEngine {
  create(
    character: LivingCharacter,
    visualStyle: string,
    includeExpressions: boolean,
    includePoses: boolean,
    heightUnits: number,
  ): CharacterReferenceSheet {
    const colors =
      this.palette(character);

    const wardrobe =
      this.wardrobeDescription(
        character,
      );

    const canonicalPrompt =
      this.canonicalPrompt(
        character,
        visualStyle,
        colors,
        wardrobe,
      );

    return {
      referenceId: randomUUID(),

      characterId:
        character.identity.characterId,

      characterName:
        character.identity.canonicalName,

      role:
        character.identity.role,

      audienceTier:
        character.identity.audienceTier,

      canonicalIdentity: {
        age:
          character.identity.age,

        apparentAge:
          character.identity.apparentAge,

        species:
          character.identity.species,

        genderIdentity:
          character.identity.genderIdentity,

        visualDescription:
          character.identity.visualDescription,

        faceShape:
          this.faceShape(character),

        skinDescription:
          'لون بشرة ثابت وطبيعي مناسب لهوية الشخصية، دون تغير بين اللقطات.',

        hairDescription:
          this.hairDescription(
            character,
          ),

        eyeDescription:
          'عينان واضحتان بتصميم رسوم متحركة متوازن، مع ثبات اللون والحجم والمسافة.',

        bodyProportions:
          this.bodyProportions(
            character,
          ),

        heightUnits,

        wardrobeDescription:
          wardrobe,

        footwearDescription:
          'حذاء عملي متناسق مع الملابس والعمر، ثابت في جميع مشاهد الحلقة.',

        signatureElements: [
          ...character.identity
            .signatureElements,
        ],
      },

      colorPalette: colors,

      turnaroundViews: [
        this.turnaround(
          character,
          visualStyle,
          canonicalPrompt,
          'front',
        ),

        this.turnaround(
          character,
          visualStyle,
          canonicalPrompt,
          'three-quarter',
        ),

        this.turnaround(
          character,
          visualStyle,
          canonicalPrompt,
          'side',
        ),

        this.turnaround(
          character,
          visualStyle,
          canonicalPrompt,
          'back',
        ),
      ],

      expressions:
        includeExpressions
          ? this.expressions(
              character,
              visualStyle,
              canonicalPrompt,
            )
          : [],

      poses:
        includePoses
          ? this.poses(
              character,
              visualStyle,
              canonicalPrompt,
            )
          : [],

      voiceVisualAlignment: {
        speechStyle:
          character.localizations[0]
            ?.speechStyle ??
          'أسلوب كلام متوازن.',

        visualRhythm:
          this.visualRhythm(
            character,
          ),

        movementStyle:
          this.movementStyle(
            character,
          ),
      },

      canonicalPrompt,

      identityLockPrompt: [
        `ثبّت هوية ${character.identity.canonicalName}`,
        'نفس الوجه',
        'نفس العمر',
        'نفس لون الشعر',
        'نفس لون العين',
        'نفس الملابس',
        'نفس عناصر الهوية',
        'نفس نسب الجسم',
        'نفس الأسلوب الفني',
      ].join(', '),

      negativeIdentityPrompt: [
        'تغير الوجه',
        'تغير العمر',
        'تغير الجنس',
        'تغير لون الشعر',
        'تغير لون العين',
        'تبديل الملابس',
        'إزالة الأدوات المميزة',
        'تغيير نسب الجسم',
        'تشوه اليدين',
        'أطراف إضافية',
        'ازدواج الشخصية',
        'أسلوب بصري مختلف',
        'كتابة',
        'علامة مائية',
      ].join(', '),

      continuityKeys: [
        `character-${character.identity.characterId}`,
        `name-${character.identity.canonicalName}`,
        `age-${character.identity.apparentAge}`,
        `role-${character.identity.role}`,
        ...character.identity
          .signatureElements.map(
            (element) =>
              `signature-${element}`,
          ),
      ],

      status: 'draft',
    };
  }

  private expressions(
    character: LivingCharacter,
    visualStyle: string,
    canonicalPrompt: string,
  ): CharacterExpressionReference[] {
    const definitions = [
      {
        name: 'فضول',
        emotion: 'curiosity',
        intensity: 65,
        facial:
          'اتساع بسيط للعينين مع ابتسامة خفيفة وانتباه واضح.',
        eyes:
          'العينان تتجهان نحو العنصر المكتشف.',
        eyebrows:
          'الحاجبان مرتفعان قليلًا.',
        mouth:
          'الفم شبه مفتوح بابتسامة هادئة.',
        scenes: [
          'opening-hook',
          'discovery',
        ],
      },

      {
        name: 'قلق معتدل',
        emotion: 'worry',
        intensity: 50,
        facial:
          'توتر خفيف حول العينين دون مظهر مخيف.',
        eyes:
          'نظرة مترددة بين الدليل والأصدقاء.',
        eyebrows:
          'تقارب خفيف بين الحاجبين.',
        mouth:
          'الشفتان مغلقتان مع تردد بسيط.',
        scenes: [
          'conflict',
          'decision',
        ],
      },

      {
        name: 'دهشة',
        emotion: 'surprise',
        intensity: 70,
        facial:
          'دهشة واضحة ومناسبة للأطفال دون مبالغة.',
        eyes:
          'اتساع العينين والتركيز على مصدر المفاجأة.',
        eyebrows:
          'ارتفاع واضح للحاجبين.',
        mouth:
          'الفم مفتوح قليلًا.',
        scenes: [
          'reversal',
          'cliffhanger',
        ],
      },

      {
        name: 'ثقة حذرة',
        emotion: 'confidence',
        intensity: 60,
        facial:
          'هدوء وثبات مع ابتسامة صغيرة.',
        eyes:
          'اتصال بصري مباشر مع الشخصيات الأخرى.',
        eyebrows:
          'وضع طبيعي ثابت.',
        mouth:
          'ابتسامة خفيفة وواثقة.',
        scenes: [
          'decision',
          'emotional-payoff',
        ],
      },
    ];

    return definitions.map(
      (definition) => ({
        expressionId: randomUUID(),

        name:
          definition.name,

        visibleEmotion:
          definition.emotion,

        intensity:
          definition.intensity,

        facialDescription:
          definition.facial,

        eyeDescription:
          definition.eyes,

        eyebrowDescription:
          definition.eyebrows,

        mouthDescription:
          definition.mouth,

        suitableSceneTypes:
          definition.scenes,

        imagePrompt: [
          canonicalPrompt,
          `ورقة تعبير وجه ${definition.name}`,
          definition.facial,
          definition.eyes,
          definition.eyebrows,
          definition.mouth,
          visualStyle,
          'خلفية بيضاء نظيفة',
          'لقطة رأس وكتفين',
          'بدون كتابة',
        ].join('. '),

        negativePrompt:
          'تغير هوية الشخصية، تغير الملابس، تشوه الوجه، تعبير مخيف، مبالغة شديدة، كتابة، علامة مائية',
      }),
    );
  }

  private poses(
    character: LivingCharacter,
    visualStyle: string,
    canonicalPrompt: string,
  ): CharacterPoseReference[] {
    const definitions = [
      {
        name: 'وقفة محايدة',
        body:
          'وقفة مستقيمة ومسترخية.',
        hands:
          'اليدان بجانب الجسم بصورة طبيعية.',
        head:
          'الرأس مستقيم.',
        eyes:
          'النظر إلى الأمام.',
        meaning:
          'مرجع أساسي للنسب والهوية.',
        scenes: [
          'setup',
          'reference',
        ],
      },

      {
        name: 'اكتشاف',
        body:
          'ميل بسيط إلى الأمام.',
        hands:
          'إحدى اليدين قريبة من العنصر المكتشف.',
        head:
          'الرأس مائل قليلًا.',
        eyes:
          'النظر إلى الدليل.',
        meaning:
          'الفضول والانتباه.',
        scenes: [
          'opening-hook',
          'discovery',
        ],
      },

      {
        name: 'قرار',
        body:
          'وقفة ثابتة مع استقامة الظهر.',
        hands:
          'إحدى اليدين قرب الصدر والأخرى مرتاحة.',
        head:
          'الرأس مرفوع قليلًا.',
        eyes:
          'النظر إلى الأصدقاء.',
        meaning:
          'المسؤولية والثقة الحذرة.',
        scenes: [
          'decision',
        ],
      },

      {
        name: 'رد فعل',
        body:
          'تراجع بسيط مع دوران الجزء العلوي.',
        hands:
          'اليدان ترتفعان قليلًا بصورة طبيعية.',
        head:
          'التفات نحو مصدر المفاجأة.',
        eyes:
          'التركيز على العنصر الجديد.',
        meaning:
          'الدهشة دون خوف قاس.',
        scenes: [
          'reversal',
          'cliffhanger',
        ],
      },
    ];

    return definitions.map(
      (definition) => ({
        poseId: randomUUID(),

        name:
          definition.name,

        bodyPosition:
          definition.body,

        handPosition:
          definition.hands,

        headDirection:
          definition.head,

        eyeDirection:
          definition.eyes,

        psychologicalMeaning:
          definition.meaning,

        suitableSceneTypes:
          definition.scenes,

        imagePrompt: [
          canonicalPrompt,
          `ورقة وضعية كاملة للجسم: ${definition.name}`,
          definition.body,
          definition.hands,
          definition.head,
          definition.eyes,
          visualStyle,
          'خلفية بيضاء',
          'إظهار الجسم كاملًا',
          'ثبات الهوية والملابس',
          'بدون كتابة',
        ].join('. '),

        negativePrompt:
          'تغير الوجه، اختلاف الملابس، أطراف إضافية، تشوه اليدين، وضعية غير طبيعية، قص الجسم، كتابة، علامة مائية',
      }),
    );
  }

  private turnaround(
    character: LivingCharacter,
    visualStyle: string,
    canonicalPrompt: string,
    view:
      | 'front'
      | 'three-quarter'
      | 'side'
      | 'back',
  ) {
    return {
      view,

      description:
        `منظر ${view} مرجعي كامل لشخصية ${character.identity.canonicalName}.`,

      imagePrompt: [
        canonicalPrompt,
        `character turnaround ${view} view`,
        visualStyle,
        'neutral standing pose',
        'full body',
        'white studio background',
        'consistent proportions',
        'same wardrobe and accessories',
        'no text',
      ].join('. '),
    };
  }

  private canonicalPrompt(
    character: LivingCharacter,
    visualStyle: string,
    colors: CanonicalColor[],
    wardrobe: string,
  ): string {
    return [
      visualStyle,
      `شخصية أصلية باسم ${character.identity.canonicalName}`,
      `العمر الظاهري ${character.identity.apparentAge}`,
      character.identity.visualDescription,
      `الملابس: ${wardrobe}`,
      `الألوان الثابتة: ${colors.map(
        (color) =>
          `${color.name} ${color.hex}`,
      ).join('، ')}`,
      `العناصر المميزة: ${character.identity.signatureElements.join('، ')}`,
      this.bodyProportions(
        character,
      ),
      'تصميم رسوم متحركة سينمائي مناسب للأطفال',
      'هوية وجه ثابتة',
      'نسب ثابتة',
      'تفاصيل نظيفة',
    ].join('. ');
  }

  private palette(
    character: LivingCharacter,
  ): CanonicalColor[] {
    const name =
      character.identity.canonicalName;

    if (name.includes('نُور')) {
      return [
        {
          name: 'أخضر البذرة',
          hex: '#6FAE63',
          usage: 'الحقيبة والرموز النباتية',
          locked: true,
        },

        {
          name: 'ذهبي العدسة',
          hex: '#F2C14E',
          usage: 'العدسة المضيئة والتفاصيل',
          locked: true,
        },

        {
          name: 'كحلي دافئ',
          hex: '#283B59',
          usage: 'الملابس الأساسية',
          locked: true,
        },
      ];
    }

    if (name.includes('رَام')) {
      return [
        {
          name: 'برتقالي الابتكار',
          hex: '#E88C3A',
          usage: 'حزام الأدوات',
          locked: true,
        },

        {
          name: 'أزرق الورشة',
          hex: '#3F6D91',
          usage: 'الملابس',
          locked: true,
        },

        {
          name: 'فضي ميكانيكي',
          hex: '#AAB4BE',
          usage: 'النظارات والأدوات',
          locked: true,
        },
      ];
    }

    return [
      {
        name: 'أزرق الحراس',
        hex: '#243A66',
        usage: 'الملابس الأساسية',
        locked: true,
      },

      {
        name: 'فضي السجلات',
        hex: '#A6AFBD',
        usage: 'الدفتر والشارة',
        locked: true,
      },

      {
        name: 'فيروزي خافت',
        hex: '#4F8C91',
        usage: 'تفاصيل صغيرة',
        locked: true,
      },
    ];
  }

  private wardrobeDescription(
    character: LivingCharacter,
  ): string {
    return `${character.identity.visualDescription}. ملابس ثابتة ومناسبة للعمر، عملية للحركة والمغامرة، دون شعارات أو علامات تجارية.`;
  }

  private faceShape(
    character: LivingCharacter,
  ): string {
    return character.identity.audienceTier ===
      'kids'
      ? 'وجه طفولي مستدير نسبيًا، ملامح واضحة وودودة.'
      : 'ملامح متوازنة متوافقة مع العمر.';
  }

  private hairDescription(
    character: LivingCharacter,
  ): string {
    return `${character.identity.visualDescription}. يجب تثبيت شكل الشعر وطوله ولونه في جميع اللقطات.`;
  }

  private bodyProportions(
    character: LivingCharacter,
  ): string {
    return character.identity.audienceTier ===
      'kids'
      ? 'نسب طفولية متوازنة: رأس أكبر قليلًا من الواقعي، أطراف قصيرة نسبيًا وحركة مرنة.'
      : 'نسب جسم متوازنة وفق العمر.';
  }

  private visualRhythm(
    character: LivingCharacter,
  ): string {
    const style =
      character.psychology.decisionStyle;

    if (style === 'impulsive') {
      return 'إيقاع بصري سريع مع حركات قصيرة ومتكررة.';
    }

    if (style === 'analytical') {
      return 'إيقاع هادئ مع توقفات ونظرات دقيقة.';
    }

    return 'إيقاع متوازن وتفاعلي مع الشخصيات الأخرى.';
  }

  private movementStyle(
    character: LivingCharacter,
  ): string {
    const style =
      character.psychology.decisionStyle;

    if (style === 'impulsive') {
      return 'حركة نشطة وعفوية، مع استخدام اليدين أثناء الكلام.';
    }

    if (style === 'analytical') {
      return 'حركة محسوبة وبطيئة نسبيًا، مع تركيز بصري على التفاصيل.';
    }

    if (style === 'collaborative') {
      return 'حركة مفتوحة وودودة، والالتفات إلى الآخرين أثناء الكلام.';
    }

    return 'حركة طبيعية ومتوازنة.';
  }
}
