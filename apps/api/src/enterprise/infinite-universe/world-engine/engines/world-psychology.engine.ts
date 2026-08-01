import { Injectable } from '@nestjs/common';

import { CreateWorldDto } from '../dto/create-world.dto';
import type {
  PsychologicalWorldProfile,
} from '../models/world-engine.models';

@Injectable()
export class WorldPsychologyEngine {
  create(
    dto: CreateWorldDto,
  ): PsychologicalWorldProfile {
    const audienceDefaults:
      Record<string, string[]> = {
        kids: [
          'الفضول',
          'الأمان',
          'الصداقة',
          'الثقة',
        ],

        junior: [
          'الانتماء',
          'المنافسة',
          'الشجاعة',
          'إثبات الذات',
        ],

        teen: [
          'الهوية',
          'القبول',
          'الاستقلال',
          'الخيانة',
          'الطموح',
        ],

        adult: [
          'السلطة',
          'الخوف',
          'الطمع',
          'الندم',
          'المعنى',
          'المسؤولية',
        ],

        family: [
          'الترابط',
          'التعاطف',
          'الاختلاف',
          'المسامحة',
        ],
      };

    const requested =
      dto.requiredPsychologicalThemes ?? [];

    return {
      primaryEmotions: [
        ...new Set([
          ...(audienceDefaults[
            dto.audienceTier
          ] ?? []),

          ...requested,
        ]),
      ],

      recurringConflicts:
        this.conflicts(dto.audienceTier),

      moralComplexity:
        dto.audienceTier === 'kids'
          ? 35
          : dto.audienceTier === 'junior'
            ? 50
            : dto.audienceTier === 'teen'
              ? 75
              : 90,

      emotionalIntensity:
        dto.audienceTier === 'kids'
          ? 45
          : dto.audienceTier === 'junior'
            ? 60
            : dto.audienceTier === 'teen'
              ? 82
              : 88,

      psychologicalContinuity: true,
      delayedPayoffEnabled: true,
      longTermTraumaEnabled:
        dto.audienceTier === 'teen' ||
        dto.audienceTier === 'adult',

      characterMemoryRequired: true,
    };
  }

  private conflicts(
    tier: string,
  ): string[] {
    if (tier === 'kids') {
      return [
        'الخوف مقابل الفضول',
        'المصلحة الفردية مقابل التعاون',
      ];
    }

    if (tier === 'junior') {
      return [
        'الانتماء مقابل الاستقلال',
        'الفوز مقابل العدالة',
      ];
    }

    if (tier === 'teen') {
      return [
        'الهوية الحقيقية مقابل قبول المجتمع',
        'الثقة مقابل الخيانة',
        'الطموح مقابل العلاقات',
      ];
    }

    return [
      'القوة مقابل الأخلاق',
      'الحقيقة مقابل الاستقرار',
      'النجاح مقابل السلام الداخلي',
      'الولاء مقابل المصلحة',
    ];
  }
}
