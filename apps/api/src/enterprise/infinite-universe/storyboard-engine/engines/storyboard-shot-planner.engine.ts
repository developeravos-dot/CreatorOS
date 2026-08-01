import { Injectable } from '@nestjs/common';

import type {
  CinematicSceneScript,
} from '../../cinematic-script-engine/models/cinematic-script.models';

import type {
  LivingCharacter,
} from '../../character-os/models/character-os.models';

import { CharacterVisualConsistencyEngine } from './character-visual-consistency.engine';
import { VisualProductionPromptEngine } from './visual-production-prompt.engine';

import type {
  StoryboardFrame,
  StoryboardScene,
  StoryboardShotType,
} from '../models/storyboard.models';

@Injectable()
export class StoryboardShotPlannerEngine {
  constructor(
    private readonly characterVisual:
      CharacterVisualConsistencyEngine,

    private readonly prompts:
      VisualProductionPromptEngine,
  ) {}

  createScene(
    scene: CinematicSceneScript,
    characters: LivingCharacter[],
    visualStyle: string,
    includeImagePrompts: boolean,
    includeVideoPrompts: boolean,
    includeNegativePrompts: boolean,
  ): StoryboardScene {
    const relatedCharacters =
      this.sceneCharacters(
        scene,
        characters,
      );

    const frameCount =
      Math.max(
        3,
        Math.min(
          6,
          scene.actionBeats.length +
          scene.camera.length,
        ),
      );

    const duration =
      Math.max(
        2,
        scene.targetDurationSeconds /
          frameCount,
      );

    const frames =
      Array.from(
        { length: frameCount },
        (_, index) =>
          this.createFrame(
            scene,
            relatedCharacters,
            visualStyle,
            index,
            duration,
            includeImagePrompts,
            includeVideoPrompts,
            includeNegativePrompts,
          ),
      );

    return {
      sceneNumber:
        scene.sceneNumber,

      sourceSceneType:
        scene.sourceSceneType,

      heading:
        scene.heading,

      location:
        scene.location,

      targetDurationSeconds:
        scene.targetDurationSeconds,

      frames,

      sceneContinuity: {
        wardrobeLocked: true,
        environmentLocked: true,
        characterScaleLocked: true,

        lightingContinuityRequired:
          true,

        continuityKeys: [
          `scene-${scene.sceneNumber}`,
          `location-${scene.location}`,
          ...relatedCharacters.map(
            (character) =>
              `character-${character.identity.characterId}`,
          ),
        ],
      },
    };
  }

  private createFrame(
    scene: CinematicSceneScript,
    characters: LivingCharacter[],
    visualStyle: string,
    index: number,
    duration: number,
    includeImagePrompts: boolean,
    includeVideoPrompts: boolean,
    includeNegativePrompts: boolean,
  ): StoryboardFrame {
    const camera =
      scene.camera[index] ??
      scene.camera[
        scene.camera.length - 1
      ];

    const action =
      scene.actionBeats[
        index %
        Math.max(
          1,
          scene.actionBeats.length,
        )
      ];

    const dialogue =
      scene.dialogue[
        index %
        Math.max(
          1,
          scene.dialogue.length,
        )
      ];

    const shotType =
      this.shotType(
        camera?.shot,
        index,
      );

    const visualCharacters =
      characters.map(
        (character, characterIndex) =>
          this.characterVisual.createState(
            character,
            characterIndex,
            scene.sourceSceneType,
            dialogue?.visibleEmotion ??
              scene.sceneArc.peakEmotion,

            dialogue?.hiddenEmotion ??
              'دافع داخلي غير معلن',
          ),
      );

    const cameraAngle =
      camera?.shot ??
      (
        index === 0
          ? 'establishing-wide'
          : 'medium'
      );

    const movement =
      camera?.movement ??
      'حركة كاميرا بطيئة مستقرة';

    const narrativePurpose =
      action?.purpose ??
      scene.dramaticPurpose;

    const psychologicalPurpose =
      scene.psychologicalPurpose;

    return {
      frameNumber:
        index + 1,

      shotType,

      title:
        `${scene.heading} — لقطة ${index + 1}`,

      description:
        action?.action ??
        scene.openingVisual,

      cameraAngle,
      cameraMovement:
        movement,

      lensIntent:
        camera?.framingPurpose ??
        'توجيه المشاهد نحو الحدث الأساسي.',

      environment:
        scene.location,

      backgroundDetails: [
        scene.openingVisual,
        `زمن المشهد: ${scene.timeOfDay}`,
        `المزاج الضوئي: ${scene.lighting.mood}`,
      ],

      characters:
        visualCharacters,

      lighting: {
        mood:
          scene.lighting.mood,

        source:
          scene.lighting.source,

        intensity:
          scene.lighting.intensity,

        colorTemperature:
          scene.lighting
            .colorTemperature,
      },

      soundCue: [
        ...scene.sound.ambience,
        ...scene.sound.soundEffects,
      ],

      dialogueReference:
        dialogue
          ? [
              `${dialogue.characterName}: ${dialogue.dialogue}`,
            ]
          : [],

      psychologicalPurpose,
      narrativePurpose,

      estimatedDurationSeconds:
        Math.round(
          duration * 100,
        ) / 100,

      imagePrompt:
        includeImagePrompts
          ? this.prompts.imagePrompt(
              visualStyle,
              scene.location,
              shotType,
              cameraAngle,
              scene.lighting.mood,
              visualCharacters,
              narrativePurpose,
            )
          : '',

      videoPrompt:
        includeVideoPrompts
          ? this.prompts.videoPrompt(
              scene.location,
              movement,
              duration,
              visualCharacters,
              psychologicalPurpose,
            )
          : '',

      negativePrompt:
        includeNegativePrompts
          ? this.prompts
              .negativePrompt()
          : '',

      continuityKeys: [
        `scene-${scene.sceneNumber}`,
        `frame-${index + 1}`,
        `lighting-${scene.lighting.mood}`,
        ...visualCharacters.map(
          (character) =>
            `character-${character.characterId}`,
        ),
      ],
    };
  }

  private sceneCharacters(
    scene: CinematicSceneScript,
    characters: LivingCharacter[],
  ): LivingCharacter[] {
    const ids =
      new Set(
        scene.dialogue.map(
          (line) =>
            line.characterId,
        ),
      );

    return characters.filter(
      (character) =>
        ids.has(
          character.identity
            .characterId,
        ),
    );
  }

  private shotType(
    value: string | undefined,
    index: number,
  ): StoryboardShotType {
    if (
      value ===
      'establishing-wide'
    ) {
      return 'establishing';
    }

    if (
      value === 'close-up' ||
      value ===
        'extreme-close-up' ||
      value === 'wide' ||
      value === 'medium' ||
      value ===
        'over-the-shoulder' ||
      value ===
        'point-of-view' ||
      value === 'insert' ||
      value === 'tracking'
    ) {
      return value;
    }

    return index === 0
      ? 'establishing'
      : index % 2 === 0
        ? 'medium'
        : 'reaction';
  }
}
