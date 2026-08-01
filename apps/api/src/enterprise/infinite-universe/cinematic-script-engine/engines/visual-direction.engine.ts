import { Injectable } from '@nestjs/common';

import type {
  CameraInstruction,
  LightingInstruction,
  SoundInstruction,
} from '../models/cinematic-script.models';

@Injectable()
export class VisualDirectionEngine {
  camera(
    sceneType: string,
    characters: string[],
    durationSeconds: number,
  ): CameraInstruction[] {
    const mainCharacter =
      characters[0] ?? 'الشخصية الرئيسية';

    const base: CameraInstruction[] = [
      {
        order: 1,
        shot: 'establishing-wide',
        subject: 'الموقع الكامل',

        movement:
          'حركة بطيئة إلى الداخل',

        framingPurpose:
          'تعريف المكان وإظهار الجو النفسي قبل ظهور الحوار.',

        durationSeconds:
          Math.min(
            8,
            durationSeconds * 0.1,
          ),
      },

      {
        order: 2,
        shot: 'medium',
        subject: mainCharacter,

        movement:
          'تتبع خفيف',

        framingPurpose:
          'ربط المشاهد بالشخصية المحورية.',

        durationSeconds:
          Math.min(
            10,
            durationSeconds * 0.12,
          ),
      },
    ];

    if (
      sceneType === 'decision' ||
      sceneType === 'emotional-payoff'
    ) {
      base.push({
        order: 3,
        shot: 'close-up',
        subject: mainCharacter,

        movement:
          'ثابت مع اقتراب طفيف',

        framingPurpose:
          'إظهار التردد أو التحول النفسي قبل القرار.',

        durationSeconds: 6,
      });
    }

    if (
      sceneType === 'discovery' ||
      sceneType === 'reversal'
    ) {
      base.push({
        order: 3,
        shot: 'insert',
        subject: 'الدليل أو العنصر المكتشف',

        movement:
          'قطع مباشر ثم تركيز بصري',

        framingPurpose:
          'توجيه الانتباه إلى المعلومة الجديدة دون شرح زائد.',

        durationSeconds: 5,
      });
    }

    return base;
  }

  lighting(
    sceneType: string,
    emotionalTarget: string,
  ): LightingInstruction {
    if (
      sceneType === 'discovery' ||
      sceneType === 'reversal'
    ) {
      return {
        mood:
          'غموض قابل للاكتشاف',

        source:
          'إضاءة جانبية مع مصدر ضوء صغير صادر من الدليل',

        intensity: 58,
        colorTemperature: 'mixed',

        psychologicalPurpose:
          'الجمع بين الأمان البصري والإحساس بوجود حقيقة مخفية.',
      };
    }

    if (
      sceneType === 'conflict' ||
      sceneType === 'decision'
    ) {
      return {
        mood:
          'توتر عاطفي معتدل',

        source:
          'إضاءة علوية ناعمة مع ظلال خفيفة على الوجوه',

        intensity: 62,
        colorTemperature: 'neutral',

        psychologicalPurpose:
          'إظهار جدية القرار دون جعل المشهد مخيفًا للأطفال.',
      };
    }

    return {
      mood: emotionalTarget,

      source:
        'إضاءة طبيعية دافئة موزعة على المكان',

      intensity: 75,
      colorTemperature: 'warm',

      psychologicalPurpose:
        'المحافظة على الأمان والانتماء البصري.',
    };
  }

  sound(
    sceneType: string,
    emotionalTarget: string,
  ): SoundInstruction {
    const silenceRequired =
      sceneType === 'decision' ||
      sceneType === 'reversal';

    return {
      ambience: [
        'أصوات بيئية خفيفة مرتبطة بالموقع',
        'حركة هواء ناعمة',
      ],

      soundEffects:
        sceneType === 'discovery'
          ? [
              'طنين خافت',
              'نقرة ميكانيكية دقيقة',
            ]
          : [
              'حركة ملابس',
              'خطوات خفيفة',
            ],

      musicMood:
        emotionalTarget,

      musicIntensity:
        sceneType === 'conflict'
          ? 65
          : sceneType === 'reversal'
            ? 72
            : 38,

      silenceRequired,

      silencePurpose:
        silenceRequired
          ? 'منح القرار أو الاكتشاف وزنًا نفسيًا قبل الحوار التالي.'
          : undefined,
    };
  }
}
