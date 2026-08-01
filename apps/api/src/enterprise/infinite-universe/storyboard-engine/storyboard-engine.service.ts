import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { PermanentUniverseMemoryService } from '../persistent-memory/permanent-universe-memory.service';

import { GenerateStoryboardDto } from './dto/generate-storyboard.dto';

import { ProductionAssetManifestEngine } from './engines/production-asset-manifest.engine';
import { StoryboardQualityEngine } from './engines/storyboard-quality.engine';
import { StoryboardShotPlannerEngine } from './engines/storyboard-shot-planner.engine';

import type {
  StoryboardGenerationResult,
  StoryboardPackage,
} from './models/storyboard.models';

@Injectable()
export class StoryboardEngineService {
  constructor(
    private readonly memory:
      PermanentUniverseMemoryService,

    private readonly shotPlanner:
      StoryboardShotPlannerEngine,

    private readonly assetManifest:
      ProductionAssetManifestEngine,

    private readonly qualityEngine:
      StoryboardQualityEngine,
  ) {}

  async generate(
    dto: GenerateStoryboardDto,
  ): Promise<StoryboardGenerationResult> {
    const world =
      await this.memory.loadWorld(
        dto.worldId,
      );

    if (!world) {
      throw new NotFoundException(
        `World not found: ${dto.worldId}.`,
      );
    }

    const scripts =
      await this.memory.loadScripts(
        dto.worldId,
      );

    const script =
      scripts.find(
        (item) =>
          item.scriptId ===
          dto.scriptId,
      );

    if (!script) {
      throw new NotFoundException(
        `Script not found: ${dto.scriptId}.`,
      );
    }

    const characters =
      await this.memory.loadCharacters(
        dto.worldId,
      );

    const selectedCharacters =
      characters.filter(
        (character) =>
          script.selectedCharacterIds.includes(
            character.identity.characterId,
          ),
      );

    const visualStyle =
      dto.visualStyleOverride ??
      world.universeDna.visualStyle;

    const scenes =
      script.scenes.map(
        (scene) =>
          this.shotPlanner.createScene(
            scene,
            selectedCharacters,
            visualStyle,

            dto.includeImagePrompts ??
              true,

            dto.includeVideoPrompts ??
              true,

            dto.includeNegativePrompts ??
              true,
          ),
      );

    const assets =
      this.assetManifest.create(
        selectedCharacters,
        scenes,
      );

    const consistency =
      this.qualityEngine.evaluate(
        scenes,
      );

    const storyboard:
      StoryboardPackage = {
        storyboardId: randomUUID(),

        worldId:
          dto.worldId,

        episodeId:
          script.episodeId,

        scriptId:
          script.scriptId,

        episodeNumber:
          script.episodeNumber,

        title:
          script.title,

        audienceTier:
          script.audienceTier,

        visualStyle,

        primaryLanguageCode:
          script.sourceLanguageCode,

        scenes,
        assets,
        consistency,

        productionReadiness: {
          imageGenerationReady:
            scenes.every(
              (scene) =>
                scene.frames.every(
                  (frame) =>
                    Boolean(
                      frame.imagePrompt,
                    ),
                ),
            ),

          videoGenerationReady:
            scenes.every(
              (scene) =>
                scene.frames.every(
                  (frame) =>
                    Boolean(
                      frame.videoPrompt,
                    ),
                ),
            ),

          voiceSynchronizationReady:
            script.productionReadiness
              .voiceGenerationReady,

          externalProviderConnected:
            false,

          humanApprovalRequired:
            dto.requireHumanApproval ??
            true,
        },

        status: 'draft',

        createdAt:
          new Date().toISOString(),
      };

    await this.memory.saveStoryboard(
      dto.worldId,
      storyboard,
    );

    return {
      success: true,

      engine:
        'CreatorOS Storyboard and Visual Production Engine',

      version: '1.0.0',

      status:
        'storyboard-generated',

      storyboard,

      nextActions: [
        'مراجعة Storyboard واعتماده بشريًا.',
        'إنشاء الصور المرجعية النهائية للشخصيات.',
        'إنشاء مراجع البيئات والمواقع.',
        'توليد صور اللقطات.',
        'ربط مزود توليد الفيديو.',
        'توليد المقاطع المتحركة لكل لقطة.',
        'مزامنة الأصوات والحوار.',
      ],
    };
  }

  async getWorldStoryboards(
    worldId: string,
  ) {
    return this.memory
      .loadStoryboards(worldId);
  }

  getStatus() {
    return {
      success: true,

      engine:
        'CreatorOS Storyboard and Visual Production Engine',

      version: '1.0.0',

      phase:
        'Visual Production Foundation',

      status: 'operational',

      architecture: {
        storyboardShotPlanner: true,
        characterVisualConsistency:
          true,

        poseAndBlockingEngine: true,
        facialExpressionPlanner:
          true,

        environmentContinuity:
          true,

        imagePromptGenerator: true,
        videoPromptGenerator: true,
        negativePromptGuard: true,
        productionAssetManifest:
          true,

        storyboardQualityEngine:
          true,

        permanentStoryboardStorage:
          true,

        externalProviderAdapters:
          false,
      },

      constitutionalRules: {
        characterIdentityLocked:
          true,

        wardrobeContinuityLocked:
          true,

        visualPsychologyRequired:
          true,

        audienceSafetyRequired:
          true,

        humanFinalAuthority:
          true,
      },
    };
  }
}
