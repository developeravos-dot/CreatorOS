import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type ProductionStatus =
  | 'draft'
  | 'pre-production'
  | 'script-development'
  | 'storyboarding'
  | 'asset-production'
  | 'audio-production'
  | 'editing'
  | 'quality-review'
  | 'human-review'
  | 'approved'
  | 'rendering'
  | 'completed'
  | 'rejected'
  | 'archived';

export type ProductionPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type ProductionType =
  | 'script'
  | 'storyboard'
  | 'visual-production'
  | 'audio-production'
  | 'editing'
  | 'quality-assurance'
  | 'full-production'
  | 'other';

export interface ProductionScene {
  id: string;
  order: number;
  title: string;
  description: string;
  narration: string;
  dialogue: string[];
  visualPrompt: string;
  cameraDirection: string;
  lightingDirection: string;
  soundDirection: string;
  musicDirection: string;
  durationSeconds: number;
  status:
    | 'draft'
    | 'approved'
    | 'producing'
    | 'completed';
}

export interface MediaProductionRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: ProductionType;
  status: ProductionStatus;
  priority: ProductionPriority;

  owner: string;
  projectId: string;
  channelId: string;
  platform: string;
  language: string;
  culture: string;
  audience: string;
  ageGroup: string;

  format: string;
  genre: string;
  creativeStyle: string;
  visualStyle: string;
  aspectRatio: string;
  resolution: string;
  frameRate: number;
  targetDurationSeconds: number;

  title: string;
  logline: string;
  synopsis: string;
  hook: string;
  script: string;
  callToAction: string;

  scenes: ProductionScene[];

  selectedModels: string[];
  characters: string[];
  locations: string[];
  visualAssets: string[];
  audioAssets: string[];
  musicAssets: string[];
  voiceAssets: string[];
  editingAssets: string[];

  scriptScore: number;
  visualScore: number;
  audioScore: number;
  continuityScore: number;
  originalityScore: number;
  audienceFitScore: number;
  technicalQualityScore: number;
  overallQualityScore: number;

  estimatedCost: number;
  actualCost: number;

  issues: string[];
  risks: string[];
  recommendations: string[];
  tags: string[];
  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaProductionInput {
  name: string;
  description?: string;
  category: string;
  type?: ProductionType;
  status?: ProductionStatus;
  priority?: ProductionPriority;

  owner: string;
  projectId?: string;
  channelId?: string;
  platform?: string;
  language?: string;
  culture?: string;
  audience?: string;
  ageGroup?: string;

  format?: string;
  genre?: string;
  creativeStyle?: string;
  visualStyle?: string;
  aspectRatio?: string;
  resolution?: string;
  frameRate?: number;
  targetDurationSeconds?: number;

  title?: string;
  logline?: string;
  synopsis?: string;
  hook?: string;
  script?: string;
  callToAction?: string;

  scenes?: ProductionScene[];

  selectedModels?: string[];
  characters?: string[];
  locations?: string[];
  visualAssets?: string[];
  audioAssets?: string[];
  musicAssets?: string[];
  voiceAssets?: string[];
  editingAssets?: string[];

  scriptScore?: number;
  visualScore?: number;
  audioScore?: number;
  continuityScore?: number;
  originalityScore?: number;
  audienceFitScore?: number;
  technicalQualityScore?: number;
  overallQualityScore?: number;

  estimatedCost?: number;
  actualCost?: number;

  issues?: string[];
  risks?: string[];
  recommendations?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
}

export interface UpdateMediaProductionInput
  extends Partial<CreateMediaProductionInput> {}

export abstract class MediaProductionEngineBase {
  private readonly records =
    new Map<string, MediaProductionRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard() {
    const records = [...this.records.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture:
        'AVOS Media Production Pipeline',
      humanFinalAuthority: true,

      totalRecords: records.length,

      preProductionRecords: records.filter(
        (record) =>
          record.status === 'pre-production',
      ).length,

      scriptDevelopmentRecords: records.filter(
        (record) =>
          record.status === 'script-development',
      ).length,

      storyboardingRecords: records.filter(
        (record) =>
          record.status === 'storyboarding',
      ).length,

      assetProductionRecords: records.filter(
        (record) =>
          record.status === 'asset-production',
      ).length,

      audioProductionRecords: records.filter(
        (record) =>
          record.status === 'audio-production',
      ).length,

      editingRecords: records.filter(
        (record) => record.status === 'editing',
      ).length,

      qualityReviewRecords: records.filter(
        (record) =>
          record.status === 'quality-review',
      ).length,

      approvedRecords: records.filter(
        (record) => record.status === 'approved',
      ).length,

      completedRecords: records.filter(
        (record) => record.status === 'completed',
      ).length,

      pendingHumanApproval: records.filter(
        (record) =>
          record.humanApprovalRequired &&
          !record.humanApproved,
      ).length,

      averageOverallQualityScore: this.average(
        records.map(
          (record) => record.overallQualityScore,
        ),
      ),

      averageOriginalityScore: this.average(
        records.map(
          (record) => record.originalityScore,
        ),
      ),

      totalEstimatedCost: Number(
        records
          .reduce(
            (total, record) =>
              total + record.estimatedCost,
            0,
          )
          .toFixed(2),
      ),

      totalActualCost: Number(
        records
          .reduce(
            (total, record) =>
              total + record.actualCost,
            0,
          )
          .toFixed(2),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaProductionInput,
  ): MediaProductionRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Production record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Production category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Production owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: MediaProductionRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',

      owner,
      projectId: input.projectId?.trim() ?? '',
      channelId: input.channelId?.trim() ?? '',
      platform:
        input.platform?.trim().toLowerCase() ??
        'global',
      language:
        input.language?.trim().toLowerCase() ??
        'en',
      culture:
        input.culture?.trim().toLowerCase() ??
        'global',
      audience:
        input.audience?.trim() ??
        'general audience',
      ageGroup:
        input.ageGroup?.trim() ?? 'all ages',

      format:
        input.format?.trim().toLowerCase() ??
        'video',
      genre:
        input.genre?.trim().toLowerCase() ??
        'general',
      creativeStyle:
        input.creativeStyle
          ?.trim()
          .toLowerCase() ?? 'adaptive',
      visualStyle:
        input.visualStyle
          ?.trim()
          .toLowerCase() ?? 'adaptive',
      aspectRatio:
        input.aspectRatio?.trim() ?? '16:9',
      resolution:
        input.resolution?.trim().toLowerCase() ??
        '4k',
      frameRate: this.nonNegativeNumber(
        input.frameRate ?? 30,
        'frameRate',
      ),
      targetDurationSeconds:
        this.nonNegativeNumber(
          input.targetDurationSeconds ?? 0,
          'targetDurationSeconds',
        ),

      title: input.title?.trim() ?? name,
      logline: input.logline?.trim() ?? '',
      synopsis: input.synopsis?.trim() ?? '',
      hook: input.hook?.trim() ?? '',
      script: input.script?.trim() ?? '',
      callToAction:
        input.callToAction?.trim() ?? '',

      scenes: (input.scenes ?? []).map(
        (scene, index) =>
          this.normalizeScene(scene, index + 1),
      ),

      selectedModels: this.normalizeList(
        input.selectedModels,
      ),
      characters: this.normalizeList(
        input.characters,
        false,
      ),
      locations: this.normalizeList(
        input.locations,
        false,
      ),
      visualAssets: this.normalizeList(
        input.visualAssets,
        false,
      ),
      audioAssets: this.normalizeList(
        input.audioAssets,
        false,
      ),
      musicAssets: this.normalizeList(
        input.musicAssets,
        false,
      ),
      voiceAssets: this.normalizeList(
        input.voiceAssets,
        false,
      ),
      editingAssets: this.normalizeList(
        input.editingAssets,
        false,
      ),

      scriptScore: this.score(
        input.scriptScore ?? 0,
        'scriptScore',
      ),
      visualScore: this.score(
        input.visualScore ?? 0,
        'visualScore',
      ),
      audioScore: this.score(
        input.audioScore ?? 0,
        'audioScore',
      ),
      continuityScore: this.score(
        input.continuityScore ?? 0,
        'continuityScore',
      ),
      originalityScore: this.score(
        input.originalityScore ?? 0,
        'originalityScore',
      ),
      audienceFitScore: this.score(
        input.audienceFitScore ?? 0,
        'audienceFitScore',
      ),
      technicalQualityScore: this.score(
        input.technicalQualityScore ?? 0,
        'technicalQualityScore',
      ),
      overallQualityScore: this.score(
        input.overallQualityScore ?? 0,
        'overallQualityScore',
      ),

      estimatedCost: this.nonNegativeNumber(
        input.estimatedCost ?? 0,
        'estimatedCost',
      ),
      actualCost: this.nonNegativeNumber(
        input.actualCost ?? 0,
        'actualCost',
      ),

      issues: this.normalizeList(
        input.issues,
        false,
      ),
      risks: this.normalizeList(
        input.risks,
        false,
      ),
      recommendations: this.normalizeList(
        input.recommendations,
        false,
      ),
      tags: this.normalizeList(input.tags),
      metadata: input.metadata ?? {},

      humanApprovalRequired:
        input.humanApprovalRequired ?? true,
      humanApproved:
        input.humanApproved ?? false,

      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: ProductionStatus;
    priority?: ProductionPriority;
    type?: ProductionType;
    category?: string;
    owner?: string;
    platform?: string;
    language?: string;
    projectId?: string;
    search?: string;
    humanApproved?: boolean;
  }): MediaProductionRecord[] {
    const search =
      filters?.search?.trim().toLowerCase();

    return [...this.records.values()]
      .filter((record) => {
        if (
          filters?.status &&
          record.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          record.priority !== filters.priority
        ) {
          return false;
        }

        if (
          filters?.type &&
          record.type !== filters.type
        ) {
          return false;
        }

        if (
          filters?.category &&
          record.category !== filters.category
        ) {
          return false;
        }

        if (
          filters?.owner &&
          record.owner.toLowerCase() !==
            filters.owner.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.platform &&
          record.platform !==
            filters.platform.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.language &&
          record.language !==
            filters.language.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.projectId &&
          record.projectId !== filters.projectId
        ) {
          return false;
        }

        if (
          filters?.humanApproved !== undefined &&
          record.humanApproved !==
            filters.humanApproved
        ) {
          return false;
        }

        if (search) {
          const searchable = [
            record.name,
            record.description ?? '',
            record.title,
            record.logline,
            record.synopsis,
            record.hook,
            record.script,
            record.category,
            record.type,
            record.owner,
            record.platform,
            record.language,
            record.genre,
            record.creativeStyle,
            record.visualStyle,
            ...record.characters,
            ...record.locations,
            ...record.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchable.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (first, second) =>
          second.overallQualityScore -
          first.overallQualityScore,
      );
  }

  getRecord(id: string): MediaProductionRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `${this.engineName} record '${id}' was not found`,
      );
    }

    return record;
  }

  updateRecord(
    id: string,
    input: UpdateMediaProductionInput,
  ): MediaProductionRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Production record name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Production owner cannot be empty',
      );
    }

    const updated: MediaProductionRecord = {
      ...current,
      ...input,

      name:
        input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ??
        current.description,
      category:
        input.category?.trim() ??
        current.category,
      owner:
        input.owner?.trim() ?? current.owner,

      projectId:
        input.projectId?.trim() ??
        current.projectId,
      channelId:
        input.channelId?.trim() ??
        current.channelId,
      platform:
        input.platform?.trim().toLowerCase() ??
        current.platform,
      language:
        input.language?.trim().toLowerCase() ??
        current.language,
      culture:
        input.culture?.trim().toLowerCase() ??
        current.culture,
      audience:
        input.audience?.trim() ??
        current.audience,
      ageGroup:
        input.ageGroup?.trim() ??
        current.ageGroup,

      format:
        input.format?.trim().toLowerCase() ??
        current.format,
      genre:
        input.genre?.trim().toLowerCase() ??
        current.genre,
      creativeStyle:
        input.creativeStyle
          ?.trim()
          .toLowerCase() ??
        current.creativeStyle,
      visualStyle:
        input.visualStyle
          ?.trim()
          .toLowerCase() ??
        current.visualStyle,
      aspectRatio:
        input.aspectRatio?.trim() ??
        current.aspectRatio,
      resolution:
        input.resolution
          ?.trim()
          .toLowerCase() ??
        current.resolution,

      frameRate:
        input.frameRate !== undefined
          ? this.nonNegativeNumber(
              input.frameRate,
              'frameRate',
            )
          : current.frameRate,

      targetDurationSeconds:
        input.targetDurationSeconds !==
        undefined
          ? this.nonNegativeNumber(
              input.targetDurationSeconds,
              'targetDurationSeconds',
            )
          : current.targetDurationSeconds,

      title:
        input.title?.trim() ?? current.title,
      logline:
        input.logline?.trim() ??
        current.logline,
      synopsis:
        input.synopsis?.trim() ??
        current.synopsis,
      hook:
        input.hook?.trim() ?? current.hook,
      script:
        input.script?.trim() ??
        current.script,
      callToAction:
        input.callToAction?.trim() ??
        current.callToAction,

      scenes:
        input.scenes !== undefined
          ? input.scenes.map((scene, index) =>
              this.normalizeScene(
                scene,
                index + 1,
              ),
            )
          : current.scenes,

      selectedModels:
        input.selectedModels !== undefined
          ? this.normalizeList(
              input.selectedModels,
            )
          : current.selectedModels,

      characters:
        input.characters !== undefined
          ? this.normalizeList(
              input.characters,
              false,
            )
          : current.characters,

      locations:
        input.locations !== undefined
          ? this.normalizeList(
              input.locations,
              false,
            )
          : current.locations,

      visualAssets:
        input.visualAssets !== undefined
          ? this.normalizeList(
              input.visualAssets,
              false,
            )
          : current.visualAssets,

      audioAssets:
        input.audioAssets !== undefined
          ? this.normalizeList(
              input.audioAssets,
              false,
            )
          : current.audioAssets,

      musicAssets:
        input.musicAssets !== undefined
          ? this.normalizeList(
              input.musicAssets,
              false,
            )
          : current.musicAssets,

      voiceAssets:
        input.voiceAssets !== undefined
          ? this.normalizeList(
              input.voiceAssets,
              false,
            )
          : current.voiceAssets,

      editingAssets:
        input.editingAssets !== undefined
          ? this.normalizeList(
              input.editingAssets,
              false,
            )
          : current.editingAssets,

      scriptScore:
        input.scriptScore !== undefined
          ? this.score(
              input.scriptScore,
              'scriptScore',
            )
          : current.scriptScore,

      visualScore:
        input.visualScore !== undefined
          ? this.score(
              input.visualScore,
              'visualScore',
            )
          : current.visualScore,

      audioScore:
        input.audioScore !== undefined
          ? this.score(
              input.audioScore,
              'audioScore',
            )
          : current.audioScore,

      continuityScore:
        input.continuityScore !== undefined
          ? this.score(
              input.continuityScore,
              'continuityScore',
            )
          : current.continuityScore,

      originalityScore:
        input.originalityScore !== undefined
          ? this.score(
              input.originalityScore,
              'originalityScore',
            )
          : current.originalityScore,

      audienceFitScore:
        input.audienceFitScore !== undefined
          ? this.score(
              input.audienceFitScore,
              'audienceFitScore',
            )
          : current.audienceFitScore,

      technicalQualityScore:
        input.technicalQualityScore !==
        undefined
          ? this.score(
              input.technicalQualityScore,
              'technicalQualityScore',
            )
          : current.technicalQualityScore,

      overallQualityScore:
        input.overallQualityScore !== undefined
          ? this.score(
              input.overallQualityScore,
              'overallQualityScore',
            )
          : current.overallQualityScore,

      estimatedCost:
        input.estimatedCost !== undefined
          ? this.nonNegativeNumber(
              input.estimatedCost,
              'estimatedCost',
            )
          : current.estimatedCost,

      actualCost:
        input.actualCost !== undefined
          ? this.nonNegativeNumber(
              input.actualCost,
              'actualCost',
            )
          : current.actualCost,

      issues:
        input.issues !== undefined
          ? this.normalizeList(
              input.issues,
              false,
            )
          : current.issues,

      risks:
        input.risks !== undefined
          ? this.normalizeList(
              input.risks,
              false,
            )
          : current.risks,

      recommendations:
        input.recommendations !== undefined
          ? this.normalizeList(
              input.recommendations,
              false,
            )
          : current.recommendations,

      tags:
        input.tags !== undefined
          ? this.normalizeList(input.tags)
          : current.tags,

      metadata:
        input.metadata ?? current.metadata,

      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);

    return updated;
  }

  startPreProduction(id: string) {
    return this.updateRecord(id, {
      status: 'pre-production',
    });
  }

  startScriptDevelopment(id: string) {
    return this.updateRecord(id, {
      status: 'script-development',
    });
  }

  startStoryboarding(id: string) {
    return this.updateRecord(id, {
      status: 'storyboarding',
    });
  }

  startAssetProduction(id: string) {
    return this.updateRecord(id, {
      status: 'asset-production',
    });
  }

  startAudioProduction(id: string) {
    return this.updateRecord(id, {
      status: 'audio-production',
    });
  }

  startEditing(id: string) {
    return this.updateRecord(id, {
      status: 'editing',
    });
  }

  startQualityReview(id: string) {
    return this.updateRecord(id, {
      status: 'quality-review',
    });
  }

  submitForHumanReview(id: string) {
    return this.updateRecord(id, {
      status: 'human-review',
    });
  }

  approveByHuman(id: string) {
    return this.updateRecord(id, {
      status: 'approved',
      humanApproved: true,
    });
  }

  rejectByHuman(id: string) {
    return this.updateRecord(id, {
      status: 'rejected',
      humanApproved: false,
    });
  }

  startRendering(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before rendering',
      );
    }

    return this.updateRecord(id, {
      status: 'rendering',
    });
  }

  completeProduction(id: string) {
    return this.updateRecord(id, {
      status: 'completed',
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addScene(
    id: string,
    input: Partial<ProductionScene>,
  ) {
    const record = this.getRecord(id);

    const scene = this.normalizeScene(
      {
        id: input.id ?? randomUUID(),
        order:
          input.order ??
          record.scenes.length + 1,
        title:
          input.title ??
          `Scene ${record.scenes.length + 1}`,
        description:
          input.description ?? '',
        narration: input.narration ?? '',
        dialogue: input.dialogue ?? [],
        visualPrompt:
          input.visualPrompt ?? '',
        cameraDirection:
          input.cameraDirection ?? '',
        lightingDirection:
          input.lightingDirection ?? '',
        soundDirection:
          input.soundDirection ?? '',
        musicDirection:
          input.musicDirection ?? '',
        durationSeconds:
          input.durationSeconds ?? 0,
        status: input.status ?? 'draft',
      },
      record.scenes.length + 1,
    );

    return this.updateRecord(id, {
      scenes: [...record.scenes, scene],
    });
  }

  updateScene(
    id: string,
    sceneId: string,
    input: Partial<ProductionScene>,
  ) {
    const record = this.getRecord(id);

    const sceneExists = record.scenes.some(
      (scene) => scene.id === sceneId,
    );

    if (!sceneExists) {
      throw new NotFoundException(
        `Scene '${sceneId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      scenes: record.scenes.map((scene) =>
        scene.id === sceneId
          ? this.normalizeScene(
              {
                ...scene,
                ...input,
                id: scene.id,
              },
              scene.order,
            )
          : scene,
      ),
    });
  }

  removeScene(id: string, sceneId: string) {
    const record = this.getRecord(id);

    const sceneExists = record.scenes.some(
      (scene) => scene.id === sceneId,
    );

    if (!sceneExists) {
      throw new NotFoundException(
        `Scene '${sceneId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      scenes: record.scenes
        .filter(
          (scene) => scene.id !== sceneId,
        )
        .map((scene, index) => ({
          ...scene,
          order: index + 1,
        })),
    });
  }

  addIssue(id: string, issue: string) {
    const record = this.getRecord(id);
    const normalized = issue?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Production issue is required',
      );
    }

    return this.updateRecord(id, {
      issues: [...record.issues, normalized],
    });
  }

  addAsset(
    id: string,
    assetType:
      | 'visual'
      | 'audio'
      | 'music'
      | 'voice'
      | 'editing',
    asset: string,
  ) {
    const record = this.getRecord(id);
    const normalized = asset?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Asset is required',
      );
    }

    switch (assetType) {
      case 'visual':
        return this.updateRecord(id, {
          visualAssets: [
            ...record.visualAssets,
            normalized,
          ],
        });

      case 'audio':
        return this.updateRecord(id, {
          audioAssets: [
            ...record.audioAssets,
            normalized,
          ],
        });

      case 'music':
        return this.updateRecord(id, {
          musicAssets: [
            ...record.musicAssets,
            normalized,
          ],
        });

      case 'voice':
        return this.updateRecord(id, {
          voiceAssets: [
            ...record.voiceAssets,
            normalized,
          ],
        });

      case 'editing':
        return this.updateRecord(id, {
          editingAssets: [
            ...record.editingAssets,
            normalized,
          ],
        });
    }
  }

  generateScriptBlueprint(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      title: record.title,
      logline: record.logline,
      synopsis: record.synopsis,
      hook: record.hook,
      targetDurationSeconds:
        record.targetDurationSeconds,
      structure: [
        'cold-open',
        'audience-hook',
        'world-and-context',
        'central-question',
        'progressive-development',
        'major-reveal',
        'climax',
        'resolution',
        'call-to-action',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateStoryboardBlueprint(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      project: record.name,
      aspectRatio: record.aspectRatio,
      resolution: record.resolution,
      frameRate: record.frameRate,
      scenes: record.scenes.map((scene) => ({
        order: scene.order,
        title: scene.title,
        visualPrompt: scene.visualPrompt,
        cameraDirection:
          scene.cameraDirection,
        lightingDirection:
          scene.lightingDirection,
        durationSeconds:
          scene.durationSeconds,
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  generateVisualProductionPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      creativeStyle:
        record.creativeStyle,
      visualStyle: record.visualStyle,
      selectedModels:
        record.selectedModels,
      characters: record.characters,
      locations: record.locations,
      requirements: [
        'character-consistency',
        'visual-style-consistency',
        'camera-language-consistency',
        'lighting-continuity',
        'color-continuity',
        'brand-identity-compliance',
        'cultural-compliance',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateAudioProductionPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      language: record.language,
      culture: record.culture,
      voiceAssets: record.voiceAssets,
      musicAssets: record.musicAssets,
      audioAssets: record.audioAssets,
      stages: [
        'voice-casting',
        'voice-generation-or-recording',
        'dialogue-cleanup',
        'sound-design',
        'music-composition',
        'audio-mixing',
        'loudness-normalization',
        'audio-quality-review',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateEditingPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      format: record.format,
      platform: record.platform,
      targetDurationSeconds:
        record.targetDurationSeconds,
      editingAssets:
        record.editingAssets,
      stages: [
        'media-ingestion',
        'rough-cut',
        'story-cut',
        'sound-sync',
        'motion-graphics',
        'visual-effects',
        'color-grading',
        'audio-mix',
        'captions',
        'final-master',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  runQualityAssessment(id: string) {
    const record = this.getRecord(id);

    const score =
      record.scriptScore * 0.15 +
      record.visualScore * 0.15 +
      record.audioScore * 0.12 +
      record.continuityScore * 0.15 +
      record.originalityScore * 0.13 +
      record.audienceFitScore * 0.12 +
      record.technicalQualityScore * 0.18;

    const recommendation =
      score >= 90
        ? 'approve-for-human-review'
        : score >= 80
          ? 'minor-improvements-required'
          : score >= 65
            ? 'major-improvements-required'
            : 'production-rework-required';

    return {
      id: record.id,
      score: Number(score.toFixed(2)),
      recommendation,
      issues: record.issues,
      humanApprovalRequired:
        record.humanApprovalRequired,
      assessedAt: new Date().toISOString(),
    };
  }

  getProductionTimeline(id: string) {
    const record = this.getRecord(id);

    const sceneDuration =
      record.scenes.reduce(
        (total, scene) =>
          total + scene.durationSeconds,
        0,
      );

    return {
      id: record.id,
      targetDurationSeconds:
        record.targetDurationSeconds,
      sceneDurationSeconds:
        sceneDuration,
      durationVarianceSeconds:
        sceneDuration -
        record.targetDurationSeconds,
      stages: [
        'pre-production',
        'script-development',
        'storyboarding',
        'asset-production',
        'audio-production',
        'editing',
        'quality-review',
        'human-review',
        'rendering',
        'completed',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  getTopRecords(limit = 10) {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(
      0,
      safeLimit,
    );
  }

  removeRecord(id: string) {
    this.getRecord(id);
    this.records.delete(id);

    return {
      success: true as const,
      id,
    };
  }

  private normalizeScene(
    scene: ProductionScene,
    fallbackOrder: number,
  ): ProductionScene {
    return {
      id: scene.id?.trim() || randomUUID(),
      order: Math.max(
        1,
        Number(scene.order) || fallbackOrder,
      ),
      title:
        scene.title?.trim() ||
        `Scene ${fallbackOrder}`,
      description:
        scene.description?.trim() ?? '',
      narration:
        scene.narration?.trim() ?? '',
      dialogue: this.normalizeList(
        scene.dialogue,
        false,
      ),
      visualPrompt:
        scene.visualPrompt?.trim() ?? '',
      cameraDirection:
        scene.cameraDirection?.trim() ?? '',
      lightingDirection:
        scene.lightingDirection?.trim() ?? '',
      soundDirection:
        scene.soundDirection?.trim() ?? '',
      musicDirection:
        scene.musicDirection?.trim() ?? '',
      durationSeconds:
        this.nonNegativeNumber(
          scene.durationSeconds ?? 0,
          'durationSeconds',
        ),
      status: scene.status ?? 'draft',
    };
  }

  private average(values: number[]) {
    if (values.length === 0) {
      return 0;
    }

    return Number(
      (
        values.reduce(
          (total, value) => total + value,
          0,
        ) / values.length
      ).toFixed(2),
    );
  }

  private score(
    value: number,
    field: string,
  ) {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        `${field} must be a valid number`,
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private nonNegativeNumber(
    value: number,
    field: string,
  ) {
    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      throw new BadRequestException(
        `${field} must be zero or greater`,
      );
    }

    return Number(value.toFixed(2));
  }

  private normalizeList(
    values?: string[],
    lowercase = true,
  ) {
    if (!values) {
      return [];
    }

    return [
      ...new Set(
        values
          .map((value) => {
            const normalized = value.trim();

            return lowercase
              ? normalized.toLowerCase()
              : normalized;
          })
          .filter(Boolean),
      ),
    ];
  }
}
