import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { ApplyCharacterEventDto } from '../dto/apply-character-event.dto';

import type {
  CharacterMemory,
  CharacterTrait,
  EmotionalState,
  LivingCharacter,
} from '../models/character-os.models';

@Injectable()
export class CharacterMemoryEngine {
  applyEvent(
    character: LivingCharacter,
    dto: ApplyCharacterEventDto,
  ): {
    memory: CharacterMemory;
    previousState: EmotionalState;
    currentState: EmotionalState;
    changedTraits: CharacterTrait[];
  } {
    const previousState = {
      ...character.psychology
        .emotionalState,
    };

    const memory:
      CharacterMemory = {
        id: randomUUID(),

        type: dto.memoryType,
        title: dto.eventTitle,
        description:
          dto.eventDescription,

        worldYear: dto.worldYear,
        episodeNumber:
          dto.episodeNumber,

        emotionalImpact:
          dto.emotionalImpact,

        importance:
          dto.importance,

        affectedTraits:
          dto.affectedTraits ?? [],

        involvedCharacterIds:
          dto.involvedCharacterIds ??
          [],

        recalledCount: 0,
        resolved: false,

        createdAt:
          new Date().toISOString(),
      };

    character.memories.push(memory);

    const changedTraits =
      this.updateTraits(
        character,
        dto,
      );

    this.updateEmotions(
      character,
      dto,
    );

    character.continuity.version += 1;

    character.continuity
      .totalExperiences += 1;

    if (
      Math.abs(
        dto.emotionalImpact,
      ) >= 70
    ) {
      character.continuity
        .majorPsychologicalChanges += 1;
    }

    character.continuity
      .lastEpisodeNumber =
        dto.episodeNumber ??
        character.continuity
          .lastEpisodeNumber;

    character.continuity
      .lastUpdatedAt =
        new Date().toISOString();

    character.continuity
      .continuityScore =
        this.calculateContinuity(
          character,
        );

    return {
      memory,
      previousState,

      currentState: {
        ...character.psychology
          .emotionalState,
      },

      changedTraits,
    };
  }

  private updateTraits(
    character: LivingCharacter,
    dto: ApplyCharacterEventDto,
  ): CharacterTrait[] {
    const changed: CharacterTrait[] = [];

    for (
      const traitName of
      dto.affectedTraits ?? []
    ) {
      const trait =
        character.psychology
          .traits.find(
            (item) =>
              item.name ===
              traitName,
          );

      if (!trait) {
        continue;
      }

      const direction =
        dto.emotionalImpact >= 0
          ? 1
          : -1;

      const magnitude =
        Math.max(
          1,
          Math.round(
            Math.abs(
              dto.emotionalImpact,
            ) *
            0.08,
          ),
        );

      trait.value =
        this.clamp(
          trait.value +
          direction *
          magnitude,
        );

      changed.push({
        ...trait,
      });
    }

    return changed;
  }

  private updateEmotions(
    character: LivingCharacter,
    dto: ApplyCharacterEventDto,
  ): void {
    const state =
      character.psychology
        .emotionalState;

    const magnitude =
      Math.abs(
        dto.emotionalImpact,
      );

    if (
      dto.emotionalImpact >= 0
    ) {
      state.happiness =
        this.clamp(
          state.happiness +
          magnitude * 0.25,
        );

      state.hope =
        this.clamp(
          state.hope +
          magnitude * 0.2,
        );

      state.confidence =
        this.clamp(
          state.confidence +
          magnitude * 0.15,
        );

      state.sadness =
        this.clamp(
          state.sadness -
          magnitude * 0.15,
        );
    } else {
      state.sadness =
        this.clamp(
          state.sadness +
          magnitude * 0.28,
        );

      state.fear =
        this.clamp(
          state.fear +
          magnitude * 0.2,
        );

      state.anger =
        this.clamp(
          state.anger +
          magnitude * 0.12,
        );

      state.confidence =
        this.clamp(
          state.confidence -
          magnitude * 0.12,
        );
    }

    if (
      dto.memoryType ===
      'betrayal'
    ) {
      state.anger =
        this.clamp(
          state.anger + 25,
        );

      state.sadness =
        this.clamp(
          state.sadness + 20,
        );
    }

    if (
      dto.memoryType ===
      'discovery'
    ) {
      state.curiosity =
        this.clamp(
          state.curiosity + 20,
        );
    }

    if (
      dto.memoryType ===
      'lesson'
    ) {
      character.psychology
        .selfAwareness =
          this.clamp(
            character.psychology
              .selfAwareness + 5,
          );
    }

    state.dominantEmotion =
      this.dominantEmotion(
        state,
      );

    state.emotionalStability =
      this.clamp(
        100 -
        (
          state.sadness +
          state.fear +
          state.anger
        ) /
        3,
      );

    state.lastUpdatedAt =
      new Date().toISOString();
  }

  private dominantEmotion(
    state: EmotionalState,
  ): string {
    const candidates:
      Array<[string, number]> = [
        [
          'happiness',
          state.happiness,
        ],
        [
          'sadness',
          state.sadness,
        ],
        [
          'fear',
          state.fear,
        ],
        [
          'anger',
          state.anger,
        ],
        [
          'curiosity',
          state.curiosity,
        ],
        [
          'confidence',
          state.confidence,
        ],
        [
          'guilt',
          state.guilt,
        ],
        [
          'hope',
          state.hope,
        ],
        [
          'loneliness',
          state.loneliness,
        ],
      ];

    candidates.sort(
      (left, right) =>
        right[1] - left[1],
    );

    return (
      candidates[0]?.[0] ??
      'neutral'
    );
  }

  private calculateContinuity(
    character: LivingCharacter,
  ): number {
    const memoryQuality =
      Math.min(
        100,
        65 +
        character.memories.length *
        2,
      );

    const relationshipQuality =
      character.relationships
        .length > 0
        ? 100
        : 70;

    const psychologyQuality =
      character.psychology
        .traits.length > 0
        ? 100
        : 60;

    return this.round(
      memoryQuality * 0.35 +
      relationshipQuality * 0.3 +
      psychologyQuality * 0.35,
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
