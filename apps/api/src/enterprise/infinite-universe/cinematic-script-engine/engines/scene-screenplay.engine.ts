import { Injectable } from '@nestjs/common';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import type {
  EndlessEpisode,
  EpisodeScene,
} from '../../episode-engine/models/episode-engine.models';

import {
  CharacterVoiceEngine,
  DynamicDialogueContext,
} from './character-voice.engine';

import { ScriptAudienceSafetyEngine } from './script-audience-safety.engine';
import { VisualDirectionEngine } from './visual-direction.engine';

import type {
  CinematicSceneScript,
  ScriptActionBeat,
  ScriptDialogueLine,
} from '../models/cinematic-script.models';

@Injectable()
export class SceneScreenplayEngine {
  constructor(
    private readonly voice:
      CharacterVoiceEngine,

    private readonly visual:
      VisualDirectionEngine,

    private readonly safety:
      ScriptAudienceSafetyEngine,
  ) {}

  create(
    episode: EndlessEpisode,
    sourceScene: EpisodeScene,
    characters: LivingCharacter[],
    includeCamera: boolean,
    includeLighting: boolean,
    includeSound: boolean,
    includeSubtext: boolean,
    previousEpisodeDialogue:
      string[] = [],
  ): CinematicSceneScript {
    const cast =
      sourceScene
        .participatingCharacterIds
        .map(
          (characterId) =>
            characters.find(
              (character) =>
                character.identity
                  .characterId ===
                characterId,
            ),
        )
        .filter(
          (
            character,
          ): character is LivingCharacter =>
            Boolean(character),
        );

    const dialogue =
      this.createDialogueSequence(
        episode,
        sourceScene,
        cast,
        includeSubtext,
        previousEpisodeDialogue,
      );

    const actions =
      this.actions(
        sourceScene,
        cast,
      );

    const safetyAssessment =
      this.safety.assess(
        episode.audienceTier,
        dialogue.map(
          (line) =>
            line.dialogue,
        ),
        sourceScene.type,
      );

    return {
      sceneNumber:
        sourceScene.sceneNumber,

      sourceSceneType:
        sourceScene.type,

      heading:
        `${sourceScene.location} — ${this.timeOfDay(sourceScene.sceneNumber)}`,

      location:
        sourceScene.location,

      timeOfDay:
        this.timeOfDay(
          sourceScene.sceneNumber,
        ),

      targetDurationSeconds:
        sourceScene
          .estimatedDurationSeconds,

      dramaticPurpose:
        sourceScene.purpose,

      psychologicalPurpose:
        `رفع ${sourceScene.emotionalTarget} مع الحفاظ على الاستمرارية النفسية للشخصيات.`,

      openingVisual:
        this.openingVisual(
          sourceScene,
          cast,
        ),

      actionBeats:
        actions,

      dialogue,

      camera:
        includeCamera
          ? this.visual.camera(
              sourceScene.type,
              cast.map(
                (character) =>
                  character.identity
                    .canonicalName,
              ),
              sourceScene
                .estimatedDurationSeconds,
            )
          : [],

      lighting:
        includeLighting
          ? this.visual.lighting(
              sourceScene.type,
              sourceScene.emotionalTarget,
            )
          : {
              mood: 'unspecified',
              source: 'unspecified',
              intensity: 50,
              colorTemperature:
                'neutral',

              psychologicalPurpose:
                'لم يتم طلب تخطيط الإضاءة.',
            },

      sound:
        includeSound
          ? this.visual.sound(
              sourceScene.type,
              sourceScene.emotionalTarget,
            )
          : {
              ambience: [],
              soundEffects: [],
              musicMood:
                'unspecified',

              musicIntensity: 0,
              silenceRequired: false,
            },

      sceneArc: {
        openingEmotion:
          sourceScene.sceneNumber === 1
            ? 'الهدوء والفضول'
            : 'استمرار أثر المشهد السابق',

        peakEmotion:
          sourceScene.emotionalTarget,

        closingEmotion:
          this.closingEmotion(
            sourceScene.type,
          ),

        curiosityStart:
          Math.max(
            0,
            50 -
            sourceScene.curiosityDelta,
          ),

        curiosityEnd:
          Math.min(
            100,
            50 +
            sourceScene.curiosityDelta,
          ),

        tensionStart:
          Math.max(
            0,
            40 -
            sourceScene.tensionDelta,
          ),

        tensionEnd:
          Math.min(
            100,
            40 +
            sourceScene.tensionDelta,
          ),
      },

      continuityReferences:
        sourceScene
          .continuityReferences,

      futureSeeds:
        sourceScene.futureSeeds,

      safetyAssessment,
    };
  }

  private createDialogueSequence(
    episode: EndlessEpisode,
    scene: EpisodeScene,
    cast: LivingCharacter[],
    includeSubtext: boolean,
    previousEpisodeDialogue: string[],
  ): ScriptDialogueLine[] {
    const generated: ScriptDialogueLine[] =
      [];

    const usedDialogue = [
      ...previousEpisodeDialogue,
    ];

    for (
      let index = 0;
      index < cast.length;
      index += 1
    ) {
      const character =
        cast[index];

      if (!character) {
        continue;
      }

      const context:
        DynamicDialogueContext = {
          sceneNumber:
            scene.sceneNumber,

          sceneType:
            scene.type,

          scenePurpose:
            scene.purpose,

          storyThread:
            episode.sourceStoryThread,

          location:
            scene.location,

          emotionalTarget:
            scene.emotionalTarget,

          previousDialogueLines:
            usedDialogue,

          otherCharacterNames:
            cast
              .filter(
                (other) =>
                  other.identity
                    .characterId !==
                  character.identity
                    .characterId,
              )
              .map(
                (other) =>
                  other.identity
                    .canonicalName,
              ),

          discoveryDetail:
            scene.type === 'discovery'
              ? 'رمز محفور يستجيب للضوء'
              : undefined,

          conflictDetail:
            scene.type === 'conflict'
              ? 'الخلاف حول فتح الطريق'
              : undefined,

          decisionDetail:
            scene.type === 'decision'
              ? 'الدخول باتفاق أو العودة'
              : undefined,

          reversalDetail:
            scene.type === 'reversal'
              ? 'الإشارة تقود إلى أسفل المدينة'
              : undefined,
        };

      const line =
        this.voice.createDialogue(
          character,
          index + 1,
          context,
          includeSubtext,
        );

      generated.push(line);
      usedDialogue.push(
        line.dialogue,
      );
    }

    return generated;
  }

  private actions(
    scene: EpisodeScene,
    cast: LivingCharacter[],
  ): ScriptActionBeat[] {
    const ids =
      cast.map(
        (character) =>
          character.identity.characterId,
      );

    const names =
      cast.map(
        (character) =>
          character.identity.canonicalName,
      );

    const actions =
      this.actionTemplate(
        scene.type,
        scene.location,
        names,
      );

    return actions.map(
      (action, index) => ({
        beatNumber:
          index + 1,

        action:
          action.action,

        purpose:
          action.purpose,

        participatingCharacterIds:
          index === 1
            ? ids.slice(0, 1)
            : ids,

        emotionalMeaning:
          action.emotionalMeaning,

        visualPriority:
          action.visualPriority,
      }),
    );
  }

  private actionTemplate(
    sceneType: string,
    location: string,
    names: string[],
  ) {
    const cast =
      names.join(' و');

    if (
      sceneType ===
      'opening-hook'
    ) {
      return [
        {
          action:
            `تتحرك الحياة طبيعيًا في ${location} قبل أن يظهر وميض سريع خلف أحد الأبنية.`,

          purpose:
            'فتح سؤال بصري فوري.',

          emotionalMeaning:
            'الانتقال من الأمان إلى الفضول.',

          visualPriority: 95,
        },

        {
          action:
            `${names[0] ?? 'الشخصية الرئيسية'} تتوقف وحدها وتتابع مصدر الوميض بعينيها.`,

          purpose:
            'ربط الاكتشاف بالشخصية الرئيسية.',

          emotionalMeaning:
            'الشعور بأن شيئًا مهمًا بدأ.',

          visualPriority: 100,
        },

        {
          action:
            `${cast} يقتربون من العلامة التي ظهرت على الجدار.`,

          purpose:
            'جمع الشخصيات داخل الحدث.',

          emotionalMeaning:
            'فضول جماعي.',

          visualPriority: 88,
        },
      ];
    }

    if (
      sceneType ===
      'discovery'
    ) {
      return [
        {
          action:
            `تنفتح فجوة ضوئية صغيرة داخل جدار ${location}.`,

          purpose:
            'إظهار الدليل الجديد بصريًا.',

          emotionalMeaning:
            'دهشة آمنة.',

          visualPriority: 100,
        },

        {
          action:
            `${names[0] ?? 'الشخصية الرئيسية'} تقارن الرمز الظاهر بعلامة تحملها معها.`,

          purpose:
            'ربط الاكتشاف بخيط سابق.',

          emotionalMeaning:
            'إحساس بالارتباط والقدر.',

          visualPriority: 98,
        },

        {
          action:
            `${cast} يلاحظون أن النقش يتغير عند اقترابهم.`,

          purpose:
            'تصعيد الغموض.',

          emotionalMeaning:
            'اكتشاف متحرك.',

          visualPriority: 92,
        },
      ];
    }

    if (
      sceneType ===
      'conflict'
    ) {
      return [
        {
          action:
            `${names[1] ?? 'إحدى الشخصيات'} يقف بين الآخرين وبين المدخل.`,

          purpose:
            'تجسيد الخلاف بصريًا.',

          emotionalMeaning:
            'حماية مقابل فضول.',

          visualPriority: 95,
        },

        {
          action:
            `${names[0] ?? 'الشخصية الرئيسية'} تخفض يدها بعيدًا عن الباب وتختار الحوار.`,

          purpose:
            'الحفاظ على سلامة الأطفال وإظهار ضبط النفس.',

          emotionalMeaning:
            'التوتر مع إمكانية الإصلاح.',

          visualPriority: 90,
        },

        {
          action:
            `${names[2] ?? 'الشخصية الثالثة'} يحاول تخفيف التوتر لكنه يكشف معلومة جديدة بالخطأ.`,

          purpose:
            'تحويل الخلاف إلى تقدم سردي.',

          emotionalMeaning:
            'مفاجأة خفيفة.',

          visualPriority: 88,
        },
      ];
    }

    if (
      sceneType ===
      'decision'
    ) {
      return [
        {
          action:
            `يبدأ الضوء داخل ${location} بالضعف، مما يجعل الوقت محدودًا.`,

          purpose:
            'خلق ضغط قرار واضح.',

          emotionalMeaning:
            'الاختيار تحت ضغط معتدل.',

          visualPriority: 96,
        },

        {
          action:
            `${names[0] ?? 'الشخصية الرئيسية'} تنظر إلى كل صديق قبل أن تعلن قرارها.`,

          purpose:
            'إظهار أن العلاقة جزء من القرار.',

          emotionalMeaning:
            'تعاطف ومسؤولية.',

          visualPriority: 100,
        },

        {
          action:
            `تضع الشخصيات قواعد مشتركة قبل التقدم.`,

          purpose:
            'تحويل الخلاف إلى تعاون.',

          emotionalMeaning:
            'استعادة الثقة.',

          visualPriority: 92,
        },
      ];
    }

    if (
      sceneType ===
      'reversal'
    ) {
      return [
        {
          action:
            `يتوقف الجهاز فجأة ثم يدور مؤشره نحو أرضية ${location}.`,

          purpose:
            'قلب فهم الشخصيات للحدث.',

          emotionalMeaning:
            'مفاجأة منطقية.',

          visualPriority: 100,
        },

        {
          action:
            `${names[1] ?? 'إحدى الشخصيات'} يعيد قراءة الأسهم ويكتشف أنها معكوسة.`,

          purpose:
            'إسناد المفاجأة إلى تحليل الشخصية.',

          emotionalMeaning:
            'إعادة تقييم الحقيقة.',

          visualPriority: 95,
        },

        {
          action:
            `يهتز جزء صغير من الأرض ويظهر ضوء من الأسفل.`,

          purpose:
            'فتح سؤال للحلقة التالية.',

          emotionalMeaning:
            'دهشة وفضول.',

          visualPriority: 100,
        },
      ];
    }

    return [
      {
        action:
          `${cast} يدخلون ${location} بينما يتغير الجو المحيط بهم.`,

        purpose:
          'بدء المشهد.',

        emotionalMeaning:
          sceneType,

        visualPriority: 85,
      },

      {
        action:
          `${names[0] ?? 'الشخصية الرئيسية'} تلاحظ تفصيلًا جديدًا.`,

        purpose:
          'تحريك الحدث.',

        emotionalMeaning:
          'فضول',

        visualPriority: 90,
      },

      {
        action:
          'تتفاعل الشخصيات مع الحدث بطرق مختلفة.',

        purpose:
          'إظهار اختلاف الشخصيات.',

        emotionalMeaning:
          'تباين نفسي',

        visualPriority: 85,
      },
    ];
  }

  private openingVisual(
    scene: EpisodeScene,
    cast: LivingCharacter[],
  ): string {
    const lead =
      cast[0]?.identity
        .canonicalName ??
      'الشخصية الرئيسية';

    if (
      scene.type ===
      'opening-hook'
    ) {
      return `لقطة جوية لمدينة البدايات في الصباح. يظهر وميض أخضر قصير خلف مبنى بعيد، ثم نقترب من ${lead} عندما تتوقف عن السير.`;
    }

    if (
      scene.type ===
      'discovery'
    ) {
      return `داخل الأرشيف المخفي، يمر الضوء فوق نقش قديم فيبدأ الرمز بالتوهج أمام ${lead}.`;
    }

    if (
      scene.type ===
      'conflict'
    ) {
      return `تتوقف الشخصيات أمام مدخل ضيق، ويقف ساهر بين الباب والآخرين بينما تخفت الموسيقى.`;
    }

    if (
      scene.type ===
      'decision'
    ) {
      return `تنعكس أضواء متقطعة على وجوه الشخصيات بينما ينخفض صوت الجهاز تدريجيًا.`;
    }

    if (
      scene.type ===
      'reversal'
    ) {
      return `لقطة قريبة لمؤشر الجهاز وهو يغير اتجاهه ببطء من الجدار إلى الأرض.`;
    }

    return `لقطة واسعة لـ ${scene.location} قبل انتقال التركيز إلى ${lead}.`;
  }

  private closingEmotion(
    sceneType: string,
  ): string {
    if (
      sceneType ===
      'conflict'
    ) {
      return 'توتر قابل للحوار';
    }

    if (
      sceneType ===
      'decision'
    ) {
      return 'ثقة حذرة';
    }

    if (
      sceneType ===
      'reversal'
    ) {
      return 'دهشة وأسئلة جديدة';
    }

    if (
      sceneType ===
      'discovery'
    ) {
      return 'فضول متصاعد';
    }

    return 'فضول مستمر';
  }

  private timeOfDay(
    sceneNumber: number,
  ): string {
    if (sceneNumber <= 2) {
      return 'صباح';
    }

    if (sceneNumber <= 5) {
      return 'بعد الظهر';
    }

    return 'الغروب';
  }
}

