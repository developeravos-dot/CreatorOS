import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ApplyCharacterEventDto } from './dto/apply-character-event.dto';
import { CreateCharacterRosterDto } from './dto/create-character-roster.dto';
import { GenerateCharacterDecisionDto } from './dto/generate-character-decision.dto';

import { PermanentUniverseMemoryService } from '../persistent-memory/permanent-universe-memory.service';

import { CharacterDecisionEngine } from './engines/character-decision.engine';
import { CharacterDnaEngine } from './engines/character-dna.engine';
import { CharacterMemoryEngine } from './engines/character-memory.engine';
import { CharacterRelationshipEngine } from './engines/character-relationship.engine';

import type {
  CharacterEventImpact,
  CharacterRosterResult,
  LivingCharacter,
} from './models/character-os.models';

@Injectable()
export class CharacterOsService {
  private readonly worlds =
    new Map<
      string,
      Map<string, LivingCharacter>
    >();

  constructor(
    private readonly dnaEngine:
      CharacterDnaEngine,

    private readonly relationshipEngine:
      CharacterRelationshipEngine,

    private readonly memoryEngine:
      CharacterMemoryEngine,

    private readonly decisionEngine:
      CharacterDecisionEngine,

    private readonly memory:
      PermanentUniverseMemoryService,
  ) {}

  async createRoster(
    dto: CreateCharacterRosterDto,
  ): Promise<CharacterRosterResult> {
    this.validateRoster(dto);

    const characters =
      dto.characters.map(
        (blueprint) =>
          this.dnaEngine.create(
            dto,
            blueprint,
          ),
      );

    this.relationshipEngine
      .initialize(characters);

    const worldCharacters =
      new Map<
        string,
        LivingCharacter
      >();

    for (const character of characters) {
      worldCharacters.set(
        character.identity
          .characterId,

        character,
      );
    }

    this.worlds.set(
      dto.worldId,
      worldCharacters,
    );

    await this.memory.saveCharacters(
      dto.worldId,
      characters,
    );

    return {
      success: true,
      engine:
        'CreatorOS Infinite Universe CharacterOS',
      version: '1.0.0',
      status:
        'characters-created',

      worldId:
        dto.worldId,

      characters,

      summary: {
        totalCharacters:
          characters.length,

        protagonists:
          characters.filter(
            (character) =>
              character.identity
                .role ===
                'protagonist' ||
              character.identity
                .role ===
                'co-protagonist',
          ).length,

        supportingCharacters:
          characters.filter(
            (character) =>
              character.identity
                .role !==
                'protagonist' &&
              character.identity
                .role !==
                'co-protagonist',
          ).length,

        relationshipCount:
          characters.reduce(
            (sum, character) =>
              sum +
              character
                .relationships
                .length,
            0,
          ),

        languageCount:
          dto.languages.length,
      },
    };
  }

  async applyEvent(
    dto: ApplyCharacterEventDto,
  ): Promise<CharacterEventImpact> {
    const character =
      await this.getCharacter(
        dto.worldId,
        dto.characterId,
      );

    const impact =
      this.memoryEngine.applyEvent(
        character,
        dto,
      );

    const changedRelationships =
      dto.relationshipTargetCharacterId
        ? this.relationshipEngine
            .applyChange(
              character,

              dto.relationshipTargetCharacterId,

              dto.trustDelta ?? 0,
              dto.affectionDelta ?? 0,
              dto.rivalryDelta ?? 0,

              impact.memory.id,
            )
        : [];

    await this.persistWorld(
      dto.worldId,
    );

    await this.memory.appendCharacterEvent(
      dto.worldId,
      dto.characterId,
      impact.memory.id,
      impact.memory.type,
      impact.memory.emotionalImpact,
    );

    return {
      success: true,
      engine:
        'CreatorOS Character Memory and Psychology Engine',
      version: '1.0.0',
      status: 'event-applied',

      worldId:
        dto.worldId,

      characterId:
        dto.characterId,

      eventId:
        impact.memory.id,

      memoryCreated:
        impact.memory,

      previousEmotionalState:
        impact.previousState,

      currentEmotionalState:
        impact.currentState,

      changedTraits:
        impact.changedTraits,

      changedRelationships,

      continuityScore:
        character.continuity
          .continuityScore,
    };
  }

  async generateDecision(
    dto: GenerateCharacterDecisionDto,
  ) {
    const character =
      await this.getCharacter(
        dto.worldId,
        dto.characterId,
      );

    const result =
      this.decisionEngine.generate(
        character,
        dto,
      );

    const selected =
      result.evaluations.find(
        (evaluation) =>
          evaluation.optionId ===
          result.selectedOptionId,
      );

    await this.memory.appendCharacterDecision(
      dto.worldId,
      dto.characterId,
      result.selectedOptionId,
      result.selectedOptionTitle,
      selected?.totalScore ?? 0,
    );

    return result;
  }

  async getWorldCharacters(
    worldId: string,
  ): Promise<LivingCharacter[]> {
    await this.ensureWorldLoaded(
      worldId,
    );

    const world =
      this.worlds.get(worldId);

    if (!world) {
      throw new NotFoundException(
        `No characters found for world ${worldId}.`,
      );
    }

    return [
      ...world.values(),
    ];
  }

  async getCharacterById(
    worldId: string,
    characterId: string,
  ): Promise<LivingCharacter> {
    return this.getCharacter(
      worldId,
      characterId,
    );
  }

  getStatus() {
    return {
      success: true,
      engine:
        'CreatorOS Infinite Universe CharacterOS',
      version: '1.0.0',
      phase:
        'Living Character Foundation',
      status: 'operational',

      architecture: {
        characterDnaEngine: true,
        psychologicalProfileEngine: true,
        emotionalStateEngine: true,
        longTermMemoryEngine: true,
        relationshipGraphEngine: true,
        goalAndFearEngine: true,
        decisionSimulationEngine: true,
        characterContinuityEngine: true,
        multilingualCharacterIdentity: true,
        audienceTierSafety: true,
      },

      capabilities: {
        createCharacterRoster: true,
        preserveCharacterMemory: true,
        applyPsychologicalImpact: true,
        evolveRelationships: true,
        generateCharacterDecision: true,
        explainDecisionPsychology: true,
        detectContinuityRisk: true,
      },

      storage: {
        mode: 'persistent-json',
        persistentDatabaseConnected:
          true,

        restartRecovery:
          true,

        lazyLoading:
          true,
      },

      constitutionalRules: {
        characterMemoryForever: true,
        psychologicalContinuity: true,
        decisionsMustMatchCharacter: true,
        consequencesPersist: true,
        audienceSafetyRequired: true,
        nativeLocalization: true,
        humanFinalAuthority: true,
      },
    };
  }

  private async getCharacter(
    worldId: string,
    characterId: string,
  ): Promise<LivingCharacter> {
    await this.ensureWorldLoaded(
      worldId,
    );

    const world =
      this.worlds.get(worldId);

    if (!world) {
      throw new NotFoundException(
        `World character registry not found: ${worldId}.`,
      );
    }

    const character =
      world.get(characterId);

    if (!character) {
      throw new NotFoundException(
        `Character not found: ${characterId}.`,
      );
    }

    return character;
  }

  private async ensureWorldLoaded(
    worldId: string,
  ): Promise<void> {
    if (this.worlds.has(worldId)) {
      return;
    }

    const characters =
      await this.memory.loadCharacters(
        worldId,
      );

    if (characters.length === 0) {
      return;
    }

    const registry =
      new Map<
        string,
        LivingCharacter
      >();

    for (const character of characters) {
      registry.set(
        character.identity.characterId,
        character,
      );
    }

    this.worlds.set(
      worldId,
      registry,
    );
  }

  private async persistWorld(
    worldId: string,
  ): Promise<void> {
    const registry =
      this.worlds.get(worldId);

    if (!registry) {
      return;
    }

    await this.memory.saveCharacters(
      worldId,
      [
        ...registry.values(),
      ],
    );
  }
  private validateRoster(
    dto: CreateCharacterRosterDto,
  ): void {
    if (!dto) {
      throw new BadRequestException(
        'Character roster specification is required.',
      );
    }

    const names =
      dto.characters.map(
        (character) =>
          character.canonicalName
            .trim()
            .toLowerCase(),
      );

    if (
      new Set(names).size !==
      names.length
    ) {
      throw new BadRequestException(
        'Character canonical names must be unique.',
      );
    }

    const protagonistCount =
      dto.characters.filter(
        (character) =>
          character.role ===
            'protagonist' ||
          character.role ===
            'co-protagonist',
      ).length;

    if (
      protagonistCount === 0
    ) {
      throw new BadRequestException(
        'At least one protagonist or co-protagonist is required.',
      );
    }

    const languageCodes =
      dto.languages.map(
        (language) =>
          language.code
            .trim()
            .toLowerCase(),
      );

    if (
      new Set(languageCodes).size !==
      languageCodes.length
    ) {
      throw new BadRequestException(
        'Language codes must be unique.',
      );
    }
  }
}

