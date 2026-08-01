import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { PermanentUniverseMemoryService } from '../persistent-memory/permanent-universe-memory.service';

import type { LivingWorld } from '../world-engine/models/world-engine.models';
import type { LivingCharacter } from '../character-os/models/character-os.models';

import { GenerateEpisodeDto } from './dto/generate-episode.dto';

import { StoryPressureEngine } from './engines/story-pressure.engine';
import { StoryThreadSelectorEngine } from './engines/story-thread-selector.engine';
import { EpisodeCharacterCastEngine } from './engines/episode-character-cast.engine';
import { EpisodeScenePlannerEngine } from './engines/episode-scene-planner.engine';

import type {
  EndlessEpisode,
  EpisodeCharacterImpact,
  EpisodeGenerationResult,
  EpisodeTone,
} from './models/episode-engine.models';

@Injectable()
export class EndlessEpisodeEngineService {
  constructor(
    private readonly memory:
      PermanentUniverseMemoryService,

    private readonly pressureEngine:
      StoryPressureEngine,

    private readonly threadSelector:
      StoryThreadSelectorEngine,

    private readonly castEngine:
      EpisodeCharacterCastEngine,

    private readonly scenePlanner:
      EpisodeScenePlannerEngine,
  ) {}

  async generate(
    dto: GenerateEpisodeDto,
  ): Promise<EpisodeGenerationResult> {
    const world =
      await this.memory
        .loadWorld(dto.worldId);

    if (!world) {
      throw new NotFoundException(
        `World not found: ${dto.worldId}.`,
      );
    }

    const characters =
      await this.memory
        .loadCharacters(dto.worldId);

    if (characters.length === 0) {
      throw new NotFoundException(
        `No characters found for world ${dto.worldId}.`,
      );
    }

    const previousEpisodes =
      await this.memory
        .loadEpisodes(dto.worldId);

    const pressure =
      this.pressureEngine.calculate(
        world,
        characters,
        previousEpisodes,
      );

    const thread =
      this.threadSelector.select(
        world,
        previousEpisodes,
        dto.preferredStoryThread,
      );

    const selectedCharacters =
      this.castEngine.select(
        characters,
        thread.primary,
        dto.requiredCharacterIds ?? [],
        dto.excludedCharacterIds ?? [],
      );

    const episodeNumber =
      dto.episodeNumber ??
      previousEpisodes.length + 1;

    const tone =
      dto.preferredTone ??
      this.selectTone(
        pressure,
      );

    const targetDurationMinutes =
      dto.targetDurationMinutes ??
      this.defaultDuration(
        world.universeDna
          .audienceTier,
      );

    const scenes =
      this.scenePlanner.createScenes(
        world,
        selectedCharacters,
        thread.primary,
        tone,
        pressure,
        targetDurationMinutes,
        dto.requireCliffhanger ??
          true,
      );

    const characterImpacts =
      this.createImpacts(
        selectedCharacters,
        characters,
        thread.primary,
      );

    const episode:
      EndlessEpisode = {
        episodeId: randomUUID(),
        worldId: dto.worldId,

        episodeNumber,
        worldYear:
          world.endlessState
            .currentWorldYear + 1,

        title:
          this.createTitle(
            thread.primary,
            episodeNumber,
          ),

        logline:
          this.createLogline(
            selectedCharacters.map(
              (character) =>
                character.characterName,
            ),
            thread.primary,
          ),

        synopsis:
          this.createSynopsis(
            selectedCharacters.map(
              (character) =>
                character.characterName,
            ),
            thread.primary,
            pressure,
          ),

        audienceTier:
          world.universeDna
            .audienceTier,

        tone,

        sourceStoryThread:
          thread.primary,

        secondaryStoryThreads:
          thread.secondary,

        selectedCharacters,
        scenes,
        pressureProfile:
          pressure,

        characterImpacts,

        continuity: {
          previousEpisodeIds:
            previousEpisodes
              .slice(-3)
              .map(
                (episode) =>
                  episode.episodeId,
              ),

          referencedMemories:
            this.referencedMemories(
              selectedCharacters,
              characters,
            ),

          referencedMysteries:
            world.endlessState
              .activeMysteries
              .filter(
                (mystery) =>
                  thread.primary.includes(
                    mystery,
                  ) ||
                  mystery.includes(
                    thread.primary,
                  ),
              ),

          openedThreads:
            dto.allowNewMystery ===
              false
              ? []
              : [
                  `أثر جديد ناتج عن الحلقة ${episodeNumber}`,
                ],

          advancedThreads: [
            thread.primary,
          ],

          resolvedThreads:
            dto.allowThreadResolution
              ? thread.secondary.slice(
                  0,
                  1,
                )
              : [],

          continuityScore:
            this.continuityScore(
              world,
              selectedCharacters.length,
              thread.repetitionScore,
            ),

          repetitionScore:
            thread.repetitionScore,
        },

        production: {
          targetDurationMinutes,

          languageCodes:
            world.universeDna
              .languages
              .map(
                (language) =>
                  language.code,
              ),

          localizationRequired:
            world.universeDna
              .languages.length > 1,

          dialogueGenerationReady:
            true,

          visualProductionReady:
            true,
        },

        status: 'planned',

        createdAt:
          new Date().toISOString(),
      };

    await this.memory
      .saveEpisode(
        dto.worldId,
        episode,
      );

    return {
      success: true,

      engine:
        'CreatorOS Endless Episode Engine',

      version: '1.0.0',
      status:
        'episode-planned',

      episode,

      nextActions: [
        'مراجعة الحلقة واعتمادها بشريًا.',
        'توليد الحوار لكل مشهد.',
        'تطبيق آثار الحلقة بعد الاعتماد.',
        'توليد النسخ اللغوية.',
        'إرسال الحلقة إلى محرك الإنتاج البصري.',
      ],
    };
  }

  async getEpisodes(
    worldId: string,
  ) {
    return this.memory
      .loadEpisodes(worldId);
  }

  async getStatus() {
    return {
      success: true,

      engine:
        'CreatorOS Endless Episode Engine',

      version: '1.0.0',

      phase:
        'Autonomous Narrative Planning Foundation',

      status: 'operational',

      architecture: {
        permanentWorldLoading: true,
        permanentCharacterLoading: true,
        storyPressureEngine: true,
        storyThreadSelector: true,
        psychologicalCastSelection: true,
        scenePlanner: true,
        continuityGuard: true,
        repetitionGuard: true,
        multilingualProductionReadiness:
          true,

        permanentEpisodeStorage:
          true,
      },

      constitutionalRules: {
        worldBeforeEpisode: true,
        characterBeforePlot: true,
        psychologicalContinuity:
          true,

        noForcedEnding: true,
        noRandomCharacterBreak:
          true,

        audienceSafety: true,
        humanFinalAuthority: true,
      },
    };
  }

  private selectTone(
    pressure:
      ReturnType<
        StoryPressureEngine['calculate']
      >,
  ): EpisodeTone {
    if (
      pressure.fatigueRisk >
      65
    ) {
      return 'emotional';
    }

    if (
      pressure.mystery >
      70
    ) {
      return 'mystery';
    }

    if (
      pressure.tension >
      70
    ) {
      return 'tension';
    }

    if (
      pressure.curiosity >
      70
    ) {
      return 'discovery';
    }

    return 'adventure';
  }

  private defaultDuration(
    audienceTier:
      LivingWorld['universeDna']['audienceTier'],
  ): number {
    if (audienceTier === 'kids') {
      return 8;
    }

    if (
      audienceTier ===
      'junior'
    ) {
      return 12;
    }

    if (
      audienceTier ===
      'teen'
    ) {
      return 18;
    }

    return 24;
  }

  private createTitle(
    thread: string,
    episodeNumber: number,
  ): string {
    return `الحلقة ${episodeNumber}: أثر ${thread}`;
  }

  private createLogline(
    names: string[],
    thread: string,
  ): string {
    return `${names.join(' و')} يواجهون تطورًا جديدًا يكشف جانبًا غير متوقع من "${thread}".`;
  }

  private createSynopsis(
    names: string[],
    thread: string,
    pressure:
      ReturnType<
        StoryPressureEngine['calculate']
      >,
  ): string {
    return `تبدأ الحلقة بإشارة مرتبطة بـ "${thread}"، فتدخل ${names.join(' و')} في سلسلة قرارات تختبر الثقة والخوف والفضول. يتصاعد الضغط النفسي حول ${pressure.dominantPressure} قبل ظهور نتيجة تفتح احتمالات جديدة للحلقات القادمة.`;
  }

  private createImpacts(
    selections:
      EndlessEpisode['selectedCharacters'],

    characters: LivingCharacter[],

    thread: string,
  ): EpisodeCharacterImpact[] {
    return selections.map(
      (selection, index) => {
        const character =
          characters.find(
            (item) =>
              item.identity
                .characterId ===
              selection.characterId,
          );

        return {
          characterId:
            selection.characterId,

          characterName:
            selection.characterName,

          expectedMemoryType:
            index === 0
              ? 'discovery'
              : selection.episodeFunction ===
                  'opposition'
                ? 'relationship'
                : 'lesson',

          expectedEmotionalImpact:
            index === 0
              ? 35
              : 20,

          expectedImportance:
            index === 0
              ? 80
              : 60,

          affectedTraits:
            index === 0
              ? [
                  'curiosity',
                  'courage',
                ]
              : [
                  'trust',
                  'resilience',
                ],

          relationshipTargets:
            selections
              .filter(
                (other) =>
                  other.characterId !==
                  selection.characterId,
              )
              .map(
                (other) =>
                  other.characterId,
              ),

          psychologicalExplanation:
            `الحدث المرتبط بـ "${thread}" يضغط على هدف "${character?.goals.find((goal) => goal.active)?.title ?? 'غير محدد'}" وخوف "${character?.fears.find((fear) => !fear.resolved)?.name ?? 'غير محدد'}".`,
        };
      },
    );
  }

  private referencedMemories(
    selections:
      EndlessEpisode['selectedCharacters'],

    characters:
      LivingCharacter[],
  ): string[] {
    const ids =
      new Set(
        selections.map(
          (selection) =>
            selection.characterId,
        ),
      );

    return characters
      .filter(
        (character) =>
          ids.has(
            character.identity
              .characterId,
          ),
      )
      .flatMap(
        (character) =>
          character.memories
            .filter(
              (memory) =>
                memory.importance >=
                60,
            )
            .slice(-3)
            .map(
              (memory) =>
                memory.id,
            ),
      );
  }

  private continuityScore(
    world: LivingWorld,
    castSize: number,
    repetitionScore: number,
  ): number {
    return Math.max(
      0,
      Math.min(
        100,
        world.endlessState
          .continuityScore *
          0.6 +
        Math.min(
          100,
          castSize * 20,
        ) *
          0.2 +
        (
          100 -
          repetitionScore
        ) *
          0.2,
      ),
    );
  }
}
