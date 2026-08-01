import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  CharacterRelationship,
  LivingCharacter,
  RelationshipType,
} from '../models/character-os.models';

@Injectable()
export class CharacterRelationshipEngine {
  initialize(
    characters: LivingCharacter[],
  ): void {
    for (const source of characters) {
      for (const target of characters) {
        if (
          source.identity.characterId ===
          target.identity.characterId
        ) {
          continue;
        }

        source.relationships.push({
          id: randomUUID(),

          targetCharacterId:
            target.identity.characterId,

          targetCharacterName:
            target.identity.canonicalName,

          type:
            this.relationshipType(
              source,
              target,
            ),

          trust:
            this.initialTrust(
              source,
              target,
            ),

          affection:
            this.initialAffection(
              source,
              target,
            ),

          respect: 50,
          fear:
            target.identity.role ===
            'antagonist'
              ? 45
              : 5,

          rivalry:
            this.initialRivalry(
              source,
              target,
            ),

          dependency: 20,

          sharedMemoryIds: [],
          unresolvedIssues: [],

          lastUpdatedAt:
            new Date().toISOString(),
        });
      }
    }
  }

  applyChange(
    character: LivingCharacter,
    targetCharacterId: string,
    trustDelta: number,
    affectionDelta: number,
    rivalryDelta: number,
    memoryId: string,
  ): CharacterRelationship[] {
    const relationship =
      character.relationships.find(
        (item) =>
          item.targetCharacterId ===
          targetCharacterId,
      );

    if (!relationship) {
      return [];
    }

    relationship.trust =
      this.clamp(
        relationship.trust +
        trustDelta,
      );

    relationship.affection =
      this.clamp(
        relationship.affection +
        affectionDelta,
      );

    relationship.rivalry =
      this.clamp(
        relationship.rivalry +
        rivalryDelta,
      );

    relationship.sharedMemoryIds =
      [
        ...new Set([
          ...relationship
            .sharedMemoryIds,

          memoryId,
        ]),
      ];

    relationship.lastUpdatedAt =
      new Date().toISOString();

    relationship.type =
      this.inferType(
        relationship,
      );

    return [
      { ...relationship },
    ];
  }

  private relationshipType(
    source: LivingCharacter,
    target: LivingCharacter,
  ): RelationshipType {
    if (
      target.identity.role ===
      'mentor'
    ) {
      return 'mentorship';
    }

    if (
      source.identity.role ===
        'rival' ||
      target.identity.role ===
        'rival'
    ) {
      return 'rivalry';
    }

    if (
      source.identity.role ===
        'antagonist' ||
      target.identity.role ===
        'antagonist'
    ) {
      return 'conflict';
    }

    return 'friendship';
  }

  private initialTrust(
    source: LivingCharacter,
    target: LivingCharacter,
  ): number {
    if (
      source.identity.role ===
        'antagonist' ||
      target.identity.role ===
        'antagonist'
    ) {
      return 15;
    }

    if (
      target.identity.role ===
      'mentor'
    ) {
      return 72;
    }

    return 55;
  }

  private initialAffection(
    source: LivingCharacter,
    target: LivingCharacter,
  ): number {
    if (
      source.identity.role ===
        'antagonist' ||
      target.identity.role ===
        'antagonist'
    ) {
      return 10;
    }

    return 50;
  }

  private initialRivalry(
    source: LivingCharacter,
    target: LivingCharacter,
  ): number {
    if (
      source.identity.role ===
        'rival' ||
      target.identity.role ===
        'rival'
    ) {
      return 75;
    }

    if (
      source.identity.role ===
        'antagonist' ||
      target.identity.role ===
        'antagonist'
    ) {
      return 65;
    }

    return 10;
  }

  private inferType(
    relationship:
      CharacterRelationship,
  ): RelationshipType {
    if (
      relationship.rivalry >=
      70
    ) {
      return 'rivalry';
    }

    if (
      relationship.trust <=
        20 &&
      relationship.affection <=
        20
    ) {
      return 'conflict';
    }

    if (
      relationship.trust >=
        70 &&
      relationship.affection >=
        65
    ) {
      return 'friendship';
    }

    return relationship.type;
  }

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }
}
