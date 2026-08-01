import { Injectable } from '@nestjs/common';

import type {
  CinematicSceneScript,
  CinematicEpisodeScript,
} from '../models/cinematic-script.models';

@Injectable()
export class ScriptQualityEngine {
  evaluate(
    scenes: CinematicSceneScript[],
  ): CinematicEpisodeScript['quality'] {
    const warnings: string[] = [];

    const allLines =
      scenes.flatMap(
        (scene) =>
          scene.dialogue,
      );

    const dialogueCount =
      allLines.length;

    const unsuitableScenes =
      scenes.filter(
        (scene) =>
          !scene.safetyAssessment
            .suitable,
      );

    const repetitionRisk =
      this.repetitionRisk(
        scenes,
      );

    const characterVoiceScore =
      this.characterVoiceConsistency(
        scenes,
      );

    const dialogueConsistency =
      Math.round(
        characterVoiceScore,
      );

    const psychologicalContinuity =
      scenes.every(
        (scene) =>
          scene.dialogue.every(
            (line) =>
              Boolean(
                line.hiddenEmotion,
              ) &&
              Boolean(
                line.bodyLanguage,
              ) &&
              Boolean(
                line.subtext,
              ),
          ),
      )
        ? 96
        : 72;

    const ageSuitability =
      Math.max(
        0,
        100 -
        unsuitableScenes.length *
          30,
      );

    const sceneProgression =
      this.sceneProgressionScore(
        scenes,
      );

    if (
      dialogueCount === 0
    ) {
      warnings.push(
        'لا يوجد حوار داخل السيناريو.',
      );
    }

    if (
      unsuitableScenes.length >
      0
    ) {
      warnings.push(
        `${unsuitableScenes.length} مشاهد تحتاج مراجعة سلامة عمرية.`,
      );
    }

    if (
      repetitionRisk > 20
    ) {
      warnings.push(
        `خطر تكرار الحوار ما زال مرتفعًا: ${repetitionRisk}%.`,
      );
    }

    if (
      dialogueConsistency < 80
    ) {
      warnings.push(
        'تمييز أصوات الشخصيات يحتاج إلى تحسين.',
      );
    }

    if (
      warnings.length === 0
    ) {
      warnings.push(
        'الحوار متنوع ومتوافق نفسيًا ولا توجد مخاطر جودة حرجة.',
      );
    }

    const totalScore =
      dialogueConsistency * 0.23 +
      psychologicalContinuity * 0.24 +
      ageSuitability * 0.2 +
      sceneProgression * 0.2 +
      (
        100 -
        repetitionRisk
      ) *
        0.13;

    return {
      dialogueConsistency,
      psychologicalContinuity,
      ageSuitability,
      sceneProgression,

      repetitionRisk,

      totalScore:
        Math.round(
          totalScore * 100,
        ) / 100,

      warnings,
    };
  }

  private repetitionRisk(
    scenes: CinematicSceneScript[],
  ): number {
    const lines =
      scenes.flatMap(
        (scene) =>
          scene.dialogue.map(
            (line) =>
              this.normalize(
                line.dialogue,
              ),
          ),
      );

    if (lines.length <= 1) {
      return 0;
    }

    let duplicatePairs = 0;
    let comparedPairs = 0;

    for (
      let leftIndex = 0;
      leftIndex < lines.length;
      leftIndex += 1
    ) {
      for (
        let rightIndex =
          leftIndex + 1;
        rightIndex < lines.length;
        rightIndex += 1
      ) {
        comparedPairs += 1;

        const leftLine =
          lines[leftIndex];

        const rightLine =
          lines[rightIndex];

        if (
          leftLine === undefined ||
          rightLine === undefined
        ) {
          continue;
        }

        const similarity =
          this.similarity(
            leftLine,
            rightLine,
          );

        if (similarity >= 0.72) {
          duplicatePairs += 1;
        }
      }
    }

    if (comparedPairs === 0) {
      return 0;
    }

    return Math.round(
      (
        duplicatePairs /
        comparedPairs
      ) *
        100,
    );
  }

  private characterVoiceConsistency(
    scenes: CinematicSceneScript[],
  ): number {
    const byCharacter =
      new Map<
        string,
        Array<{
          delivery: string;
          pause: number;
          bodyLanguage: string;
        }>
      >();

    for (const scene of scenes) {
      for (
        const line of
        scene.dialogue
      ) {
        const existing =
          byCharacter.get(
            line.characterId,
          ) ?? [];

        existing.push({
          delivery:
            line.delivery,

          pause:
            line.pauseAfterSeconds,

          bodyLanguage:
            line.bodyLanguage,
        });

        byCharacter.set(
          line.characterId,
          existing,
        );
      }
    }

    if (
      byCharacter.size === 0
    ) {
      return 0;
    }

    const scores: number[] = [];

    for (
      const values of
      byCharacter.values()
    ) {
      const averagePause =
        values.reduce(
          (sum, value) =>
            sum + value.pause,
          0,
        ) / values.length;

      const pauseConsistency =
        values.every(
          (value) =>
            Math.abs(
              value.pause -
              averagePause,
            ) <= 1,
        )
          ? 100
          : 75;

      const bodyLanguagePresent =
        values.filter(
          (value) =>
            Boolean(
              value.bodyLanguage,
            ),
        ).length /
        values.length *
        100;

      scores.push(
        pauseConsistency * 0.4 +
        bodyLanguagePresent * 0.6,
      );
    }

    return Math.round(
      scores.reduce(
        (sum, score) =>
          sum + score,
        0,
      ) / scores.length,
    );
  }

  private sceneProgressionScore(
    scenes: CinematicSceneScript[],
  ): number {
    if (scenes.length === 0) {
      return 0;
    }

    const uniqueTypes =
      new Set(
        scenes.map(
          (scene) =>
            scene.sourceSceneType,
        ),
      ).size;

    const uniqueOpenings =
      new Set(
        scenes.map(
          (scene) =>
            this.normalize(
              scene.openingVisual,
            ),
        ),
      ).size;

    const typeScore =
      Math.min(
        100,
        uniqueTypes /
        scenes.length *
        120,
      );

    const visualScore =
      Math.min(
        100,
        uniqueOpenings /
        scenes.length *
        100,
      );

    return Math.round(
      typeScore * 0.55 +
      visualScore * 0.45,
    );
  }

  private similarity(
    left: string,
    right: string,
  ): number {
    const leftWords =
      new Set(
        left.split(' '),
      );

    const rightWords =
      new Set(
        right.split(' '),
      );

    const intersection =
      [
        ...leftWords,
      ].filter(
        (word) =>
          rightWords.has(word),
      ).length;

    const union =
      new Set([
        ...leftWords,
        ...rightWords,
      ]).size;

    return union === 0
      ? 0
      : intersection / union;
  }

  private normalize(
    value: string,
  ): string {
    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^\p{L}\p{N}]+/gu,
        ' ',
      )
      .replace(/\s+/g, ' ');
  }
}

