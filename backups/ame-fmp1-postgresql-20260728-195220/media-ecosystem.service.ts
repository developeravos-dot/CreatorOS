import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateMediaChannelDto,
  CreateMediaChannelLanguagesDto,
  CreateMediaContentIdeaDto,
  CreateMediaProjectDto,
} from './media-ecosystem.dto';

import {
  MediaChannel,
  MediaChannelFamily,
  MediaContentIdea,
  MediaHumanApproval,
  MediaPlatform,
  MediaProject,
} from './media-ecosystem.contracts';

import {
  MediaEcosystemStore,
} from './media-ecosystem.store';

@Injectable()
export class MediaEcosystemService {
  constructor(
    private readonly store: MediaEcosystemStore,
  ) {}

  getStatus() {
    return {
      name:
        'CreatorOS / AVOS Media Ecosystem — Foundation Mega Pack 0',

      version: 'AME-FMP0-1.0.0',

      status: 'operational',

      principles: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
      },

      persistence: {
        mode: 'in-memory',
        databaseReady: false,
      },

      capabilities: {
        mediaCore: true,
        projectManagement: true,
        channelManagement: true,
        multilingualChannelFamilies: true,
        contentIdeaLifecycle: true,
        humanApprovals: true,
        domainEvents: true,

        researchIntelligence: false,
        creativeProductionIntelligence: false,
        brandIntelligence: false,
        publishingIntegrations: false,
        promotionNetwork: false,
        analyticsLearning: false,
        intellectualPropertyLifecycle: false,
      },

      metrics: {
        projects: this.store.projects.size,
        channels: this.store.channels.size,
        channelFamilies:
          this.store.channelFamilies.size,
        ideas: this.store.ideas.size,
        pendingApprovals: [
          ...this.store.approvals.values(),
        ].filter(
          (approval) =>
            approval.status === 'pending',
        ).length,
        events: this.store.events.length,
      },

      generatedAt: this.store.now(),
    };
  }

  createProject(
    dto: CreateMediaProjectDto,
  ): MediaProject {
    this.requireText(
      dto?.name,
      'Project name',
    );

    this.requireText(
      dto?.primaryLanguage,
      'Primary language',
    );

    const now = this.store.now();

    const project: MediaProject = {
      id: this.store.createId('mprj'),

      name: dto.name.trim(),

      description:
        dto.description?.trim(),

      primaryLanguage:
        dto.primaryLanguage
          .trim()
          .toLowerCase(),

      targetMarkets:
        Array.isArray(dto.targetMarkets)
          ? dto.targetMarkets
              .filter(
                (market) =>
                  typeof market === 'string' &&
                  market.trim().length > 0,
              )
              .map(
                (market) =>
                  market.trim(),
              )
          : [],

      status: 'active',

      createdAt: now,

      updatedAt: now,
    };

    this.store.projects.set(
      project.id,
      project,
    );

    this.store.recordEvent(
      'media.project.created',
      'MediaProject',
      project.id,
      {
        name: project.name,
        primaryLanguage:
          project.primaryLanguage,
      },
    );

    return project;
  }

  listProjects(): MediaProject[] {
    return [
      ...this.store.projects.values(),
    ];
  }

  getProject(id: string): MediaProject {
    const project =
      this.store.projects.get(id);

    if (!project) {
      throw new NotFoundException(
        `Media project was not found: ${id}`,
      );
    }

    return project;
  }

  createChannel(
    projectId: string,
    dto: CreateMediaChannelDto,
  ): MediaChannel {
    this.getProject(projectId);

    this.requireText(
      dto?.name,
      'Channel name',
    );

    this.requireText(
      dto?.language,
      'Channel language',
    );

    this.requireText(
      dto?.niche,
      'Channel niche',
    );

    this.requireText(
      dto?.audience,
      'Channel audience',
    );

    this.validatePlatform(
      dto?.platform,
    );

    const now = this.store.now();

    const channelId =
      this.store.createId('chn');

    const familyId =
      this.store.createId('cfam');

    const channel: MediaChannel = {
      id: channelId,

      projectId,

      familyId,

      name: dto.name.trim(),

      platform: dto.platform,

      language:
        dto.language
          .trim()
          .toLowerCase(),

      market:
        dto.market?.trim(),

      niche:
        dto.niche.trim(),

      audience:
        dto.audience.trim(),

      status: 'ready',

      createdAt: now,

      updatedAt: now,
    };

    const family: MediaChannelFamily = {
      id: familyId,

      projectId,

      name:
        dto.familyName?.trim() ||
        `${channel.name} Global Family`,

      rootChannelId:
        channel.id,

      channelIds: [
        channel.id,
      ],

      createdAt: now,

      updatedAt: now,
    };

    this.store.channels.set(
      channel.id,
      channel,
    );

    this.store.channelFamilies.set(
      family.id,
      family,
    );

    this.store.recordEvent(
      'media.channel.created',
      'MediaChannel',
      channel.id,
      {
        projectId,
        familyId,
        platform:
          channel.platform,
        language:
          channel.language,
      },
    );

    return channel;
  }

  listProjectChannels(
    projectId: string,
  ): MediaChannel[] {
    this.getProject(projectId);

    return [
      ...this.store.channels.values(),
    ].filter(
      (channel) =>
        channel.projectId === projectId,
    );
  }

  getChannel(
    id: string,
  ): MediaChannel {
    const channel =
      this.store.channels.get(id);

    if (!channel) {
      throw new NotFoundException(
        `Media channel was not found: ${id}`,
      );
    }

    return channel;
  }

  getChannelFamily(
    channelId: string,
  ) {
    const channel =
      this.getChannel(channelId);

    const family =
      this.store.channelFamilies.get(
        channel.familyId,
      );

    if (!family) {
      throw new NotFoundException(
        `Channel family was not found: ${channel.familyId}`,
      );
    }

    return {
      ...family,

      channels: family.channelIds
        .map(
          (id) =>
            this.store.channels.get(id),
        )
        .filter(
          (
            value,
          ): value is MediaChannel =>
            Boolean(value),
        ),
    };
  }

  addChannelLanguages(
    channelId: string,
    dto: CreateMediaChannelLanguagesDto,
  ): MediaChannel[] {
    const rootChannel =
      this.getChannel(channelId);

    if (
      !dto ||
      !Array.isArray(dto.channels) ||
      dto.channels.length === 0
    ) {
      throw new BadRequestException(
        'At least one localized channel is required.',
      );
    }

    const family =
      this.store.channelFamilies.get(
        rootChannel.familyId,
      );

    if (!family) {
      throw new NotFoundException(
        `Channel family was not found: ${rootChannel.familyId}`,
      );
    }

    const existingLanguages =
      new Set(
        family.channelIds
          .map(
            (id) =>
              this.store.channels.get(id)
                ?.language,
          )
          .filter(
            (
              language,
            ): language is string =>
              Boolean(language),
          ),
      );

    const createdChannels:
      MediaChannel[] = [];

    for (
      const localizedChannel
      of dto.channels
    ) {
      this.requireText(
        localizedChannel?.name,
        'Localized channel name',
      );

      this.requireText(
        localizedChannel?.language,
        'Localized channel language',
      );

      const language =
        localizedChannel.language
          .trim()
          .toLowerCase();

      if (
        existingLanguages.has(language)
      ) {
        throw new BadRequestException(
          `Language already exists in the channel family: ${language}`,
        );
      }

      const now = this.store.now();

      const channel: MediaChannel = {
        id: this.store.createId('chn'),

        projectId:
          rootChannel.projectId,

        familyId:
          family.id,

        parentChannelId:
          rootChannel.id,

        name:
          localizedChannel.name.trim(),

        platform:
          rootChannel.platform,

        language,

        market:
          localizedChannel.market
            ?.trim(),

        niche:
          rootChannel.niche,

        audience:
          rootChannel.audience,

        status: 'planned',

        createdAt: now,

        updatedAt: now,
      };

      this.store.channels.set(
        channel.id,
        channel,
      );

      family.channelIds.push(
        channel.id,
      );

      family.updatedAt = now;

      existingLanguages.add(
        language,
      );

      createdChannels.push(
        channel,
      );

      this.store.recordEvent(
        'media.channel.localized.created',
        'MediaChannel',
        channel.id,
        {
          rootChannelId:
            rootChannel.id,

          familyId:
            family.id,

          language,
        },
      );
    }

    return createdChannels;
  }

  createIdea(
    dto: CreateMediaContentIdeaDto,
  ): MediaContentIdea {
    if (!dto) {
      throw new BadRequestException(
        'Content idea body is required.',
      );
    }

    this.getProject(
      dto.projectId,
    );

    this.requireText(
      dto.title,
      'Idea title',
    );

    this.requireText(
      dto.summary,
      'Idea summary',
    );

    this.requireText(
      dto.contentType,
      'Content type',
    );

    this.requireText(
      dto.targetAudience,
      'Target audience',
    );

    const allowedSources = [
      'original',
      'research-inspired',
      'public-domain',
    ];

    if (
      !allowedSources.includes(
        dto.sourceMode,
      )
    ) {
      throw new BadRequestException(
        'Invalid content source mode.',
      );
    }

    if (
      dto.channelFamilyId &&
      !this.store.channelFamilies.has(
        dto.channelFamilyId,
      )
    ) {
      throw new NotFoundException(
        `Channel family was not found: ${dto.channelFamilyId}`,
      );
    }

    if (
      dto.score !== undefined &&
      (
        typeof dto.score !== 'number' ||
        dto.score < 0 ||
        dto.score > 100
      )
    ) {
      throw new BadRequestException(
        'Idea score must be between 0 and 100.',
      );
    }

    const now = this.store.now();

    const idea: MediaContentIdea = {
      id: this.store.createId('idea'),

      projectId:
        dto.projectId,

      channelFamilyId:
        dto.channelFamilyId,

      title:
        dto.title.trim(),

      summary:
        dto.summary.trim(),

      contentType:
        dto.contentType.trim(),

      targetAudience:
        dto.targetAudience.trim(),

      sourceMode:
        dto.sourceMode,

      status:
        'awaiting_approval',

      score:
        dto.score,

      createdAt: now,

      updatedAt: now,
    };

    this.store.ideas.set(
      idea.id,
      idea,
    );

    this.requestApproval(
      'idea',
      idea.id,
      'approve_content_idea',
      'media-ecosystem',
    );

    this.store.recordEvent(
      'media.idea.created',
      'MediaContentIdea',
      idea.id,
      {
        projectId:
          idea.projectId,

        status:
          idea.status,
      },
    );

    return idea;
  }

  listIdeas(
    projectId?: string,
  ): MediaContentIdea[] {
    const ideas = [
      ...this.store.ideas.values(),
    ];

    if (!projectId) {
      return ideas;
    }

    return ideas.filter(
      (idea) =>
        idea.projectId === projectId,
    );
  }

  approveIdea(
    id: string,
  ): MediaContentIdea {
    const idea =
      this.store.ideas.get(id);

    if (!idea) {
      throw new NotFoundException(
        `Content idea was not found: ${id}`,
      );
    }

    const now = this.store.now();

    idea.status = 'approved';
    idea.updatedAt = now;

    for (
      const approval
      of this.store.approvals.values()
    ) {
      if (
        approval.entityType === 'idea' &&
        approval.entityId === id &&
        approval.status === 'pending'
      ) {
        approval.status = 'approved';
        approval.decidedAt = now;
        approval.updatedAt = now;
      }
    }

    this.store.recordEvent(
      'media.idea.approved',
      'MediaContentIdea',
      idea.id,
    );

    return idea;
  }

  requestApproval(
    entityType:
      MediaHumanApproval['entityType'],
    entityId: string,
    action: string,
    requestedBy: string,
  ): MediaHumanApproval {
    const now = this.store.now();

    const approval:
      MediaHumanApproval = {
      id:
        this.store.createId('apr'),

      entityType,

      entityId,

      action,

      requestedBy,

      status: 'pending',

      createdAt: now,

      updatedAt: now,
    };

    this.store.approvals.set(
      approval.id,
      approval,
    );

    this.store.recordEvent(
      'media.approval.requested',
      'MediaHumanApproval',
      approval.id,
      {
        entityType,
        entityId,
        action,
      },
    );

    return approval;
  }

  listApprovals():
    MediaHumanApproval[] {
    return [
      ...this.store.approvals.values(),
    ];
  }

  decideApproval(
    id: string,
    decision:
      | 'approved'
      | 'rejected',
    notes?: string,
  ): MediaHumanApproval {
    const approval =
      this.store.approvals.get(id);

    if (!approval) {
      throw new NotFoundException(
        `Approval was not found: ${id}`,
      );
    }

    if (
      approval.status !== 'pending'
    ) {
      throw new BadRequestException(
        `Approval was already decided: ${id}`,
      );
    }

    const now = this.store.now();

    approval.status = decision;
    approval.notes = notes?.trim();
    approval.decidedAt = now;
    approval.updatedAt = now;

    if (
      approval.entityType === 'idea'
    ) {
      const idea =
        this.store.ideas.get(
          approval.entityId,
        );

      if (idea) {
        idea.status =
          decision === 'approved'
            ? 'approved'
            : 'draft';

        idea.updatedAt = now;
      }
    }

    this.store.recordEvent(
      `media.approval.${decision}`,
      'MediaHumanApproval',
      approval.id,
      {
        entityType:
          approval.entityType,

        entityId:
          approval.entityId,
      },
    );

    return approval;
  }

  listEvents(
    requestedLimit = 100,
  ) {
    const safeLimit = Math.max(
      1,
      Math.min(
        Number.isFinite(requestedLimit)
          ? requestedLimit
          : 100,
        500,
      ),
    );

    return this.store.events.slice(
      0,
      safeLimit,
    );
  }

  private requireText(
    value: unknown,
    fieldName: string,
  ): asserts value is string {
    if (
      typeof value !== 'string' ||
      value.trim().length === 0
    ) {
      throw new BadRequestException(
        `${fieldName} is required.`,
      );
    }
  }

  private validatePlatform(
    platform: MediaPlatform,
  ): void {
    const allowedPlatforms:
      MediaPlatform[] = [
      'youtube',
      'tiktok',
      'instagram',
      'facebook',
      'other',
    ];

    if (
      !allowedPlatforms.includes(platform)
    ) {
      throw new BadRequestException(
        'Invalid media platform.',
      );
    }
  }
}