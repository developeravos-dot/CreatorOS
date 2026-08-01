import { Injectable } from '@nestjs/common';

import type {
  StoryboardPackage,
  StoryboardScene,
} from '../models/storyboard.models';

@Injectable()
export class StoryboardQualityEngine {
  evaluate(
    scenes: StoryboardScene[],
  ): StoryboardPackage['consistency'] {
    const warnings: string[] = [];

    const frames =
      scenes.flatMap(
        (scene) =>
          scene.frames,
      );

    const characterIdentityScore =
      frames.every(
        (frame) =>
          frame.characters.every(
            (character) =>
              character.wardrobeContinuity
                .length > 0,
          ),
      )
        ? 100
        : 70;

    const environmentContinuityScore =
      scenes.every(
        (scene) =>
          scene.sceneContinuity
            .environmentLocked,
      )
        ? 100
        : 65;

    const wardrobeContinuityScore =
      scenes.every(
        (scene) =>
          scene.sceneContinuity
            .wardrobeLocked,
      )
        ? 100
        : 60;

    const shotTypes =
      new Set(
        frames.map(
          (frame) =>
            frame.shotType,
        ),
      );

    const cameraProgressionScore =
      Math.min(
        100,
        70 +
        shotTypes.size * 5,
      );

    const psychologicalVisualScore =
      frames.every(
        (frame) =>
          Boolean(
            frame.psychologicalPurpose,
          ) &&
          frame.characters.every(
            (character) =>
              Boolean(
                character.visibleEmotion,
              ),
          ),
      )
        ? 98
        : 70;

    if (
      shotTypes.size < 3
    ) {
      warnings.push(
        'تنوع زوايا الكاميرا منخفض.',
      );
    }

    if (
      frames.some(
        (frame) =>
          frame.characters.length ===
          0,
      )
    ) {
      warnings.push(
        'توجد لقطات بلا شخصيات؛ تأكد أنها مقصودة كلقطات بيئية.',
      );
    }

    if (
      warnings.length === 0
    ) {
      warnings.push(
        'لا توجد مخاطر اتساق بصري حرجة.',
      );
    }

    const totalScore =
      characterIdentityScore * 0.28 +
      environmentContinuityScore * 0.2 +
      wardrobeContinuityScore * 0.2 +
      cameraProgressionScore * 0.14 +
      psychologicalVisualScore * 0.18;

    return {
      characterIdentityScore,
      environmentContinuityScore,
      wardrobeContinuityScore,
      cameraProgressionScore,
      psychologicalVisualScore,

      totalScore:
        Math.round(
          totalScore * 100,
        ) / 100,

      warnings,
    };
  }
}
