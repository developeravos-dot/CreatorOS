import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type PublishingStatus =
  | 'draft'
  | 'planning'
  | 'optimization'
  | 'localization'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'monitoring'
  | 'paused'
  | 'completed'
  | 'rejected'
  | 'archived';

export type PublishingPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PublishingType =
  | 'release'
  | 'campaign'
  | 'distribution'
  | 'localization'
  | 'growth'
  | 'optimization'
  | 'analytics'
  | 'other';

export interface DistributionChannel {
  id: string;
  platform: string;
  accountId: string;
  region: string;
  language: string;
  status:
    | 'draft'
    | 'ready'
    | 'scheduled'
    | 'published'
    | 'failed';
  scheduledAt: string;
  publishedAt: string;
  externalId: string;
  externalUrl: string;
}

export interface MediaPublishingRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: PublishingType;
  status: PublishingStatus;
  priority: PublishingPriority;

  owner: string;
  projectId: string;
  productionId: string;
  brandId: string;

  title: string;
  descriptionText: string;
  shortDescription: string;
  hook: string;
  callToAction: string;

  primaryPlatform: string;
  platforms: string[];
  regions: string[];
  languages: string[];
  audiences: string[];

  keywords: string[];
  hashtags: string[];
  tags: string[];
  thumbnailVariants: string[];
  titleVariants: string[];
  descriptionVariants: string[];

  distributionChannels: DistributionChannel[];

  scheduledAt: string;
  publishedAt: string;
  campaignStartAt: string;
  campaignEndAt: string;

  impressions: number;
  views: number;
  watchTimeMinutes: number;
  likes: number;
  comments: number;
  shares: number;
  subscribersGained: number;
  conversions: number;
  revenue: number;
  cost: number;

  metadataScore: number;
  titleScore: number;
  thumbnailScore: number;
  localizationScore: number;
  audienceFitScore: number;
  distributionScore: number;
  growthScore: number;
  performanceScore: number;

  risks: string[];
  issues: string[];
  recommendations: string[];
  experiments: string[];

  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaPublishingInput {
  name: string;
  description?: string;
  category: string;
  type?: PublishingType;
  status?: PublishingStatus;
  priority?: PublishingPriority;

  owner: string;
  projectId?: string;
  productionId?: string;
  brandId?: string;

  title?: string;
  descriptionText?: string;
  shortDescription?: string;
  hook?: string;
  callToAction?: string;

  primaryPlatform?: string;
  platforms?: string[];
  regions?: string[];
  languages?: string[];
  audiences?: string[];

  keywords?: string[];
  hashtags?: string[];
  tags?: string[];
  thumbnailVariants?: string[];
  titleVariants?: string[];
  descriptionVariants?: string[];

  distributionChannels?: DistributionChannel[];

  scheduledAt?: string;
  publishedAt?: string;
  campaignStartAt?: string;
  campaignEndAt?: string;

  impressions?: number;
  views?: number;
  watchTimeMinutes?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  subscribersGained?: number;
  conversions?: number;
  revenue?: number;
  cost?: number;

  metadataScore?: number;
  titleScore?: number;
  thumbnailScore?: number;
  localizationScore?: number;
  audienceFitScore?: number;
  distributionScore?: number;
  growthScore?: number;
  performanceScore?: number;

  risks?: string[];
  issues?: string[];
  recommendations?: string[];
  experiments?: string[];

  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
}

export interface UpdateMediaPublishingInput
  extends Partial<CreateMediaPublishingInput> {}

export abstract class MediaPublishingGrowthEngineBase {
  private readonly records =
    new Map<string, MediaPublishingRecord>();

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
        'AVOS Media Publishing Distribution and Growth',
      humanFinalAuthority: true,

      totalRecords: records.length,

      planningRecords: records.filter(
        (record) => record.status === 'planning',
      ).length,

      localizationRecords: records.filter(
        (record) =>
          record.status === 'localization',
      ).length,

      scheduledRecords: records.filter(
        (record) => record.status === 'scheduled',
      ).length,

      publishedRecords: records.filter(
        (record) => record.status === 'published',
      ).length,

      monitoringRecords: records.filter(
        (record) =>
          record.status === 'monitoring',
      ).length,

      pendingHumanApproval: records.filter(
        (record) =>
          record.humanApprovalRequired &&
          !record.humanApproved,
      ).length,

      totalViews: records.reduce(
        (total, record) => total + record.views,
        0,
      ),

      totalWatchTimeMinutes: Number(
        records
          .reduce(
            (total, record) =>
              total + record.watchTimeMinutes,
            0,
          )
          .toFixed(2),
      ),

      totalRevenue: Number(
        records
          .reduce(
            (total, record) =>
              total + record.revenue,
            0,
          )
          .toFixed(2),
      ),

      totalCost: Number(
        records
          .reduce(
            (total, record) =>
              total + record.cost,
            0,
          )
          .toFixed(2),
      ),

      averagePerformanceScore: this.average(
        records.map(
          (record) => record.performanceScore,
        ),
      ),

      averageGrowthScore: this.average(
        records.map(
          (record) => record.growthScore,
        ),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaPublishingInput,
  ): MediaPublishingRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Publishing record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Publishing category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Publishing owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: MediaPublishingRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',

      owner,
      projectId: input.projectId?.trim() ?? '',
      productionId:
        input.productionId?.trim() ?? '',
      brandId: input.brandId?.trim() ?? '',

      title: input.title?.trim() ?? name,
      descriptionText:
        input.descriptionText?.trim() ?? '',
      shortDescription:
        input.shortDescription?.trim() ?? '',
      hook: input.hook?.trim() ?? '',
      callToAction:
        input.callToAction?.trim() ?? '',

      primaryPlatform:
        input.primaryPlatform
          ?.trim()
          .toLowerCase() ?? 'global',

      platforms: this.normalizeList(
        input.platforms,
      ),

      regions: this.normalizeList(
        input.regions,
      ),

      languages: this.normalizeList(
        input.languages,
      ),

      audiences: this.normalizeList(
        input.audiences,
        false,
      ),

      keywords: this.normalizeList(
        input.keywords,
      ),

      hashtags: this.normalizeList(
        input.hashtags,
      ),

      tags: this.normalizeList(input.tags),

      thumbnailVariants: this.normalizeList(
        input.thumbnailVariants,
        false,
      ),

      titleVariants: this.normalizeList(
        input.titleVariants,
        false,
      ),

      descriptionVariants: this.normalizeList(
        input.descriptionVariants,
        false,
      ),

      distributionChannels:
        input.distributionChannels?.map(
          (channel) =>
            this.normalizeChannel(channel),
        ) ?? [],

      scheduledAt:
        input.scheduledAt?.trim() ?? '',
      publishedAt:
        input.publishedAt?.trim() ?? '',
      campaignStartAt:
        input.campaignStartAt?.trim() ?? '',
      campaignEndAt:
        input.campaignEndAt?.trim() ?? '',

      impressions: this.nonNegativeNumber(
        input.impressions ?? 0,
        'impressions',
      ),

      views: this.nonNegativeNumber(
        input.views ?? 0,
        'views',
      ),

      watchTimeMinutes:
        this.nonNegativeNumber(
          input.watchTimeMinutes ?? 0,
          'watchTimeMinutes',
        ),

      likes: this.nonNegativeNumber(
        input.likes ?? 0,
        'likes',
      ),

      comments: this.nonNegativeNumber(
        input.comments ?? 0,
        'comments',
      ),

      shares: this.nonNegativeNumber(
        input.shares ?? 0,
        'shares',
      ),

      subscribersGained:
        this.nonNegativeNumber(
          input.subscribersGained ?? 0,
          'subscribersGained',
        ),

      conversions: this.nonNegativeNumber(
        input.conversions ?? 0,
        'conversions',
      ),

      revenue: this.nonNegativeNumber(
        input.revenue ?? 0,
        'revenue',
      ),

      cost: this.nonNegativeNumber(
        input.cost ?? 0,
        'cost',
      ),

      metadataScore: this.score(
        input.metadataScore ?? 0,
        'metadataScore',
      ),

      titleScore: this.score(
        input.titleScore ?? 0,
        'titleScore',
      ),

      thumbnailScore: this.score(
        input.thumbnailScore ?? 0,
        'thumbnailScore',
      ),

      localizationScore: this.score(
        input.localizationScore ?? 0,
        'localizationScore',
      ),

      audienceFitScore: this.score(
        input.audienceFitScore ?? 0,
        'audienceFitScore',
      ),

      distributionScore: this.score(
        input.distributionScore ?? 0,
        'distributionScore',
      ),

      growthScore: this.score(
        input.growthScore ?? 0,
        'growthScore',
      ),

      performanceScore: this.score(
        input.performanceScore ?? 0,
        'performanceScore',
      ),

      risks: this.normalizeList(
        input.risks,
        false,
      ),

      issues: this.normalizeList(
        input.issues,
        false,
      ),

      recommendations: this.normalizeList(
        input.recommendations,
        false,
      ),

      experiments: this.normalizeList(
        input.experiments,
        false,
      ),

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
    status?: PublishingStatus;
    priority?: PublishingPriority;
    type?: PublishingType;
    category?: string;
    owner?: string;
    platform?: string;
    language?: string;
    region?: string;
    search?: string;
    humanApproved?: boolean;
  }) {
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
          !record.platforms.includes(
            filters.platform.toLowerCase(),
          ) &&
          record.primaryPlatform !==
            filters.platform.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.language &&
          !record.languages.includes(
            filters.language.toLowerCase(),
          )
        ) {
          return false;
        }

        if (
          filters?.region &&
          !record.regions.includes(
            filters.region.toLowerCase(),
          )
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
            record.descriptionText,
            record.shortDescription,
            record.hook,
            record.callToAction,
            record.category,
            record.type,
            record.owner,
            record.primaryPlatform,
            ...record.platforms,
            ...record.regions,
            ...record.languages,
            ...record.audiences,
            ...record.keywords,
            ...record.hashtags,
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
          second.performanceScore -
          first.performanceScore,
      );
  }

  getRecord(id: string) {
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
    input: UpdateMediaPublishingInput,
  ) {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Publishing record name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Publishing owner cannot be empty',
      );
    }

    const updated = {
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

      productionId:
        input.productionId?.trim() ??
        current.productionId,

      brandId:
        input.brandId?.trim() ??
        current.brandId,

      title:
        input.title?.trim() ?? current.title,

      descriptionText:
        input.descriptionText?.trim() ??
        current.descriptionText,

      shortDescription:
        input.shortDescription?.trim() ??
        current.shortDescription,

      hook:
        input.hook?.trim() ?? current.hook,

      callToAction:
        input.callToAction?.trim() ??
        current.callToAction,

      primaryPlatform:
        input.primaryPlatform
          ?.trim()
          .toLowerCase() ??
        current.primaryPlatform,

      platforms:
        input.platforms !== undefined
          ? this.normalizeList(
              input.platforms,
            )
          : current.platforms,

      regions:
        input.regions !== undefined
          ? this.normalizeList(input.regions)
          : current.regions,

      languages:
        input.languages !== undefined
          ? this.normalizeList(
              input.languages,
            )
          : current.languages,

      audiences:
        input.audiences !== undefined
          ? this.normalizeList(
              input.audiences,
              false,
            )
          : current.audiences,

      keywords:
        input.keywords !== undefined
          ? this.normalizeList(input.keywords)
          : current.keywords,

      hashtags:
        input.hashtags !== undefined
          ? this.normalizeList(
              input.hashtags,
            )
          : current.hashtags,

      tags:
        input.tags !== undefined
          ? this.normalizeList(input.tags)
          : current.tags,

      thumbnailVariants:
        input.thumbnailVariants !== undefined
          ? this.normalizeList(
              input.thumbnailVariants,
              false,
            )
          : current.thumbnailVariants,

      titleVariants:
        input.titleVariants !== undefined
          ? this.normalizeList(
              input.titleVariants,
              false,
            )
          : current.titleVariants,

      descriptionVariants:
        input.descriptionVariants !== undefined
          ? this.normalizeList(
              input.descriptionVariants,
              false,
            )
          : current.descriptionVariants,

      distributionChannels:
        input.distributionChannels !== undefined
          ? input.distributionChannels.map(
              (channel) =>
                this.normalizeChannel(channel),
            )
          : current.distributionChannels,

      scheduledAt:
        input.scheduledAt?.trim() ??
        current.scheduledAt,

      publishedAt:
        input.publishedAt?.trim() ??
        current.publishedAt,

      campaignStartAt:
        input.campaignStartAt?.trim() ??
        current.campaignStartAt,

      campaignEndAt:
        input.campaignEndAt?.trim() ??
        current.campaignEndAt,

      impressions:
        input.impressions !== undefined
          ? this.nonNegativeNumber(
              input.impressions,
              'impressions',
            )
          : current.impressions,

      views:
        input.views !== undefined
          ? this.nonNegativeNumber(
              input.views,
              'views',
            )
          : current.views,

      watchTimeMinutes:
        input.watchTimeMinutes !== undefined
          ? this.nonNegativeNumber(
              input.watchTimeMinutes,
              'watchTimeMinutes',
            )
          : current.watchTimeMinutes,

      likes:
        input.likes !== undefined
          ? this.nonNegativeNumber(
              input.likes,
              'likes',
            )
          : current.likes,

      comments:
        input.comments !== undefined
          ? this.nonNegativeNumber(
              input.comments,
              'comments',
            )
          : current.comments,

      shares:
        input.shares !== undefined
          ? this.nonNegativeNumber(
              input.shares,
              'shares',
            )
          : current.shares,

      subscribersGained:
        input.subscribersGained !== undefined
          ? this.nonNegativeNumber(
              input.subscribersGained,
              'subscribersGained',
            )
          : current.subscribersGained,

      conversions:
        input.conversions !== undefined
          ? this.nonNegativeNumber(
              input.conversions,
              'conversions',
            )
          : current.conversions,

      revenue:
        input.revenue !== undefined
          ? this.nonNegativeNumber(
              input.revenue,
              'revenue',
            )
          : current.revenue,

      cost:
        input.cost !== undefined
          ? this.nonNegativeNumber(
              input.cost,
              'cost',
            )
          : current.cost,

      metadataScore:
        input.metadataScore !== undefined
          ? this.score(
              input.metadataScore,
              'metadataScore',
            )
          : current.metadataScore,

      titleScore:
        input.titleScore !== undefined
          ? this.score(
              input.titleScore,
              'titleScore',
            )
          : current.titleScore,

      thumbnailScore:
        input.thumbnailScore !== undefined
          ? this.score(
              input.thumbnailScore,
              'thumbnailScore',
            )
          : current.thumbnailScore,

      localizationScore:
        input.localizationScore !== undefined
          ? this.score(
              input.localizationScore,
              'localizationScore',
            )
          : current.localizationScore,

      audienceFitScore:
        input.audienceFitScore !== undefined
          ? this.score(
              input.audienceFitScore,
              'audienceFitScore',
            )
          : current.audienceFitScore,

      distributionScore:
        input.distributionScore !== undefined
          ? this.score(
              input.distributionScore,
              'distributionScore',
            )
          : current.distributionScore,

      growthScore:
        input.growthScore !== undefined
          ? this.score(
              input.growthScore,
              'growthScore',
            )
          : current.growthScore,

      performanceScore:
        input.performanceScore !== undefined
          ? this.score(
              input.performanceScore,
              'performanceScore',
            )
          : current.performanceScore,

      risks:
        input.risks !== undefined
          ? this.normalizeList(
              input.risks,
              false,
            )
          : current.risks,

      issues:
        input.issues !== undefined
          ? this.normalizeList(
              input.issues,
              false,
            )
          : current.issues,

      recommendations:
        input.recommendations !== undefined
          ? this.normalizeList(
              input.recommendations,
              false,
            )
          : current.recommendations,

      experiments:
        input.experiments !== undefined
          ? this.normalizeList(
              input.experiments,
              false,
            )
          : current.experiments,

      metadata:
        input.metadata ?? current.metadata,

      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);

    return updated;
  }

  startPlanning(id: string) {
    return this.updateRecord(id, {
      status: 'planning',
    });
  }

  startOptimization(id: string) {
    return this.updateRecord(id, {
      status: 'optimization',
    });
  }

  startLocalization(id: string) {
    return this.updateRecord(id, {
      status: 'localization',
    });
  }

  scheduleRelease(
    id: string,
    scheduledAt: string,
  ) {
    const normalized = scheduledAt?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Scheduled date is required',
      );
    }

    return this.updateRecord(id, {
      status: 'scheduled',
      scheduledAt: normalized,
    });
  }

  approveByHuman(id: string) {
    return this.updateRecord(id, {
      humanApproved: true,
    });
  }

  rejectByHuman(id: string) {
    return this.updateRecord(id, {
      status: 'rejected',
      humanApproved: false,
    });
  }

  startPublishing(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before publishing',
      );
    }

    return this.updateRecord(id, {
      status: 'publishing',
    });
  }

  markPublished(
    id: string,
    publishedAt?: string,
  ) {
    return this.updateRecord(id, {
      status: 'published',
      publishedAt:
        publishedAt?.trim() ??
        new Date().toISOString(),
    });
  }

  startMonitoring(id: string) {
    return this.updateRecord(id, {
      status: 'monitoring',
    });
  }

  pauseCampaign(id: string) {
    return this.updateRecord(id, {
      status: 'paused',
    });
  }

  completeCampaign(id: string) {
    return this.updateRecord(id, {
      status: 'completed',
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addDistributionChannel(
    id: string,
    input: Partial<DistributionChannel>,
  ) {
    const record = this.getRecord(id);

    const platform =
      input.platform?.trim().toLowerCase();

    if (!platform) {
      throw new BadRequestException(
        'Distribution platform is required',
      );
    }

    const channel = this.normalizeChannel({
      id: input.id ?? randomUUID(),
      platform,
      accountId:
        input.accountId?.trim() ?? '',
      region:
        input.region?.trim().toLowerCase() ??
        'global',
      language:
        input.language?.trim().toLowerCase() ??
        'en',
      status: input.status ?? 'draft',
      scheduledAt:
        input.scheduledAt?.trim() ?? '',
      publishedAt:
        input.publishedAt?.trim() ?? '',
      externalId:
        input.externalId?.trim() ?? '',
      externalUrl:
        input.externalUrl?.trim() ?? '',
    });

    return this.updateRecord(id, {
      distributionChannels: [
        ...record.distributionChannels,
        channel,
      ],
    });
  }

  updateDistributionChannel(
    id: string,
    channelId: string,
    input: Partial<DistributionChannel>,
  ) {
    const record = this.getRecord(id);

    const exists =
      record.distributionChannels.some(
        (channel) => channel.id === channelId,
      );

    if (!exists) {
      throw new NotFoundException(
        `Distribution channel '${channelId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      distributionChannels:
        record.distributionChannels.map(
          (channel) =>
            channel.id === channelId
              ? this.normalizeChannel({
                  ...channel,
                  ...input,
                  id: channel.id,
                })
              : channel,
        ),
    });
  }

  removeDistributionChannel(
    id: string,
    channelId: string,
  ) {
    const record = this.getRecord(id);

    const exists =
      record.distributionChannels.some(
        (channel) => channel.id === channelId,
      );

    if (!exists) {
      throw new NotFoundException(
        `Distribution channel '${channelId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      distributionChannels:
        record.distributionChannels.filter(
          (channel) =>
            channel.id !== channelId,
        ),
    });
  }

  addExperiment(
    id: string,
    experiment: string,
  ) {
    const record = this.getRecord(id);
    const normalized = experiment?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Experiment is required',
      );
    }

    return this.updateRecord(id, {
      experiments: [
        ...record.experiments,
        normalized,
      ],
    });
  }

  updatePerformance(
    id: string,
    metrics: {
      impressions?: number;
      views?: number;
      watchTimeMinutes?: number;
      likes?: number;
      comments?: number;
      shares?: number;
      subscribersGained?: number;
      conversions?: number;
      revenue?: number;
      cost?: number;
    },
  ) {
    return this.updateRecord(id, metrics);
  }

  generateMetadataBlueprint(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      title: record.title,
      description:
        record.descriptionText,
      shortDescription:
        record.shortDescription,
      keywords: record.keywords,
      hashtags: record.hashtags,
      callToAction:
        record.callToAction,
      titleVariants:
        record.titleVariants,
      thumbnailVariants:
        record.thumbnailVariants,
      optimizationChecklist: [
        'clear-value-proposition',
        'strong-opening-keyword',
        'audience-specific-language',
        'platform-length-compliance',
        'search-intent-alignment',
        'click-through-optimization',
        'brand-consistency',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateLocalizationPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      sourceLanguage:
        record.languages[0] ?? 'en',
      targetLanguages:
        record.languages,
      targetRegions: record.regions,
      localizationStages: [
        'translation',
        'cultural-adaptation',
        'title-localization',
        'description-localization',
        'subtitle-generation',
        'voice-localization',
        'thumbnail-localization',
        'human-cultural-review',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateDistributionPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      primaryPlatform:
        record.primaryPlatform,
      platforms: record.platforms,
      regions: record.regions,
      channels:
        record.distributionChannels,
      stages: [
        'platform-packaging',
        'account-selection',
        'release-sequencing',
        'schedule-optimization',
        'cross-platform-publishing',
        'publication-verification',
        'performance-monitoring',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateGrowthPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      audience: record.audiences,
      experiments:
        record.experiments,
      growthLoops: [
        'search-discovery-loop',
        'recommendation-loop',
        'community-engagement-loop',
        'sharing-loop',
        'subscriber-conversion-loop',
        'cross-platform-loop',
        'content-franchise-loop',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  calculatePerformance(id: string) {
    const record = this.getRecord(id);

    const clickThroughRate =
      record.impressions > 0
        ? (record.views / record.impressions) *
          100
        : 0;

    const engagement =
      record.views > 0
        ? ((record.likes +
            record.comments +
            record.shares) /
            record.views) *
          100
        : 0;

    const conversionRate =
      record.views > 0
        ? (record.conversions / record.views) *
          100
        : 0;

    const revenuePerView =
      record.views > 0
        ? record.revenue / record.views
        : 0;

    const returnOnInvestment =
      record.cost > 0
        ? ((record.revenue - record.cost) /
            record.cost) *
          100
        : record.revenue > 0
          ? 100
          : 0;

    return {
      id: record.id,
      impressions: record.impressions,
      views: record.views,
      clickThroughRate: Number(
        clickThroughRate.toFixed(2),
      ),
      engagementRate: Number(
        engagement.toFixed(2),
      ),
      conversionRate: Number(
        conversionRate.toFixed(2),
      ),
      revenuePerView: Number(
        revenuePerView.toFixed(4),
      ),
      returnOnInvestment: Number(
        returnOnInvestment.toFixed(2),
      ),
      calculatedAt: new Date().toISOString(),
    };
  }

  runReleaseReadinessAssessment(id: string) {
    const record = this.getRecord(id);

    const score =
      record.metadataScore * 0.15 +
      record.titleScore * 0.15 +
      record.thumbnailScore * 0.15 +
      record.localizationScore * 0.12 +
      record.audienceFitScore * 0.15 +
      record.distributionScore * 0.15 +
      record.growthScore * 0.13;

    const recommendation =
      score >= 90
        ? 'ready-for-human-approval'
        : score >= 75
          ? 'minor-optimization-required'
          : score >= 60
            ? 'major-optimization-required'
            : 'not-ready-for-release';

    return {
      id: record.id,
      score: Number(score.toFixed(2)),
      recommendation,
      humanApprovalRequired:
        record.humanApprovalRequired,
      assessedAt: new Date().toISOString(),
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

  private normalizeChannel(
    channel: DistributionChannel,
  ): DistributionChannel {
    return {
      id: channel.id?.trim() || randomUUID(),
      platform:
        channel.platform
          ?.trim()
          .toLowerCase() ?? 'unknown',
      accountId:
        channel.accountId?.trim() ?? '',
      region:
        channel.region
          ?.trim()
          .toLowerCase() ?? 'global',
      language:
        channel.language
          ?.trim()
          .toLowerCase() ?? 'en',
      status: channel.status ?? 'draft',
      scheduledAt:
        channel.scheduledAt?.trim() ?? '',
      publishedAt:
        channel.publishedAt?.trim() ?? '',
      externalId:
        channel.externalId?.trim() ?? '',
      externalUrl:
        channel.externalUrl?.trim() ?? '',
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

    return Number(value.toFixed(4));
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
