import { Injectable } from '@nestjs/common';

import type {
  CinematicSceneScript,
  ScriptAudienceTier,
} from '../models/cinematic-script.models';

@Injectable()
export class ScriptAudienceSafetyEngine {
  assess(
    audienceTier: ScriptAudienceTier,
    dialogueTexts: string[],
    sceneType: string,
  ): CinematicSceneScript['safetyAssessment'] {
    const findings: string[] = [];
    const adjustments: string[] = [];

    const combined =
      dialogueTexts.join(' ');

    const prohibitedKidsPatterns = [
      'سأقتلك',
      'دم',
      'تعذيب',
      'لن يحبك أحد',
      'أنت عديم القيمة',
    ];

    if (audienceTier === 'kids') {
      for (
        const pattern of
        prohibitedKidsPatterns
      ) {
        if (
          combined.includes(pattern)
        ) {
          findings.push(
            `عبارة غير مناسبة للأطفال: ${pattern}`,
          );

          adjustments.push(
            `استبدال "${pattern}" بصراع غير عنيف ولغة تحافظ على الأمان النفسي.`,
          );
        }
      }

      if (
        sceneType === 'conflict'
      ) {
        adjustments.push(
          'يجب إنهاء المشهد بإشارة واضحة إلى إمكانية الحوار أو الإصلاح.',
        );
      }
    }

    return {
      suitable:
        findings.length === 0,

      audienceTier,
      findings,

      adjustments:
        adjustments.length > 0
          ? adjustments
          : [
              'لا توجد تعديلات إلزامية.',
            ],
    };
  }
}
