import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import {
  access,
  appendFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';

import { constants } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import type { LivingWorld } from '../world-engine/models/world-engine.models';

import type { LivingCharacter } from '../character-os/models/character-os.models';
import type { EndlessEpisode } from '../episode-engine/models/episode-engine.models';
import type { CinematicEpisodeScript } from '../cinematic-script-engine/models/cinematic-script.models';
import type { StoryboardPackage } from '../storyboard-engine/models/storyboard.models';
import type { VisualReferenceBible } from '../visual-reference-bible/models/visual-reference-bible.models';
import type { ImageGenerationJob } from '../image-provider-adapter/models/image-provider.models';
import type {
  CanonicalIdentityFingerprint,
  VisualConsistencyValidation,
  VisualGenerationSnapshot,
} from '../visual-consistency-engine/models/visual-consistency.models';

import type {
  ProviderEntityLock,
  ProviderMigrationTest,
} from '../provider-migration-gate/models/provider-migration.models';

import type {
  UniverseMemoryAuditRecord,
  UniverseMemoryEntityType,
  UniverseMemoryStatus,
} from './models/persistent-memory.models';

@Injectable()
export class PermanentUniverseMemoryService
  implements OnModuleInit
{
  private readonly logger =
    new Logger(
      PermanentUniverseMemoryService.name,
    );

  private readonly dataRoot =
    process.env
      .CREATOROS_UNIVERSE_MEMORY_PATH
      ?.trim() ||
    join(
      process.cwd(),
      'data',
      'infinite-universe',
    );

  private readonly worldsDirectory =
    join(this.dataRoot, 'worlds');

  private readonly charactersDirectory =
    join(this.dataRoot, 'characters');

  private readonly auditDirectory =
    join(this.dataRoot, 'audit');

  private readonly episodesDirectory =
    join(this.dataRoot, 'episodes');

  private readonly scriptsDirectory =
    join(this.dataRoot, 'scripts');

  private readonly storyboardsDirectory =
    join(this.dataRoot, 'storyboards');

  private readonly visualReferenceBiblesDirectory =
    join(
      this.dataRoot,
      'visual-reference-bibles',
    );

  private readonly imageGenerationJobsDirectory =
    join(
      this.dataRoot,
      'image-generation-jobs',
    );

  private readonly visualConsistencyDirectory =
    join(
      this.dataRoot,
      'visual-consistency',
    );

  private readonly providerMigrationDirectory =
    join(
      this.dataRoot,
      'provider-migration',
    );

  private readonly auditFile =
    join(
      this.auditDirectory,
      'universe-audit.jsonl',
    );

  async onModuleInit(): Promise<void> {
    await this.ensureDirectories();

    this.logger.log(
      `Permanent Universe Memory ready: ${this.dataRoot}`,
    );
  }

  async saveWorld(
    world: LivingWorld,
  ): Promise<void> {
    await this.ensureDirectories();

    await this.atomicWrite(
      this.worldFile(world.worldId),
      world,
    );

    await this.appendAudit({
      worldId: world.worldId,
      entityType: 'world',
      entityId: world.worldId,
      operation: 'create',
      version:
        this.numericVersion(
          world.version,
        ),

      metadata: {
        name:
          world.universeDna.name,

        audienceTier:
          world.universeDna
            .audienceTier,

        languages:
          world.universeDna
            .languages
            .map(
              (language) =>
                language.code,
            ),
      },
    });
  }

  async loadWorld(
    worldId: string,
  ): Promise<LivingWorld | null> {
    const world =
      await this.readJson<LivingWorld>(
        this.worldFile(worldId),
      );

    if (world) {
      await this.appendAudit({
        worldId,
        entityType: 'world',
        entityId: worldId,
        operation: 'load',
        version:
          this.numericVersion(
            world.version,
          ),

        metadata: {},
      });
    }

    return world;
  }

  async worldExists(
    worldId: string,
  ): Promise<boolean> {
    return this.exists(
      this.worldFile(worldId),
    );
  }

  async saveCharacters(
    worldId: string,
    characters: LivingCharacter[],
  ): Promise<void> {
    await this.ensureDirectories();

    const payload = {
      worldId,
      version: 1,
      updatedAt:
        new Date().toISOString(),

      characters,
    };

    await this.atomicWrite(
      this.charactersFile(worldId),
      payload,
    );

    await this.appendAudit({
      worldId,
      entityType:
        'character-roster',
      operation: 'update',
      version: 1,

      metadata: {
        characterCount:
          characters.length,

        memoryCount:
          characters.reduce(
            (sum, character) =>
              sum +
              character.memories.length,
            0,
          ),

        relationshipCount:
          characters.reduce(
            (sum, character) =>
              sum +
              character
                .relationships.length,
            0,
          ),
      },
    });
  }

  async loadCharacters(
    worldId: string,
  ): Promise<LivingCharacter[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        characters: LivingCharacter[];
      }>(
        this.charactersFile(worldId),
      );

    if (!payload) {
      return [];
    }

    await this.appendAudit({
      worldId,
      entityType:
        'character-roster',
      operation: 'load',
      version: payload.version,

      metadata: {
        characterCount:
          payload.characters.length,
      },
    });

    return payload.characters;
  }

  async saveProviderMigrationTest(
    worldId: string,
    test: ProviderMigrationTest,
  ): Promise<void> {
    const tests =
      await this.loadProviderMigrationTests(
        worldId,
      );

    const filtered =
      tests.filter(
        (item) =>
          item.migrationTestId !==
          test.migrationTestId,
      );

    filtered.push(test);

    await this.atomicWrite(
      this.providerMigrationTestsFile(
        worldId,
      ),
      {
        worldId,
        version: 1,
        updatedAt:
          new Date().toISOString(),

        tests: filtered,
      },
    );

    await this.appendAudit({
      worldId,

      entityType:
        'provider-migration-test',

      entityId:
        test.migrationTestId,

      operation: 'update',
      version: 1,

      metadata: {
        entityType:
          test.entityType,

        entityName:
          test.entityName,

        currentProviderId:
          test.currentProviderId,

        candidateProviderId:
          test.candidateProviderId,

        status:
          test.status,

        totalScore:
          test.scores.total,

        productionAllowed:
          test.productionAllowed,
      },
    });
  }

  async loadProviderMigrationTests(
    worldId: string,
  ): Promise<ProviderMigrationTest[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        tests: ProviderMigrationTest[];
      }>(
        this.providerMigrationTestsFile(
          worldId,
        ),
      );

    return payload?.tests ?? [];
  }

  async saveProviderEntityLock(
    worldId: string,
    providerLock: ProviderEntityLock,
  ): Promise<void> {
    const locks =
      await this.loadProviderEntityLocks(
        worldId,
      );

    const filtered =
      locks.filter(
        (item) =>
          !(
            item.entityType ===
              providerLock.entityType &&
            item.entityId ===
              providerLock.entityId &&
            item.workload ===
              providerLock.workload
          ),
      );

    filtered.push(providerLock);

    await this.atomicWrite(
      this.providerEntityLocksFile(
        worldId,
      ),
      {
        worldId,
        version: 1,
        updatedAt:
          new Date().toISOString(),

        locks: filtered,
      },
    );

    await this.appendAudit({
      worldId,

      entityType:
        'provider-entity-lock',

      entityId:
        providerLock.lockId,

      operation: 'update',
      version: 1,

      metadata: {
        entityType:
          providerLock.entityType,

        entityName:
          providerLock.entityName,

        workload:
          providerLock.workload,

        providerId:
          providerLock.providerId,

        fallbackProviderId:
          providerLock.fallbackProviderId ??
          '',

        locked:
          providerLock.locked,
      },
    });
  }

  async loadProviderEntityLocks(
    worldId: string,
  ): Promise<ProviderEntityLock[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        locks: ProviderEntityLock[];
      }>(
        this.providerEntityLocksFile(
          worldId,
        ),
      );

    return payload?.locks ?? [];
  }
  async saveCanonicalFingerprints(
    worldId: string,
    fingerprints:
      CanonicalIdentityFingerprint[],
  ): Promise<void> {
    await this.atomicWrite(
      this.visualFingerprintsFile(
        worldId,
      ),
      {
        worldId,
        version: 1,

        updatedAt:
          new Date().toISOString(),

        fingerprints,
      },
    );

    await this.appendAudit({
      worldId,

      entityType:
        'canonical-visual-fingerprint',

      operation: 'update',
      version: 1,

      metadata: {
        fingerprintCount:
          fingerprints.length,

        lockedCount:
          fingerprints.filter(
            (item) =>
              item.locked,
          ).length,
      },
    });
  }

  async loadCanonicalFingerprints(
    worldId: string,
  ): Promise<
    CanonicalIdentityFingerprint[]
  > {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;

        fingerprints:
          CanonicalIdentityFingerprint[];
      }>(
        this.visualFingerprintsFile(
          worldId,
        ),
      );

    return payload?.fingerprints ?? [];
  }

  async saveVisualConsistencySnapshot(
    worldId: string,
    snapshot: VisualGenerationSnapshot,
  ): Promise<void> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        snapshots: VisualGenerationSnapshot[];
      }>(
        this.visualSnapshotsFile(
          worldId,
        ),
      );

    const snapshots =
      payload?.snapshots ?? [];

    snapshots.push(snapshot);

    await this.atomicWrite(
      this.visualSnapshotsFile(
        worldId,
      ),
      {
        worldId,
        version: 1,

        updatedAt:
          new Date().toISOString(),

        snapshots,
      },
    );
  }

  async saveVisualConsistencyValidation(
    worldId: string,
    validation:
      VisualConsistencyValidation,
  ): Promise<void> {
    const validations =
      await this.loadVisualConsistencyValidations(
        worldId,
      );

    validations.push(validation);

    await this.atomicWrite(
      this.visualValidationsFile(
        worldId,
      ),
      {
        worldId,
        version: 1,

        updatedAt:
          new Date().toISOString(),

        validations,
      },
    );

    await this.appendAudit({
      worldId,

      entityType:
        'visual-consistency-validation',

      entityId:
        validation.validationId,

      operation: 'create',
      version: 1,

      metadata: {
        entityType:
          validation.entityType,

        entityName:
          validation.entityName,

        status:
          validation.status,

        totalScore:
          validation.scores.totalScore,

        repairRequired:
          validation.repairRequired,
      },
    });
  }

  async loadVisualConsistencyValidations(
    worldId: string,
  ): Promise<
    VisualConsistencyValidation[]
  > {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;

        validations:
          VisualConsistencyValidation[];
      }>(
        this.visualValidationsFile(
          worldId,
        ),
      );

    return payload?.validations ?? [];
  }
  async saveImageGenerationJob(
    worldId: string,
    job: ImageGenerationJob,
  ): Promise<void> {
    const jobs =
      await this.loadImageGenerationJobs(
        worldId,
      );

    const filtered =
      jobs.filter(
        (item) =>
          item.jobId !==
          job.jobId,
      );

    filtered.push(job);

    filtered.sort(
      (left, right) =>
        left.createdAt.localeCompare(
          right.createdAt,
        ),
    );

    await this.atomicWrite(
      this.imageGenerationJobsFile(
        worldId,
      ),
      {
        worldId,
        version: 1,

        updatedAt:
          new Date().toISOString(),

        jobs: filtered,
      },
    );

    await this.appendAudit({
      worldId,

      entityType:
        'image-generation-job',

      entityId:
        job.jobId,

      operation: 'update',
      version: 1,

      metadata: {
        providerId:
          job.providerId,

        status:
          job.status,

        totalRequests:
          job.progress.totalRequests,

        completedRequests:
          job.progress.completedRequests,

        assetCount:
          job.assets.length,

        storyboardUnlocked:
          job.approvalGate
            .storyboardGenerationUnlocked,
      },
    });
  }

  async loadImageGenerationJobs(
    worldId: string,
  ): Promise<ImageGenerationJob[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        jobs: ImageGenerationJob[];
      }>(
        this.imageGenerationJobsFile(
          worldId,
        ),
      );

    return payload?.jobs ?? [];
  }
  async saveVisualReferenceBible(
    worldId: string,
    bible: VisualReferenceBible,
  ): Promise<void> {
    const bibles =
      await this.loadVisualReferenceBibles(
        worldId,
      );

    const filtered =
      bibles.filter(
        (item) =>
          item.bibleId !==
          bible.bibleId,
      );

    filtered.push(bible);

    await this.atomicWrite(
      this.visualReferenceBiblesFile(
        worldId,
      ),
      {
        worldId,
        version: 1,

        updatedAt:
          new Date().toISOString(),

        bibles: filtered,
      },
    );

    await this.appendAudit({
      worldId,

      entityType:
        'visual-reference-bible',

      entityId:
        bible.bibleId,

      operation: 'create',
      version: 1,

      metadata: {
        storyboardId:
          bible.storyboardId,

        characterReferences:
          bible.characterReferences
            .length,

        environmentReferences:
          bible.environmentReferences
            .length,

        propReferences:
          bible.propReferences.length,

        qualityScore:
          bible.quality.totalScore,
      },
    });
  }

  async loadVisualReferenceBibles(
    worldId: string,
  ): Promise<VisualReferenceBible[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        bibles: VisualReferenceBible[];
      }>(
        this.visualReferenceBiblesFile(
          worldId,
        ),
      );

    return payload?.bibles ?? [];
  }
  async saveStoryboard(
    worldId: string,
    storyboard: StoryboardPackage,
  ): Promise<void> {
    const storyboards =
      await this.loadStoryboards(
        worldId,
      );

    const filtered =
      storyboards.filter(
        (item) =>
          item.storyboardId !==
          storyboard.storyboardId,
      );

    filtered.push(storyboard);

    filtered.sort(
      (left, right) =>
        left.episodeNumber -
        right.episodeNumber,
    );

    await this.atomicWrite(
      this.storyboardsFile(worldId),
      {
        worldId,
        version: 1,
        updatedAt:
          new Date().toISOString(),

        storyboards: filtered,
      },
    );

    await this.appendAudit({
      worldId,
      entityType: 'storyboard',

      entityId:
        storyboard.storyboardId,

      operation: 'create',
      version: 1,

      metadata: {
        episodeId:
          storyboard.episodeId,

        scriptId:
          storyboard.scriptId,

        episodeNumber:
          storyboard.episodeNumber,

        frameCount:
          storyboard.scenes.reduce(
            (sum, scene) =>
              sum +
              scene.frames.length,
            0,
          ),

        qualityScore:
          storyboard.consistency
            .totalScore,
      },
    });
  }

  async loadStoryboards(
    worldId: string,
  ): Promise<StoryboardPackage[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        storyboards: StoryboardPackage[];
      }>(
        this.storyboardsFile(worldId),
      );

    return payload?.storyboards ?? [];
  }
  async saveScript(
    worldId: string,
    script: CinematicEpisodeScript,
  ): Promise<void> {
    const scripts =
      await this.loadScripts(
        worldId,
      );

    const filtered =
      scripts.filter(
        (item) =>
          item.scriptId !==
          script.scriptId,
      );

    filtered.push(script);

    filtered.sort(
      (left, right) =>
        left.episodeNumber -
        right.episodeNumber,
    );

    await this.atomicWrite(
      this.scriptsFile(worldId),
      {
        worldId,
        version: 1,
        updatedAt:
          new Date().toISOString(),

        scripts: filtered,
      },
    );

    await this.appendAudit({
      worldId,
      entityType: 'script',
      entityId:
        script.scriptId,
      operation: 'create',
      version: 1,

      metadata: {
        episodeId:
          script.episodeId,

        episodeNumber:
          script.episodeNumber,

        title:
          script.title,

        qualityScore:
          script.quality.totalScore,
      },
    });
  }

  async loadScripts(
    worldId: string,
  ): Promise<CinematicEpisodeScript[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        scripts: CinematicEpisodeScript[];
      }>(
        this.scriptsFile(worldId),
      );

    return payload?.scripts ?? [];
  }
  async saveEpisode(
    worldId: string,
    episode: EndlessEpisode,
  ): Promise<void> {
    const episodes =
      await this.loadEpisodes(
        worldId,
      );

    const filtered =
      episodes.filter(
        (item) =>
          item.episodeId !==
          episode.episodeId,
      );

    filtered.push(episode);

    filtered.sort(
      (left, right) =>
        left.episodeNumber -
        right.episodeNumber,
    );

    await this.atomicWrite(
      this.episodesFile(worldId),
      {
        worldId,
        version: 1,
        updatedAt:
          new Date().toISOString(),
        episodes: filtered,
      },
    );

    await this.appendAudit({
      worldId,
      entityType: 'episode',
      entityId:
        episode.episodeId,
      operation: 'create',
      version: 1,

      metadata: {
        episodeNumber:
          episode.episodeNumber,
        title:
          episode.title,
        tone:
          episode.tone,
        storyThread:
          episode.sourceStoryThread,
      },
    });
  }

  async loadEpisodes(
    worldId: string,
  ): Promise<EndlessEpisode[]> {
    const payload =
      await this.readJson<{
        worldId: string;
        version: number;
        updatedAt: string;
        episodes: EndlessEpisode[];
      }>(
        this.episodesFile(worldId),
      );

    return payload?.episodes ?? [];
  }
  async appendCharacterEvent(
    worldId: string,
    characterId: string,
    eventId: string,
    memoryType: string,
    emotionalImpact: number,
  ): Promise<void> {
    await this.appendAudit({
      worldId,
      entityType:
        'character-event',
      entityId: eventId,
      operation: 'event',
      version: 1,

      metadata: {
        characterId,
        memoryType,
        emotionalImpact,
      },
    });
  }

  async appendCharacterDecision(
    worldId: string,
    characterId: string,
    selectedOptionId: string,
    selectedOptionTitle: string,
    score: number,
  ): Promise<void> {
    await this.appendAudit({
      worldId,
      entityType:
        'character-decision',

      entityId: randomUUID(),
      operation: 'decision',
      version: 1,

      metadata: {
        characterId,
        selectedOptionId,
        selectedOptionTitle,
        score,
      },
    });
  }

  async deleteWorldMemory(
    worldId: string,
  ): Promise<void> {
    await rm(
      this.worldFile(worldId),
      { force: true },
    );

    await rm(
      this.charactersFile(worldId),
      { force: true },
    );

    await rm(
      this.episodesFile(worldId),
      { force: true },
    );

    await this.appendAudit({
      worldId,
      entityType: 'world',
      entityId: worldId,
      operation: 'delete',
      version: 1,
      metadata: {},
    });
  }

  async getStatus():
    Promise<UniverseMemoryStatus> {
    await this.ensureDirectories();

    return {
      success: true,
      engine:
        'CreatorOS Permanent Universe Memory',
      version: '1.0.0',
      status: 'operational',

      storage: {
        mode: 'persistent-json',
        rootDirectory:
          this.dataRoot,
        atomicWrites: true,
        lazyLoading: true,
        auditLogEnabled: true,
      },

      capabilities: {
        persistentWorlds: true,
        persistentCharacters: true,
        persistentMemories: true,
        persistentRelationships: true,
        persistentPsychology: true,
        eventAuditTrail: true,
        decisionAuditTrail: true,
        restartRecovery: true,
      },

      statistics: {
        storedWorlds:
          await this.countJsonFiles(
            this.worldsDirectory,
          ),

        storedCharacterRosters:
          await this.countJsonFiles(
            this.charactersDirectory,
          ),

        auditRecords:
          await this.countAuditRecords(),
      },
    };
  }

  async readAudit(
    worldId?: string,
    maximumRecords = 100,
  ): Promise<
    UniverseMemoryAuditRecord[]
  > {
    if (
      !(await this.exists(
        this.auditFile,
      ))
    ) {
      return [];
    }

    const content =
      await readFile(
        this.auditFile,
        'utf8',
      );

    const records =
      content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .flatMap((line) => {
          try {
            return [
              JSON.parse(
                line,
              ) as UniverseMemoryAuditRecord,
            ];
          } catch {
            return [];
          }
        });

    return records
      .filter(
        (record) =>
          !worldId ||
          record.worldId ===
            worldId,
      )
      .slice(
        -Math.max(
          1,
          Math.min(
            maximumRecords,
            1000,
          ),
        ),
      )
      .reverse();
  }

  private async appendAudit(
    input: {
      worldId: string;
      entityType:
        UniverseMemoryEntityType;
      entityId?: string;
      operation:
        UniverseMemoryAuditRecord['operation'];
      version: number;

      metadata: Record<
        string,
        string |
        number |
        boolean |
        string[]
      >;
    },
  ): Promise<void> {
    await this.ensureDirectories();

    const record:
      UniverseMemoryAuditRecord = {
        auditId: randomUUID(),
        worldId: input.worldId,
        entityType:
          input.entityType,
        entityId: input.entityId,
        operation:
          input.operation,
        timestamp:
          new Date().toISOString(),
        version: input.version,
        metadata: input.metadata,
      };

    await appendFile(
      this.auditFile,
      `${JSON.stringify(record)}\n`,
      'utf8',
    );
  }

  private async atomicWrite(
    targetFile: string,
    value: unknown,
  ): Promise<void> {
    const temporaryFile =
      `${targetFile}.${randomUUID()}.tmp`;

    const content =
      JSON.stringify(
        value,
        null,
        2,
      );

    await writeFile(
      temporaryFile,
      content,
      'utf8',
    );

    try {
      await rename(
        temporaryFile,
        targetFile,
      );
    } catch {
      await rm(
        targetFile,
        { force: true },
      );

      await rename(
        temporaryFile,
        targetFile,
      );
    }
  }

  private async readJson<T>(
    file: string,
  ): Promise<T | null> {
    if (!(await this.exists(file))) {
      return null;
    }

    const content =
      await readFile(
        file,
        'utf8',
      );

    return JSON.parse(content) as T;
  }

  private async ensureDirectories():
    Promise<void> {
    await mkdir(
      this.worldsDirectory,
      { recursive: true },
    );

    await mkdir(
      this.charactersDirectory,
      { recursive: true },
    );

    await mkdir(
      this.auditDirectory,
      { recursive: true },
    );

    await mkdir(
      this.episodesDirectory,
      { recursive: true },
    );

    await mkdir(
      this.scriptsDirectory,
      { recursive: true },
    );

    await mkdir(
      this.storyboardsDirectory,
      { recursive: true },
    );

    await mkdir(
      this.visualReferenceBiblesDirectory,
      { recursive: true },
    );

    await mkdir(
      this.imageGenerationJobsDirectory,
      { recursive: true },
    );

    await mkdir(
      this.visualConsistencyDirectory,
      { recursive: true },
    );

    await mkdir(
      this.providerMigrationDirectory,
      { recursive: true },
    );
  }

  private worldFile(
    worldId: string,
  ): string {
    return join(
      this.worldsDirectory,
      `${this.safeId(worldId)}.json`,
    );
  }

  private providerMigrationTestsFile(
    worldId: string,
  ): string {
    return join(
      this.providerMigrationDirectory,
      `${this.safeId(worldId)}.tests.json`,
    );
  }

  private providerEntityLocksFile(
    worldId: string,
  ): string {
    return join(
      this.providerMigrationDirectory,
      `${this.safeId(worldId)}.locks.json`,
    );
  }
  private visualFingerprintsFile(
    worldId: string,
  ): string {
    return join(
      this.visualConsistencyDirectory,
      `${this.safeId(worldId)}.fingerprints.json`,
    );
  }

  private visualSnapshotsFile(
    worldId: string,
  ): string {
    return join(
      this.visualConsistencyDirectory,
      `${this.safeId(worldId)}.snapshots.json`,
    );
  }

  private visualValidationsFile(
    worldId: string,
  ): string {
    return join(
      this.visualConsistencyDirectory,
      `${this.safeId(worldId)}.validations.json`,
    );
  }
  private imageGenerationJobsFile(
    worldId: string,
  ): string {
    return join(
      this.imageGenerationJobsDirectory,
      `${this.safeId(worldId)}.json`,
    );
  }
  private visualReferenceBiblesFile(
    worldId: string,
  ): string {
    return join(
      this.visualReferenceBiblesDirectory,
      `${this.safeId(worldId)}.json`,
    );
  }
  private storyboardsFile(
    worldId: string,
  ): string {
    return join(
      this.storyboardsDirectory,
      `${this.safeId(worldId)}.json`,
    );
  }
  private scriptsFile(
    worldId: string,
  ): string {
    return join(
      this.scriptsDirectory,
      `${this.safeId(worldId)}.json`,
    );
  }
  private episodesFile(
    worldId: string,
  ): string {
    return join(
      this.episodesDirectory,
      `${this.safeId(worldId)}.json`,
    );
  }
  private charactersFile(
    worldId: string,
  ): string {
    return join(
      this.charactersDirectory,
      `${this.safeId(worldId)}.json`,
    );
  }

  private safeId(value: string): string {
    const safe =
      value.replace(
        /[^a-zA-Z0-9_-]/g,
        '',
      );

    if (!safe) {
      throw new Error(
        'Invalid persistent-memory identifier.',
      );
    }

    return safe;
  }

  private async exists(
    file: string,
  ): Promise<boolean> {
    try {
      await access(
        file,
        constants.F_OK,
      );

      return true;
    } catch {
      return false;
    }
  }

  private async countJsonFiles(
    directory: string,
  ): Promise<number> {
    const files =
      await readdir(directory);

    return files.filter(
      (file) =>
        file.endsWith('.json'),
    ).length;
  }

  private async countAuditRecords():
    Promise<number> {
    if (
      !(await this.exists(
        this.auditFile,
      ))
    ) {
      return 0;
    }

    const content =
      await readFile(
        this.auditFile,
        'utf8',
      );

    return content
      .split(/\r?\n/)
      .filter(
        (line) =>
          line.trim().length > 0,
      )
      .length;
  }

  private numericVersion(
    version: string,
  ): number {
    const parsed =
      Number.parseInt(
        version.split('.')[0] ?? '1',
        10,
      );

    return Number.isFinite(parsed)
      ? parsed
      : 1;
  }
}







