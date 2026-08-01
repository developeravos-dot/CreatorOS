import { Injectable } from '@nestjs/common';

import type { LivingWorld } from '../../world-engine/models/world-engine.models';

import type {
  EpisodeCharacterSelection,
  EpisodeScene,
  EpisodeTone,
  StoryPressureProfile,
} from '../models/episode-engine.models';

@Injectable()
export class EpisodeScenePlannerEngine {
  createScenes(
    world: LivingWorld,
    characters:
      EpisodeCharacterSelection[],
    storyThread: string,
    tone: EpisodeTone,
    pressure:
      StoryPressureProfile,
    targetDurationMinutes: number,
    requireCliffhanger: boolean,
  ): EpisodeScene[] {
    const names =
      characters.map(
        (character) =>
          character.characterName,
      );

    const ids =
      characters.map(
        (character) =>
          character.characterId,
      );

    const locationNames =
      world.locations.map(
        (location) =>
          location.name,
      );

    const seconds =
      targetDurationMinutes * 60;

    const sceneCount =
      targetDurationMinutes <= 8
        ? 6
        : targetDurationMinutes <= 15
          ? 8
          : 10;

    const durationPerScene =
      Math.max(
        30,
        Math.round(
          seconds / sceneCount,
        ),
      );

    const templates:
      Array<{
        type: EpisodeScene['type'];
        title: string;
        purpose: string;
        emotionalTarget: string;
        curiosityDelta: number;
        tensionDelta: number;
        empathyDelta: number;
      }> = [
        {
          type: 'opening-hook',
          title: 'إشارة غير متوقعة',
          purpose:
            'فتح سؤال مباشر خلال الثواني الأولى.',
          emotionalTarget:
            'الفضول',
          curiosityDelta: 18,
          tensionDelta: 5,
          empathyDelta: 0,
        },

        {
          type: 'setup',
          title: 'اليوم العادي الذي لن يبقى عاديًا',
          purpose:
            'إظهار الحالة الحالية للشخصيات قبل الصراع.',
          emotionalTarget:
            'الأمان والارتباط',
          curiosityDelta: 5,
          tensionDelta: -3,
          empathyDelta: 12,
        },

        {
          type: 'discovery',
          title: 'جزء جديد من الحقيقة',
          purpose:
            'ربط الشخصيات بخيط القصة المختار.',
          emotionalTarget:
            'الاكتشاف',
          curiosityDelta: 15,
          tensionDelta: 8,
          empathyDelta: 3,
        },

        {
          type: 'conflict',
          title: 'اختلاف في الطريق',
          purpose:
            'إظهار التعارض بين الأهداف والخوف والعلاقات.',
          emotionalTarget:
            'التوتر',
          curiosityDelta: 5,
          tensionDelta: 18,
          empathyDelta: 8,
        },

        {
          type: 'decision',
          title: 'قرار لا يمكن تجاهله',
          purpose:
            'إجبار الشخصية الرئيسية على اختيار متوافق مع تاريخها النفسي.',
          emotionalTarget:
            'التعاطف',
          curiosityDelta: 4,
          tensionDelta: 12,
          empathyDelta: 18,
        },

        {
          type: 'reversal',
          title: 'الحقيقة ليست كما بدت',
          purpose:
            'تغيير فهم الجمهور دون كسر منطق العالم.',
          emotionalTarget:
            'المفاجأة',
          curiosityDelta: 20,
          tensionDelta: 12,
          empathyDelta: 3,
        },

        {
          type: 'emotional-payoff',
          title: 'لحظة مواجهة صادقة',
          purpose:
            'منح المشاهد مكافأة عاطفية بعد الضغط.',
          emotionalTarget:
            'الأمل',
          curiosityDelta: -3,
          tensionDelta: -15,
          empathyDelta: 20,
        },

        {
          type: requireCliffhanger
            ? 'cliffhanger'
            : 'resolution',

          title: requireCliffhanger
            ? 'الباب الذي فُتح'
            : 'نتيجة مؤقتة',

          purpose:
            requireCliffhanger
              ? 'فتح خيط للحلقة التالية.'
              : 'إغلاق صراع الحلقة مع إبقاء العالم مستمرًا.',

          emotionalTarget:
            requireCliffhanger
              ? 'الفضول المستقبلي'
              : 'الرضا',

          curiosityDelta:
            requireCliffhanger
              ? 20
              : -5,

          tensionDelta:
            requireCliffhanger
              ? 8
              : -18,

          empathyDelta: 8,
        },
      ];

    return templates
      .slice(0, sceneCount)
      .map(
        (template, index) => ({
          sceneNumber:
            index + 1,

          type:
            template.type,

          title:
            template.title,

          location:
            locationNames[
              index %
              Math.max(
                1,
                locationNames.length,
              )
            ] ??
            'مدينة البدايات',

          participatingCharacterIds:
            ids,

          participatingCharacterNames:
            names,

          purpose:
            template.purpose,

          summary:
            this.summary(
              template.type,
              names,
              storyThread,
              tone,
              pressure,
            ),

          emotionalTarget:
            template.emotionalTarget,

          curiosityDelta:
            template.curiosityDelta,

          tensionDelta:
            template.tensionDelta,

          empathyDelta:
            template.empathyDelta,

          continuityReferences: [
            storyThread,
          ],

          futureSeeds:
            template.type ===
            'cliffhanger'
              ? [
                  `ظهور دليل جديد مرتبط بـ ${storyThread}`,
                ]
              : [],

          estimatedDurationSeconds:
            durationPerScene,
        }),
      );
  }

  private summary(
    type: EpisodeScene['type'],
    names: string[],
    storyThread: string,
    tone: EpisodeTone,
    pressure:
      StoryPressureProfile,
  ): string {
    const cast =
      names.join(' و');

    return `مشهد ${type} يضع ${cast} أمام تطور مرتبط بـ "${storyThread}" ضمن نبرة ${tone}، مع الحفاظ على ضغط ${pressure.dominantPressure}.`;
  }
}
