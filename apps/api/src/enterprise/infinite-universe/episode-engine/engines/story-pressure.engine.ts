import { Injectable } from '@nestjs/common';

import type { LivingWorld } from '../../world-engine/models/world-engine.models';
import type { LivingCharacter } from '../../character-os/models/character-os.models';

import type {
  EndlessEpisode,
  StoryPressureProfile,
} from '../models/episode-engine.models';

@Injectable()
export class StoryPressureEngine {
  calculate(
    world: LivingWorld,
    characters: LivingCharacter[],
    previousEpisodes: EndlessEpisode[],
  ): StoryPressureProfile {
    const mysteries =
      world.endlessState.activeMysteries.length;

    const conflicts =
      world.endlessState.activeConflicts.length;

    const openThreads =
      world.endlessState.openStoryThreads;

    const averageCuriosity =
      this.average(
        characters.map(
          (character) =>
            character.psychology
              .emotionalState.curiosity,
        ),
      );

    const averageFear =
      this.average(
        characters.map(
          (character) =>
            character.psychology
              .emotionalState.fear,
        ),
      );

    const averageHope =
      this.average(
        characters.map(
          (character) =>
            character.psychology
              .emotionalState.hope,
        ),
      );

    const averageSadness =
      this.average(
        characters.map(
          (character) =>
            character.psychology
              .emotionalState.sadness,
        ),
      );

    const curiosity =
      this.clamp(
        35 +
        mysteries * 8 +
        openThreads * 3 +
        averageCuriosity * 0.2,
      );

    const tension =
      this.clamp(
        20 +
        conflicts * 9 +
        averageFear * 0.35,
      );

    const empathy =
      this.clamp(
        this.average(
          characters.map(
            (character) =>
              character.psychology.empathy,
          ),
        ),
      );

    const mystery =
      this.clamp(
        mysteries * 16 +
        openThreads * 4,
      );

    const hope =
      this.clamp(
        averageHope,
      );

    const humor =
      this.clamp(
        characters.some(
          (character) =>
            character.identity.role === 'friend' &&
            character.psychology.decisionStyle === 'impulsive',
        )
          ? 55
          : 30,
      );

    const surprise =
      this.clamp(
        45 +
        Math.min(
          35,
          openThreads * 4,
        ),
      );

    const emotionalSafety =
      this.clamp(
        100 -
        averageFear * 0.35 -
        averageSadness * 0.25,
      );

    const repetitionRisk =
      this.calculateRepetitionRisk(
        previousEpisodes,
      );

    const fatigueRisk =
      this.clamp(
        tension * 0.45 +
        averageSadness * 0.35 -
        humor * 0.15 -
        hope * 0.15,
      );

    const pressures = {
      curiosity,
      tension,
      empathy,
      mystery,
      hope,
      humor,
      surprise,
    };

    const dominantPressure =
      Object.entries(pressures)
        .sort(
          (left, right) =>
            right[1] - left[1],
        )[0]?.[0] ?? 'curiosity';

    const recommendations: string[] = [];

    if (tension > 75) {
      recommendations.push(
        'إضافة لحظة أمان أو فكاهة قبل الذروة.',
      );
    }

    if (curiosity < 55) {
      recommendations.push(
        'فتح سؤال أو لغز واضح في بداية الحلقة.',
      );
    }

    if (empathy < 60) {
      recommendations.push(
        'إضافة موقف شخصي يكشف ضعف إحدى الشخصيات.',
      );
    }

    if (repetitionRisk > 55) {
      recommendations.push(
        'تغيير الموقع ونوع الصراع والشخصية المحورية.',
      );
    }

    if (fatigueRisk > 65) {
      recommendations.push(
        'تقليل الصراع المتواصل وإضافة مكافأة عاطفية.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'الحفاظ على التوازن الحالي مع مفاجأة واحدة منطقية.',
      );
    }

    return {
      curiosity: this.round(curiosity),
      tension: this.round(tension),
      empathy: this.round(empathy),
      mystery: this.round(mystery),
      hope: this.round(hope),
      humor: this.round(humor),
      surprise: this.round(surprise),
      emotionalSafety:
        this.round(emotionalSafety),

      repetitionRisk:
        this.round(repetitionRisk),

      fatigueRisk:
        this.round(fatigueRisk),

      dominantPressure,
      recommendedAdjustment:
        recommendations,

      totalPressureScore:
        this.round(
          curiosity * 0.18 +
          tension * 0.16 +
          empathy * 0.16 +
          mystery * 0.14 +
          hope * 0.12 +
          humor * 0.08 +
          surprise * 0.1 +
          emotionalSafety * 0.06,
        ),
    };
  }

  private calculateRepetitionRisk(
    episodes: EndlessEpisode[],
  ): number {
    if (episodes.length < 2) {
      return 5;
    }

    const recent =
      episodes.slice(-5);

    const threadCounts =
      new Map<string, number>();

    const toneCounts =
      new Map<string, number>();

    for (const episode of recent) {
      threadCounts.set(
        episode.sourceStoryThread,
        (
          threadCounts.get(
            episode.sourceStoryThread,
          ) ?? 0
        ) + 1,
      );

      toneCounts.set(
        episode.tone,
        (
          toneCounts.get(
            episode.tone,
          ) ?? 0
        ) + 1,
      );
    }

    const threadMaximum =
      Math.max(
        ...threadCounts.values(),
      );

    const toneMaximum =
      Math.max(
        ...toneCounts.values(),
      );

    return this.clamp(
      threadMaximum * 16 +
      toneMaximum * 10,
    );
  }

  private average(
    values: number[],
  ): number {
    if (values.length === 0) {
      return 0;
    }

    return (
      values.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) / values.length
    );
  }

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }

  private round(
    value: number,
  ): number {
    return (
      Math.round(
        value * 100,
      ) / 100
    );
  }
}
