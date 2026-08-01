import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  LivingWorld,
  WorldLocation,
} from '../../world-engine/models/world-engine.models';

import type {
  CanonicalColor,
  EnvironmentReferenceSheet,
} from '../models/visual-reference-bible.models';

@Injectable()
export class EnvironmentReferenceBibleEngine {
  create(
    world: LivingWorld,
    location: WorldLocation,
    visualStyle: string,
    includeVariants: boolean,
  ): EnvironmentReferenceSheet {
    const colors =
      this.palette(location);

    const canonicalPrompt = [
      visualStyle,
      `بيئة أصلية باسم ${location.name}`,
      location.description,
      `النبرة العاطفية: ${location.emotionalTone}`,
      `الألوان الثابتة: ${colors.map(
        (color) =>
          `${color.name} ${color.hex}`,
      ).join('، ')}`,
      this.architecture(location),
      `عدد السكان المرجعي ${location.population}`,
      'رسوم متحركة سينمائية مناسبة للأطفال',
      'هوية مكان ثابتة',
      'تكوين قابل لإعادة الاستخدام',
      'بدون كتابة أو شعارات',
    ].join('. ');

    return {
      referenceId: randomUUID(),

      locationName:
        location.name,

      locationType:
        location.type,

      canonicalDescription:
        location.description,

      emotionalTone:
        location.emotionalTone,

      architecturalLanguage:
        this.architecture(location),

      materials:
        this.materials(location),

      recurringObjects:
        this.recurringObjects(location),

      colorPalette:
        colors,

      timeOfDayVariants:
        includeVariants
          ? [
              this.variant(
                location,
                canonicalPrompt,
                'صباح',
                'إضاءة ذهبية ناعمة وظلال قصيرة.',
                'حيوية وأمان وفضول.',
              ),

              this.variant(
                location,
                canonicalPrompt,
                'بعد الظهر',
                'إضاءة متوازنة أكثر وضوحًا.',
                'نشاط واكتشاف.',
              ),

              this.variant(
                location,
                canonicalPrompt,
                'الغروب',
                'ضوء برتقالي دافئ وظلال طويلة.',
                'غموض آمن وانتقال سردي.',
              ),
            ]
          : [],

      cameraLandmarks:
        this.landmarks(location),

      prohibitedChanges: [
        'عدم تغيير المخطط العام للمكان.',
        'عدم تغيير الألوان الأساسية.',
        'عدم إضافة مبانٍ حديثة غير معتمدة.',
        'عدم إزالة العناصر المرجعية المتكررة.',
        'عدم تغيير مقياس الأبواب مقارنة بالشخصيات.',
        'عدم إضافة كتابة أو شعارات.',
      ],

      canonicalPrompt,

      negativePrompt: [
        'تغير تصميم البيئة',
        'اختلاف معماري بين اللقطات',
        'ألوان غير معتمدة',
        'ازدحام مبالغ',
        'مبانٍ مشوهة',
        'منظور خاطئ',
        'كتابة',
        'شعار',
        'علامة مائية',
        'رعب قاس',
        'إضاءة مظلمة مخيفة',
      ].join(', '),

      continuityKeys: [
        `location-${location.id}`,
        `name-${location.name}`,
        `type-${location.type}`,
        `tone-${location.emotionalTone}`,
      ],

      status: 'draft',
    };
  }

  private variant(
    location: WorldLocation,
    canonicalPrompt: string,
    timeOfDay: string,
    lightingDescription: string,
    atmosphereDescription: string,
  ) {
    return {
      timeOfDay,
      lightingDescription,
      atmosphereDescription,

      imagePrompt: [
        canonicalPrompt,
        `الوقت: ${timeOfDay}`,
        lightingDescription,
        atmosphereDescription,
        'لقطة establishing wide',
        'بيئة فارغة دون شخصيات',
        'مرجع تصميم ثابت',
      ].join('. '),
    };
  }

  private palette(
    location: WorldLocation,
  ): CanonicalColor[] {
    if (
      location.type ===
      'hidden-place'
    ) {
      return [
        {
          name: 'أزرق الأرشيف',
          hex: '#304B6A',
          usage: 'الجدران والظلال',
          locked: true,
        },

        {
          name: 'ذهبي الذاكرة',
          hex: '#D8B45B',
          usage: 'النقوش والأدلة',
          locked: true,
        },

        {
          name: 'فيروزي الضوء',
          hex: '#58A6A6',
          usage: 'الإشارات المتوهجة',
          locked: true,
        },
      ];
    }

    if (
      location.name.includes(
        'البدايات',
      )
    ) {
      return [
        {
          name: 'رملي دافئ',
          hex: '#D9B88F',
          usage: 'المباني والساحات',
          locked: true,
        },

        {
          name: 'أخضر الحياة',
          hex: '#7AA66B',
          usage: 'النباتات',
          locked: true,
        },

        {
          name: 'أزرق السماء',
          hex: '#7FB3D5',
          usage: 'السماء والتفاصيل',
          locked: true,
        },
      ];
    }

    return [
      {
        name: 'بنفسجي التحول',
        hex: '#75648A',
        usage: 'العمارة المتغيرة',
        locked: true,
      },

      {
        name: 'ذهبي خافت',
        hex: '#C7A55B',
        usage: 'التفاصيل',
        locked: true,
      },

      {
        name: 'أخضر رمادي',
        hex: '#788C7A',
        usage: 'الطبيعة والممرات',
        locked: true,
      },
    ];
  }

  private architecture(
    location: WorldLocation,
  ): string {
    if (
      location.type ===
      'hidden-place'
    ) {
      return 'عمارة أرشيفية قديمة بانحناءات ناعمة ونقوش هندسية مضيئة، دون عناصر رعب.';
    }

    if (
      location.name.includes(
        'البدايات',
      )
    ) {
      return 'مدينة دافئة تجمع العمارة الطبيعية والتقنية البسيطة، شوارع مفتوحة ومبانٍ منخفضة.';
    }

    return 'عمارة متغيرة بصريًا تجمع الممرات المتحركة والطبيعة والتقنيات الخفيفة.';
  }

  private materials(
    location: WorldLocation,
  ): string[] {
    if (
      location.type ===
      'hidden-place'
    ) {
      return [
        'حجر أزرق معتق',
        'معدن ذهبي خافت',
        'زجاج مضيء',
      ];
    }

    return [
      'حجر دافئ',
      'خشب طبيعي',
      'معدن مطفي',
      'زجاج ناعم',
    ];
  }

  private recurringObjects(
    location: WorldLocation,
  ): string[] {
    if (
      location.type ===
      'hidden-place'
    ) {
      return [
        'نقوش الذاكرة',
        'ألواح السجلات',
        'مصادر ضوء فيروزية',
        'أبواب دائرية',
      ];
    }

    return [
      'مصابيح دائرية',
      'نباتات معلقة',
      'علامات هندسية دون كتابة',
      'ممرات حجرية',
    ];
  }

  private landmarks(
    location: WorldLocation,
  ): string[] {
    return [
      `المدخل الرئيسي لـ ${location.name}`,
      'ساحة أو نقطة تجمع مركزية',
      'عنصر بصري مرتفع لتحديد الاتجاه',
      'ممر متكرر تستخدمه الشخصيات',
    ];
  }
}
