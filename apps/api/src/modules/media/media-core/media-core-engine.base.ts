import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type MediaCoreStatus =
  | 'draft'
  | 'analyzing'
  | 'planning'
  | 'review'
  | 'approved'
  | 'executing'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected'
  | 'archived';

export type MediaCorePriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type MediaCoreRisk =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type MediaCoreType =
  | 'creative-production'
  | 'media-ecosystem'
  | 'brand-intelligence'
  | 'brand-identity'
  | 'creative-council'
  | 'campaign'
  | 'channel'
  | 'content'
  | 'intellectual-property'
  | 'other';

export interface MediaCoreRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: MediaCoreType;
  status: MediaCoreStatus;
  priority: MediaCorePriority;
  risk: MediaCoreRisk;
  owner: string;
  platform: string;
  language: string;
  culture: string;
  audience: string;
  ageGroup: string;
  creativeStyle: string;
  visualStyle: string;
  productionModel: string;
  qualityScore: number;
  originalityScore: number;
  consistencyScore: number;
  culturalFitScore: number;
  strategicScore: number;
  confidenceScore: number;
  estimatedCost: number;
  estimatedRevenue: number;
  assignedAgents: string[];
  capabilities: string[];
  requirements: string[];
  risks: string[];
  recommendations: string[];
  tags: string[];
  metadata: Record<string, unknown>;
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaCoreInput {
  name: string;
  description?: string;
  category: string;
  type?: MediaCoreType;
  status?: MediaCoreStatus;
  priority?: MediaCorePriority;
  risk?: MediaCoreRisk;
  owner: string;
  platform?: string;
  language?: string;
  culture?: string;
  audience?: string;
  ageGroup?: string;
  creativeStyle?: string;
  visualStyle?: string;
  productionModel?: string;
  qualityScore?: number;
  originalityScore?: number;
  consistencyScore?: number;
  culturalFitScore?: number;
  strategicScore?: number;
  confidenceScore?: number;
  estimatedCost?: number;
  estimatedRevenue?: number;
  assignedAgents?: string[];
  capabilities?: string[];
  requirements?: string[];
  risks?: string[];
  recommendations?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
}

export interface UpdateMediaCoreInput
  extends Partial<CreateMediaCoreInput> {}

export abstract class MediaCoreEngineBase {
  private readonly records =
    new Map<string, MediaCoreRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard() {
    const records = [...this.records.values()];

    const totalEstimatedCost = records.reduce(
      (total, record) =>
        total + record.estimatedCost,
      0,
    );

    const totalEstimatedRevenue = records.reduce(
      (total, record) =>
        total + record.estimatedRevenue,
      0,
    );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture: 'AVOS Media Enterprise Core',
      humanFinalAuthority: true,
      totalRecords: records.length,
      draftRecords: records.filter(
        (record) => record.status === 'draft',
      ).length,
      analyzingRecords: records.filter(
        (record) => record.status === 'analyzing',
      ).length,
      planningRecords: records.filter(
        (record) => record.status === 'planning',
      ).length,
      reviewRecords: records.filter(
        (record) => record.status === 'review',
      ).length,
      approvedRecords: records.filter(
        (record) => record.status === 'approved',
      ).length,
      executingRecords: records.filter(
        (record) => record.status === 'executing',
      ).length,
      activeRecords: records.filter(
        (record) => record.status === 'active',
      ).length,
      criticalRecords: records.filter(
        (record) => record.priority === 'critical',
      ).length,
      pendingHumanApproval: records.filter(
        (record) =>
          record.humanApprovalRequired &&
          !record.humanApproved,
      ).length,
      totalEstimatedCost: Number(
        totalEstimatedCost.toFixed(2),
      ),
      totalEstimatedRevenue: Number(
        totalEstimatedRevenue.toFixed(2),
      ),
      estimatedProfit: Number(
        (
          totalEstimatedRevenue -
          totalEstimatedCost
        ).toFixed(2),
      ),
      averageQualityScore: this.average(
        records.map(
          (record) => record.qualityScore,
        ),
      ),
      averageOriginalityScore: this.average(
        records.map(
          (record) => record.originalityScore,
        ),
      ),
      averageConsistencyScore: this.average(
        records.map(
          (record) => record.consistencyScore,
        ),
      ),
      averageStrategicScore: this.average(
        records.map(
          (record) => record.strategicScore,
        ),
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaCoreInput,
  ): MediaCoreRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Record category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Record owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: MediaCoreRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      risk: input.risk ?? 'low',
      owner,
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
        input.ageGroup?.trim() ??
        'all ages',
      creativeStyle:
        input.creativeStyle?.trim().toLowerCase() ??
        'adaptive',
      visualStyle:
        input.visualStyle?.trim().toLowerCase() ??
        'adaptive',
      productionModel:
        input.productionModel
          ?.trim()
          .toLowerCase() ?? 'hybrid-ai',
      qualityScore: this.score(
        input.qualityScore ?? 0,
        'qualityScore',
      ),
      originalityScore: this.score(
        input.originalityScore ?? 0,
        'originalityScore',
      ),
      consistencyScore: this.score(
        input.consistencyScore ?? 0,
        'consistencyScore',
      ),
      culturalFitScore: this.score(
        input.culturalFitScore ?? 0,
        'culturalFitScore',
      ),
      strategicScore: this.score(
        input.strategicScore ?? 0,
        'strategicScore',
      ),
      confidenceScore: this.score(
        input.confidenceScore ?? 0,
        'confidenceScore',
      ),
      estimatedCost: this.money(
        input.estimatedCost ?? 0,
        'estimatedCost',
      ),
      estimatedRevenue: this.money(
        input.estimatedRevenue ?? 0,
        'estimatedRevenue',
      ),
      assignedAgents: this.normalizeList(
        input.assignedAgents,
      ),
      capabilities: this.normalizeList(
        input.capabilities,
      ),
      requirements: this.normalizeList(
        input.requirements,
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
    status?: MediaCoreStatus;
    priority?: MediaCorePriority;
    risk?: MediaCoreRisk;
    type?: MediaCoreType;
    category?: string;
    owner?: string;
    platform?: string;
    language?: string;
    search?: string;
    humanApproved?: boolean;
  }): MediaCoreRecord[] {
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
          filters?.risk &&
          record.risk !== filters.risk
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
            record.category,
            record.type,
            record.owner,
            record.platform,
            record.language,
            record.culture,
            record.audience,
            record.creativeStyle,
            record.visualStyle,
            ...record.assignedAgents,
            ...record.capabilities,
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
      .sort((first, second) => {
        if (
          second.strategicScore !==
          first.strategicScore
        ) {
          return (
            second.strategicScore -
            first.strategicScore
          );
        }

        return (
          second.qualityScore -
          first.qualityScore
        );
      });
  }

  getRecord(id: string): MediaCoreRecord {
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
    input: UpdateMediaCoreInput,
  ): MediaCoreRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Record name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Record owner cannot be empty',
      );
    }

    const updated: MediaCoreRecord = {
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
      productionModel:
        input.productionModel
          ?.trim()
          .toLowerCase() ??
        current.productionModel,
      qualityScore:
        input.qualityScore !== undefined
          ? this.score(
              input.qualityScore,
              'qualityScore',
            )
          : current.qualityScore,
      originalityScore:
        input.originalityScore !== undefined
          ? this.score(
              input.originalityScore,
              'originalityScore',
            )
          : current.originalityScore,
      consistencyScore:
        input.consistencyScore !== undefined
          ? this.score(
              input.consistencyScore,
              'consistencyScore',
            )
          : current.consistencyScore,
      culturalFitScore:
        input.culturalFitScore !== undefined
          ? this.score(
              input.culturalFitScore,
              'culturalFitScore',
            )
          : current.culturalFitScore,
      strategicScore:
        input.strategicScore !== undefined
          ? this.score(
              input.strategicScore,
              'strategicScore',
            )
          : current.strategicScore,
      confidenceScore:
        input.confidenceScore !== undefined
          ? this.score(
              input.confidenceScore,
              'confidenceScore',
            )
          : current.confidenceScore,
      estimatedCost:
        input.estimatedCost !== undefined
          ? this.money(
              input.estimatedCost,
              'estimatedCost',
            )
          : current.estimatedCost,
      estimatedRevenue:
        input.estimatedRevenue !== undefined
          ? this.money(
              input.estimatedRevenue,
              'estimatedRevenue',
            )
          : current.estimatedRevenue,
      assignedAgents:
        input.assignedAgents !== undefined
          ? this.normalizeList(
              input.assignedAgents,
            )
          : current.assignedAgents,
      capabilities:
        input.capabilities !== undefined
          ? this.normalizeList(
              input.capabilities,
            )
          : current.capabilities,
      requirements:
        input.requirements !== undefined
          ? this.normalizeList(
              input.requirements,
              false,
            )
          : current.requirements,
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

  startAnalysis(id: string) {
    return this.updateRecord(id, {
      status: 'analyzing',
    });
  }

  startPlanning(id: string) {
    return this.updateRecord(id, {
      status: 'planning',
    });
  }

  submitForReview(id: string) {
    return this.updateRecord(id, {
      status: 'review',
    });
  }

  approveByHuman(id: string) {
    return this.updateRecord(id, {
      status: 'approved',
      humanApproved: true,
    });
  }

  startExecution(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before execution',
      );
    }

    return this.updateRecord(id, {
      status: 'executing',
    });
  }

  activateRecord(id: string) {
    return this.updateRecord(id, {
      status: 'active',
    });
  }

  pauseRecord(id: string) {
    return this.updateRecord(id, {
      status: 'paused',
    });
  }

  completeRecord(id: string) {
    return this.updateRecord(id, {
      status: 'completed',
    });
  }

  rejectRecord(id: string) {
    return this.updateRecord(id, {
      status: 'rejected',
      humanApproved: false,
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  assignAgent(
    id: string,
    agent: string,
  ) {
    const record = this.getRecord(id);
    const normalized = agent?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Agent name is required',
      );
    }

    return this.updateRecord(id, {
      assignedAgents: [
        ...record.assignedAgents,
        normalized,
      ],
    });
  }

  addCapability(
    id: string,
    capability: string,
  ) {
    const record = this.getRecord(id);
    const normalized = capability?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Capability is required',
      );
    }

    return this.updateRecord(id, {
      capabilities: [
        ...record.capabilities,
        normalized,
      ],
    });
  }

  addRecommendation(
    id: string,
    recommendation: string,
  ) {
    const record = this.getRecord(id);
    const normalized =
      recommendation?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Recommendation is required',
      );
    }

    return this.updateRecord(id, {
      recommendations: [
        ...record.recommendations,
        normalized,
      ],
    });
  }

  analyzeCreativeDirection(id: string) {
    const record = this.getRecord(id);

    const score =
      record.qualityScore * 0.2 +
      record.originalityScore * 0.2 +
      record.consistencyScore * 0.15 +
      record.culturalFitScore * 0.15 +
      record.strategicScore * 0.2 +
      record.confidenceScore * 0.1;

    const recommendation =
      score >= 85
        ? 'production-ready'
        : score >= 70
          ? 'high-potential'
          : score >= 50
            ? 'requires-refinement'
            : 'redesign-required';

    return {
      id: record.id,
      creativeStyle: record.creativeStyle,
      visualStyle: record.visualStyle,
      productionModel:
        record.productionModel,
      score: Number(score.toFixed(2)),
      recommendation,
      humanApprovalRequired:
        record.humanApprovalRequired,
      analyzedAt: new Date().toISOString(),
    };
  }

  calculateBusinessCase(id: string) {
    const record = this.getRecord(id);

    const estimatedProfit =
      record.estimatedRevenue -
      record.estimatedCost;

    const roi =
      record.estimatedCost === 0
        ? record.estimatedRevenue > 0
          ? 100
          : 0
        : (estimatedProfit /
            record.estimatedCost) *
          100;

    return {
      id: record.id,
      estimatedCost: record.estimatedCost,
      estimatedRevenue:
        record.estimatedRevenue,
      estimatedProfit: Number(
        estimatedProfit.toFixed(2),
      ),
      roi: Number(roi.toFixed(2)),
      calculatedAt: new Date().toISOString(),
    };
  }

  generateAgentCouncil(id: string) {
    const record = this.getRecord(id);

    const defaultCouncil = [
      'executive-producer',
      'film-director',
      'script-writer',
      'story-architect',
      'art-director',
      'director-of-photography',
      'lighting-director',
      'camera-director',
      'sound-director',
      'music-composer',
      'voice-director',
      'vfx-director',
      'quality-director',
    ];

    return {
      id: record.id,
      council:
        record.assignedAgents.length > 0
          ? record.assignedAgents
          : defaultCouncil,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateProductionBlueprint(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      project: record.name,
      platform: record.platform,
      audience: record.audience,
      ageGroup: record.ageGroup,
      language: record.language,
      culture: record.culture,
      creativeStyle:
        record.creativeStyle,
      visualStyle: record.visualStyle,
      productionModel:
        record.productionModel,
      stages: [
        'research',
        'concept-development',
        'script-development',
        'art-direction',
        'production-design',
        'asset-generation',
        'voice-and-music-production',
        'video-production',
        'editing-and-vfx',
        'quality-assurance',
        'human-approval',
        'distribution',
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

  private money(
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
