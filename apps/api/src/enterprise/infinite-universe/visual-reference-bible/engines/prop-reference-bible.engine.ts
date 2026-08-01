import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import type {
  CanonicalColor,
  PropReferenceSheet,
} from '../models/visual-reference-bible.models';

export type VisualElementClassification =
  | 'physical-prop'
  | 'visual-accessory'
  | 'behavioral-signature'
  | 'dialogue-signature'
  | 'movement-signature'
  | 'emotional-signature';

@Injectable()
export class PropReferenceBibleEngine {
  createForCharacters(
    characters: LivingCharacter[],
    visualStyle: string,
  ): PropReferenceSheet[] {
    const props: PropReferenceSheet[] = [];

    for (const character of characters) {
      for (
        const element of
        character.identity.signatureElements
      ) {
        const classification =
          this.classify(element);

        if (
          classification !== 'physical-prop' &&
          classification !== 'visual-accessory'
        ) {
          continue;
        }

        props.push(
          this.create(
            character,
            element,
            visualStyle,
            classification,
          ),
        );
      }
    }

    return props;
  }

  countPhysicalElements(
    characters: LivingCharacter[],
  ): number {
    return characters.reduce(
      (total, character) =>
        total +
        character.identity
          .signatureElements
          .filter((element) => {
            const classification =
              this.classify(element);

            return (
              classification ===
                'physical-prop' ||
              classification ===
                'visual-accessory'
            );
          })
          .length,
      0,
    );
  }

  classify(
    element: string,
  ): VisualElementClassification {
    const normalized =
      element
        .trim()
        .toLowerCase();

    if (
      this.includesAny(
        normalized,
        [
          'سؤال',
          'عبارة',
          'جملة',
          'كلمة',
          'يقول',
          'ماذا لم نلاحظ',
        ],
      )
    ) {
      return 'dialogue-signature';
    }

    if (
      this.includesAny(
        normalized,
        [
          'ضحكة',
          'ابتسامة',
          'صمت',
          'توتر',
          'تردد',
          'نظرة',
          'انفعال',
        ],
      )
    ) {
      return 'emotional-signature';
    }

    if (
      this.includesAny(
        normalized,
        [
          'حركة',
          'مشي',
          'وقفة',
          'التفات',
          'إشارة بيده',
        ],
      )
    ) {
      return 'movement-signature';
    }

    if (
      this.includesAny(
        normalized,
        [
          'عادة',
          'سلوك',
          'يفعل',
          'التصرف',
          'قبل اتخاذ القرار',
        ],
      )
    ) {
      return 'behavioral-signature';
    }

    if (
      this.includesAny(
        normalized,
        [
          'نظارات',
          'شارة',
          'حزام',
          'حقيبة',
          'قلادة',
          'قبعة',
          'سوار',
          'ملابس',
        ],
      )
    ) {
      return 'visual-accessory';
    }

    if (
      this.includesAny(
        normalized,
        [
          'عدسة',
          'دفتر',
          'خريطة',
          'أداة',
          'جهاز',
          'مفتاح',
          'كتاب',
          'مصباح',
          'سيف',
          'درع',
        ],
      )
    ) {
      return 'physical-prop';
    }

    return 'behavioral-signature';
  }

  private create(
    character: LivingCharacter,
    propName: string,
    visualStyle: string,
    classification:
      | 'physical-prop'
      | 'visual-accessory',
  ): PropReferenceSheet {
    const colors =
      this.colors(character);

    return {
      referenceId: randomUUID(),

      propName,

      ownerCharacterId:
        character.identity.characterId,

      ownerCharacterName:
        character.identity.canonicalName,

      description:
        classification ===
        'visual-accessory'
          ? `إكسسوار بصري ثابت مرتبط بشخصية ${character.identity.canonicalName}: ${propName}.`
          : `أداة مادية ثابتة مرتبطة بشخصية ${character.identity.canonicalName}: ${propName}.`,

      material:
        this.material(propName),

      scaleDescription:
        this.scale(propName),

      colors,

      functionalBehavior:
        this.behavior(propName),

      storyImportance:
        classification ===
        'visual-accessory'
          ? 'جزء ثابت من هوية الشخصية البصرية ولا يجوز تغييره بين اللقطات.'
          : 'أداة مادية قابلة للاستخدام سرديًا مع الحفاظ على تصميمها الثابت.',

      canonicalPrompt: [
        visualStyle,
        classification ===
        'visual-accessory'
          ? `visual accessory reference sheet for ${propName}`
          : `physical prop reference sheet for ${propName}`,

        `مالك العنصر ${character.identity.canonicalName}`,
        `المادة ${this.material(propName)}`,
        `المقياس ${this.scale(propName)}`,

        `الألوان ${colors
          .map(
            (color) =>
              `${color.name} ${color.hex}`,
          )
          .join('، ')}`,

        'front view',
        'side view',
        'three-quarter view',
        'white studio background',
        'same exact design in all views',
        'no text',
      ].join('. '),

      negativePrompt: [
        'تغير الشكل',
        'اختلاف اللون',
        'اختلاف الحجم',
        'أجزاء إضافية',
        'تشوه',
        'تحويل السلوك إلى جسم مادي',
        'كتابة',
        'شعار',
        'علامة مائية',
      ].join('، '),

      continuityKeys: [
        `prop-${propName}`,
        `classification-${classification}`,
        `owner-${character.identity.characterId}`,
      ],

      status: 'draft',
    };
  }

  private includesAny(
    value: string,
    patterns: string[],
  ): boolean {
    return patterns.some(
      (pattern) =>
        value.includes(pattern),
    );
  }

  private colors(
    character: LivingCharacter,
  ): CanonicalColor[] {
    return [
      {
        name: 'لون أساسي',

        hex:
          character.identity.canonicalName
            .includes('نُور')
            ? '#F2C14E'
            : character.identity.canonicalName
                .includes('رَام')
              ? '#AAB4BE'
              : '#A6AFBD',

        usage:
          'السطح الرئيسي للعنصر',

        locked: true,
      },

      {
        name: 'لون ثانوي',

        hex:
          character.identity.canonicalName
            .includes('نُور')
            ? '#6FAE63'
            : character.identity.canonicalName
                .includes('رَام')
              ? '#E88C3A'
              : '#243A66',

        usage:
          'التفاصيل والحواف',

        locked: true,
      },
    ];
  }

  private material(
    propName: string,
  ): string {
    if (
      propName.includes('عدسة') ||
      propName.includes('نظارات')
    ) {
      return 'زجاج مضيء ومعدن مطفي.';
    }

    if (
      propName.includes('دفتر') ||
      propName.includes('شارة')
    ) {
      return 'معدن قديم مصقول مع نقوش هندسية.';
    }

    if (
      propName.includes('حقيبة') ||
      propName.includes('حزام')
    ) {
      return 'قماش متين مع أجزاء معدنية خفيفة.';
    }

    return 'مادة ثابتة معتمدة ضمن الهوية البصرية.';
  }

  private scale(
    propName: string,
  ): string {
    if (propName.includes('حقيبة')) {
      return 'بعرض يقارب ثلث عرض جسم الشخصية.';
    }

    if (propName.includes('دفتر')) {
      return 'بحجم يسمح بحمله بيد واحدة.';
    }

    if (propName.includes('نظارات')) {
      return 'متوافقة بدقة مع حجم وجه الشخصية.';
    }

    if (propName.includes('شارة')) {
      return 'صغيرة ومثبتة بوضوح على الملابس.';
    }

    return 'حجم ثابت متناسب مع يد وجسم الشخصية.';
  }

  private behavior(
    propName: string,
  ): string[] {
    if (propName.includes('عدسة')) {
      return [
        'تضيء عند وجود دليل قريب.',
        'يتغير وهجها دون تغيير شكلها.',
      ];
    }

    if (propName.includes('نظارات')) {
      return [
        'تتحرك العدسات أو تتغير المعلومات المعروضة.',
        'لا يتغير الإطار الأساسي.',
      ];
    }

    if (propName.includes('دفتر')) {
      return [
        'يفتح بألواح معدنية متتابعة.',
        'يحفظ السجلات والرموز.',
      ];
    }

    return [
      'وظيفة ثابتة وفق سياق القصة.',
      'عدم تغيير التصميم أثناء الاستخدام.',
    ];
  }
}
