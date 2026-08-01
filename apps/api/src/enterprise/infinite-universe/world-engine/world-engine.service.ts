import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { PermanentUniverseMemoryService } from '../persistent-memory/permanent-universe-memory.service';

import { CreateWorldDto } from './dto/create-world.dto';

import { UniverseDnaEngine } from './engines/universe-dna.engine';
import { WorldBuilderEngine } from './engines/world-builder.engine';
import { WorldPsychologyEngine } from './engines/world-psychology.engine';
import { WorldTimelineEngine } from './engines/world-timeline.engine';

import type {
  LivingWorld,
  WorldEngineResult,
} from './models/world-engine.models';

@Injectable()
export class WorldEngineService {
  constructor(
    private readonly universeDnaEngine:
      UniverseDnaEngine,

    private readonly worldBuilderEngine:
      WorldBuilderEngine,

    private readonly psychologyEngine:
      WorldPsychologyEngine,

    private readonly timelineEngine:
      WorldTimelineEngine,

    private readonly memory:
      PermanentUniverseMemoryService,
  ) {}

  async createWorld(
    dto: CreateWorldDto,
  ): Promise<WorldEngineResult> {
    this.validate(dto);

    const universeDna =
      this.universeDnaEngine.create(dto);

    const locations =
      this.worldBuilderEngine
        .createLocations(universeDna);

    const civilizations =
      this.worldBuilderEngine
        .createCivilizations(universeDna);

    const economy =
      this.worldBuilderEngine
        .createEconomy();

    const politics =
      this.worldBuilderEngine
        .createPolitics();

    const psychology =
      this.psychologyEngine.create(dto);

    const timeline =
      this.timelineEngine
        .createInitialTimeline(
          universeDna,
        );

    const openThreads =
      timeline.reduce(
        (sum, event) =>
          sum +
          event
            .unresolvedConsequences
            .length,
        0,
      );

    const world: LivingWorld = {
      worldId: randomUUID(),
      version: '1.0.0',

      createdAt:
        new Date().toISOString(),

      universeDna,
      locations,
      civilizations,
      economy,
      politics,
      psychology,
      timeline,

      endlessState: {
        currentWorldYear:
          Math.max(
            ...timeline.map(
              (event) =>
                event.worldYear,
            ),
          ),

        activeMysteries:
          timeline
            .filter(
              (event) =>
                event.eventType ===
                'mystery',
            )
            .flatMap(
              (event) =>
                event
                  .unresolvedConsequences,
            ),

        activeConflicts: [
          'البناؤون مقابل الحراس',

          ...psychology
            .recurringConflicts,
        ],

        futureSeeds:
          timeline.flatMap(
            (event) =>
              event
                .unresolvedConsequences,
          ),

        openStoryThreads:
          openThreads,

        continuityScore: 100,
      },
    };

    await this.memory
      .saveWorld(world);

    return {
      success: true,

      engine:
        'CreatorOS Infinite Universe World Engine',

      version: '1.1.0',
      status: 'world-created',

      world,

      capabilities: {
        universeDna: true,
        worldLaws: true,
        civilizations: true,
        economy: true,
        politics: true,
        psychology: true,
        timeline: true,
        endlessStoryReadiness: true,
        multilingualFranchise: true,
      },
    };
  }

  async getWorld(
    worldId: string,
  ): Promise<LivingWorld> {
    const world =
      await this.memory
        .loadWorld(worldId);

    if (!world) {
      throw new NotFoundException(
        `World not found: ${worldId}.`,
      );
    }

    return world;
  }

  async getStatus() {
    const memoryStatus =
      await this.memory
        .getStatus();

    return {
      success: true,

      engine:
        'CreatorOS Infinite Universe World Engine',

      version: '1.1.0',

      phase:
        'Infinite Universe Foundation with Permanent Memory',

      status: 'operational',

      architecture: {
        universeDnaEngine: true,
        worldLawEngine: true,
        worldBuilderEngine: true,
        civilizationEngine: true,
        economyEngine: true,
        politicsEngine: true,
        psychologyEngine: true,
        timelineEngine: true,
        endlessStateEngine: true,
        multilingualUniverseSupport:
          true,

        permanentUniverseMemory:
          true,
      },

      storage:
        memoryStatus.storage,

      audienceTiers: [
        'kids',
        'junior',
        'teen',
        'adult',
        'family',
      ],

      constitutionalRules: {
        endlessFirst: true,
        worldBeforeStory: true,
        psychologicalContinuity:
          true,

        consequencesPersist: true,
        characterMemoryRequired:
          true,

        nativeLocalization: true,
        humanFinalAuthority: true,
      },
    };
  }

  private validate(
    dto: CreateWorldDto,
  ): void {
    if (!dto) {
      throw new BadRequestException(
        'World specification is required.',
      );
    }

    if (
      !dto.languages.some(
        (language) =>
          language.primary,
      )
    ) {
      throw new BadRequestException(
        'At least one primary language is required.',
      );
    }

    const languageCodes =
      dto.languages.map(
        (language) =>
          language.code
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
