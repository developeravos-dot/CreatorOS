import { Injectable } from '@nestjs/common';

import type { LivingCharacter } from '../../character-os/models/character-os.models';

import type {
  EpisodeCharacterSelection,
} from '../models/episode-engine.models';

@Injectable()
export class EpisodeCharacterCastEngine {
  select(
    characters: LivingCharacter[],
    storyThread: string,
    requiredCharacterIds: string[],
    excludedCharacterIds: string[],
  ): EpisodeCharacterSelection[] {
    const available =
      characters.filter(
        (character) =>
          !excludedCharacterIds.includes(
            character.identity.characterId,
          ),
      );

    const selected =
      new Map<
        string,
        LivingCharacter
      >();

    for (
      const requiredId of
      requiredCharacterIds
    ) {
      const character =
        available.find(
          (item) =>
            item.identity.characterId ===
            requiredId,
        );

      if (character) {
        selected.set(
          character.identity.characterId,
          character,
        );
      }
    }

    const ranked =
      available
        .map(
          (character) => ({
            character,

            score:
              this.scoreCharacter(
                character,
                storyThread,
              ),
          }),
        )
        .sort(
          (left, right) =>
            right.score - left.score,
        );

    for (const item of ranked) {
      if (selected.size >= 3) {
        break;
      }

      selected.set(
        item.character.identity
          .characterId,

        item.character,
      );
    }

    return [
      ...selected.values(),
    ].map(
      (character, index) =>
        this.toSelection(
          character,
          index,
          storyThread,
        ),
    );
  }

  private scoreCharacter(
    character: LivingCharacter,
    thread: string,
  ): number {
    let score = 0;

    if (
      character.identity.role ===
      'protagonist'
    ) {
      score += 70;
    }

    if (
      character.identity.role ===
      'rival'
    ) {
      score += 35;
    }

    const text =
      [
        ...character.goals.map(
          (goal) => goal.title,
        ),
        ...character.fears.map(
          (fear) => fear.name,
        ),
        ...character.secrets,
        ...character.memories.map(
          (memory) => memory.title,
        ),
      ].join(' ');

    for (
      const word of
      thread.split(/\s+/)
    ) {
      if (
        word.length >= 4 &&
        text.includes(word)
      ) {
        score += 12;
      }
    }

    score +=
      character.psychology
        .emotionalState.curiosity *
      0.15;

    score +=
      character.continuity
        .unresolvedInternalConflicts
        .length *
      8;

    return score;
  }

  private toSelection(
    character: LivingCharacter,
    index: number,
    storyThread: string,
  ): EpisodeCharacterSelection {
    const activeGoal =
      character.goals.find(
        (goal) =>
          goal.active,
      );

    const activeFear =
      character.fears
        .filter(
          (fear) =>
            !fear.resolved,
        )
        .sort(
          (left, right) =>
            right.intensity -
            left.intensity,
        )[0];

    return {
      characterId:
        character.identity
          .characterId,

      characterName:
        character.identity
          .canonicalName,

      role:
        character.identity.role,

      narrativeReason:
        `ارتباط الشخصية بخيط القصة: ${storyThread}.`,

      psychologicalReason:
        `الهدف الحالي "${activeGoal?.title ?? 'غير محدد'}" والخوف "${activeFear?.name ?? 'غير محدد'}" يخلقان صراعًا مناسبًا.`,

      currentDominantEmotion:
        character.psychology
          .emotionalState
          .dominantEmotion,

      activeGoal:
        activeGoal?.title,

      activeFear:
        activeFear?.name,

      episodeFunction:
        index === 0
          ? 'lead'
          : character.identity.role ===
              'rival'
            ? 'opposition'
            : character.identity.role ===
                'mentor'
              ? 'mentor'
              : index === 1
                ? 'support'
                : 'catalyst',
    };
  }
}
