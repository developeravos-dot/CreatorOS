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
  MediaEcosystemRepository,
} from './media-ecosystem.repository';

@Injectable()
export class MediaEcosystemService {
  constructor(
    private readonly repository:
      MediaEcosystemRepository,
  ) {}

  async getStatus() {
    const metrics =
      await this.repository.counts();

    return {
      name:
        'CreatorOS / AVOS Media Ecosystem — Foundation Mega Pack 1',
      version: 'AME-FMP1-1.0.0',
      status: 'operational',

      principles: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
      },

      persistence: {
        mode: 'postgresql',
        databaseReady: true,
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

      metrics,
      generatedAt: new Date(),
    };
  }

  async createProject(
    dto: CreateMediaProjectDto,
  ) {
    this.requireText(dto?.name, 'Project name');
    this.requireText(
      dto?.primaryLanguage,
      'Primary language',
    );

    const project =
      await this.repository.prisma.mediaProject.create({
        data: {
          id: this.repository.id('mprj'),
          name: dto.name.trim(),
          description:
            dto.description?.trim() || null,
          primaryLanguage:
            dto.primaryLanguage
              .trim()
              .toLowerCase(),
          targetMarkets:
            this.cleanStrings(dto.targetMarkets),
          status: 'active',
        },
      });

    await this.repository.recordEvent(
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

  async listProjects() {
    return this.repository.prisma.mediaProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProject(id: string) {
    const project =
      await this.repository.prisma.mediaProject.findUnique({
        where: { id },
      });

    if (!project) {
      throw new NotFoundException(
        `Media project was not found: ${id}`,
      );
    }

    return project;
  }

  async createChannel(
    projectId: string,
    dto: CreateMediaChannelDto,
  ) {
    await this.getProject(projectId);

    this.requireText(dto?.name, 'Channel name');
    this.requireText(dto?.language, 'Channel language');
    this.requireText(dto?.niche, 'Channel niche');
    this.requireText(dto?.audience, 'Channel audience');
    this.validatePlatform(dto?.platform);

    const channelId = this.repository.id('chn');
    const familyId = this.repository.id('cfam');
    const language =
      dto.language.trim().toLowerCase();

    const result =
      await this.repository.prisma.$transaction(
        async (tx) => {
          const channel =
            await tx.mediaChannel.create({
              data: {
                id: channelId,
                projectId,
                familyId,
                name: dto.name.trim(),
                platform: dto.platform,
                language,
                market:
                  dto.market?.trim() || null,
                niche: dto.niche.trim(),
                audience: dto.audience.trim(),
                status: 'ready',
              },
            });

          await tx.mediaChannelFamily.create({
            data: {
              id: familyId,
              projectId,
              name:
                dto.familyName?.trim() ||
                `${channel.name} Global Family`,
              rootChannelId: channel.id,
              channelIds: [channel.id],
            },
          });

          await tx.mediaDomainEvent.create({
            data: {
              id: this.repository.id('evt'),
              eventType: 'media.channel.created',
              entityType: 'MediaChannel',
              entityId: channel.id,
              payload: {
                projectId,
                familyId,
                platform: channel.platform,
                language: channel.language,
              },
            },
          });

          return channel;
        },
      );

    return result;
  }

  async listProjectChannels(
    projectId: string,
  ) {
    await this.getProject(projectId);

    return this.repository.prisma.mediaChannel.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getChannel(id: string) {
    const channel =
      await this.repository.prisma.mediaChannel.findUnique({
        where: { id },
      });

    if (!channel) {
      throw new NotFoundException(
        `Media channel was not found: ${id}`,
      );
    }

    return channel;
  }

  async getChannelFamily(
    channelId: string,
  ) {
    const channel =
      await this.getChannel(channelId);

    const family =
      await this.repository.prisma
        .mediaChannelFamily.findUnique({
          where: { id: channel.familyId },
        });

    if (!family) {
      throw new NotFoundException(
        `Channel family was not found: ${channel.familyId}`,
      );
    }

    const channels =
      await this.repository.prisma.mediaChannel.findMany({
        where: {
          id: { in: family.channelIds },
        },
        orderBy: { createdAt: 'asc' },
      });

    return {
      ...family,
      channels,
    };
  }

  async addChannelLanguages(
    channelId: string,
    dto: CreateMediaChannelLanguagesDto,
  ) {
    const rootChannel =
      await this.getChannel(channelId);

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
      await this.repository.prisma
        .mediaChannelFamily.findUnique({
          where: { id: rootChannel.familyId },
        });

    if (!family) {
      throw new NotFoundException(
        `Channel family was not found: ${rootChannel.familyId}`,
      );
    }

    const existing =
      await this.repository.prisma.mediaChannel.findMany({
        where: { familyId: family.id },
        select: { language: true },
      });

    const languages =
      new Set(existing.map((item) => item.language));

    const normalized = dto.channels.map((item) => {
      this.requireText(
        item?.name,
        'Localized channel name',
      );
      this.requireText(
        item?.language,
        'Localized channel language',
      );

      const language =
        item.language.trim().toLowerCase();

      if (languages.has(language)) {
        throw new BadRequestException(
          `Language already exists in the channel family: ${language}`,
        );
      }

      languages.add(language);

      return {
        item,
        language,
        id: this.repository.id('chn'),
      };
    });

    return this.repository.prisma.$transaction(
      async (tx) => {
        const created = [];

        for (const entry of normalized) {
          const channel =
            await tx.mediaChannel.create({
              data: {
                id: entry.id,
                projectId: rootChannel.projectId,
                familyId: family.id,
                parentChannelId: rootChannel.id,
                name: entry.item.name.trim(),
                platform: rootChannel.platform,
                language: entry.language,
                market:
                  entry.item.market?.trim() || null,
                niche: rootChannel.niche,
                audience: rootChannel.audience,
                status: 'planned',
              },
            });

          created.push(channel);

          await tx.mediaDomainEvent.create({
            data: {
              id: this.repository.id('evt'),
              eventType:
                'media.channel.localized.created',
              entityType: 'MediaChannel',
              entityId: channel.id,
              payload: {
                rootChannelId: rootChannel.id,
                familyId: family.id,
                language: entry.language,
              },
            },
          });
        }

        await tx.mediaChannelFamily.update({
          where: { id: family.id },
          data: {
            channelIds: {
              push: created.map((item) => item.id),
            },
          },
        });

        return created;
      },
    );
  }

  async createIdea(
    dto: CreateMediaContentIdeaDto,
  ) {
    if (!dto) {
      throw new BadRequestException(
        'Content idea body is required.',
      );
    }

    await this.getProject(dto.projectId);

    this.requireText(dto.title, 'Idea title');
    this.requireText(dto.summary, 'Idea summary');
    this.requireText(dto.contentType, 'Content type');
    this.requireText(
      dto.targetAudience,
      'Target audience',
    );

    const allowedSources = [
      'original',
      'research-inspired',
      'public-domain',
    ];

    if (!allowedSources.includes(dto.sourceMode)) {
      throw new BadRequestException(
        'Invalid content source mode.',
      );
    }

    if (dto.channelFamilyId) {
      const family =
        await this.repository.prisma
          .mediaChannelFamily.findUnique({
            where: {
              id: dto.channelFamilyId,
            },
          });

      if (!family) {
        throw new NotFoundException(
          `Channel family was not found: ${dto.channelFamilyId}`,
        );
      }
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

    return this.repository.prisma.$transaction(
      async (tx) => {
        const idea =
          await tx.mediaContentIdea.create({
            data: {
              id: this.repository.id('idea'),
              projectId: dto.projectId,
              channelFamilyId:
                dto.channelFamilyId || null,
              title: dto.title.trim(),
              summary: dto.summary.trim(),
              contentType:
                dto.contentType.trim(),
              targetAudience:
                dto.targetAudience.trim(),
              sourceMode: dto.sourceMode,
              status: 'awaiting_approval',
              score: dto.score ?? null,
            },
          });

        const approval =
          await tx.mediaHumanApproval.create({
            data: {
              id: this.repository.id('apr'),
              entityType: 'idea',
              entityId: idea.id,
              action: 'approve_content_idea',
              requestedBy: 'media-ecosystem',
              status: 'pending',
            },
          });

        await tx.mediaDomainEvent.createMany({
          data: [
            {
              id: this.repository.id('evt'),
              eventType: 'media.idea.created',
              entityType: 'MediaContentIdea',
              entityId: idea.id,
              payload: {
                projectId: idea.projectId,
                status: idea.status,
              },
            },
            {
              id: this.repository.id('evt'),
              eventType:
                'media.approval.requested',
              entityType:
                'MediaHumanApproval',
              entityId: approval.id,
              payload: {
                entityType: 'idea',
                entityId: idea.id,
                action:
                  'approve_content_idea',
              },
            },
          ],
        });

        return idea;
      },
    );
  }

  async listIdeas(projectId?: string) {
    return this.repository.prisma.mediaContentIdea.findMany({
      where: projectId
        ? { projectId }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveIdea(id: string) {
    const idea =
      await this.repository.prisma.mediaContentIdea.findUnique({
        where: { id },
      });

    if (!idea) {
      throw new NotFoundException(
        `Content idea was not found: ${id}`,
      );
    }

    return this.repository.prisma.$transaction(
      async (tx) => {
        const updated =
          await tx.mediaContentIdea.update({
            where: { id },
            data: { status: 'approved' },
          });

        await tx.mediaHumanApproval.updateMany({
          where: {
            entityType: 'idea',
            entityId: id,
            status: 'pending',
          },
          data: {
            status: 'approved',
            decidedAt: new Date(),
          },
        });

        await tx.mediaDomainEvent.create({
          data: {
            id: this.repository.id('evt'),
            eventType: 'media.idea.approved',
            entityType: 'MediaContentIdea',
            entityId: id,
          },
        });

        return updated;
      },
    );
  }

  async requestApproval(
    entityType: string,
    entityId: string,
    action: string,
    requestedBy: string,
  ) {
    const approval =
      await this.repository.prisma.mediaHumanApproval.create({
        data: {
          id: this.repository.id('apr'),
          entityType,
          entityId,
          action,
          requestedBy,
          status: 'pending',
        },
      });

    await this.repository.recordEvent(
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

  async listApprovals() {
    return this.repository.prisma.mediaHumanApproval.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async decideApproval(
    id: string,
    decision: 'approved' | 'rejected',
    notes?: string,
  ) {
    const approval =
      await this.repository.prisma
        .mediaHumanApproval.findUnique({
          where: { id },
        });

    if (!approval) {
      throw new NotFoundException(
        `Approval was not found: ${id}`,
      );
    }

    if (approval.status !== 'pending') {
      throw new BadRequestException(
        `Approval was already decided: ${id}`,
      );
    }

    return this.repository.prisma.$transaction(
      async (tx) => {
        const updated =
          await tx.mediaHumanApproval.update({
            where: { id },
            data: {
              status: decision,
              notes: notes?.trim() || null,
              decidedAt: new Date(),
            },
          });

        if (approval.entityType === 'idea') {
          await tx.mediaContentIdea.updateMany({
            where: {
              id: approval.entityId,
            },
            data: {
              status:
                decision === 'approved'
                  ? 'approved'
                  : 'draft',
            },
          });
        }

        await tx.mediaDomainEvent.create({
          data: {
            id: this.repository.id('evt'),
            eventType:
              `media.approval.${decision}`,
            entityType:
              'MediaHumanApproval',
            entityId: id,
            payload: {
              entityType:
                approval.entityType,
              entityId:
                approval.entityId,
            },
          },
        });

        return updated;
      },
    );
  }

  async listEvents(
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

    return this.repository.prisma.mediaDomainEvent.findMany({
      orderBy: { occurredAt: 'desc' },
      take: safeLimit,
    });
  }

  private cleanStrings(
    values?: string[],
  ): string[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return values
      .filter(
        (value) =>
          typeof value === 'string' &&
          value.trim().length > 0,
      )
      .map((value) => value.trim());
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
    platform: unknown,
  ): asserts platform is
    | 'youtube'
    | 'tiktok'
    | 'instagram'
    | 'facebook'
    | 'other' {
    const allowedPlatforms = [
      'youtube',
      'tiktok',
      'instagram',
      'facebook',
      'other',
    ];

    if (
      typeof platform !== 'string' ||
      !allowedPlatforms.includes(platform)
    ) {
      throw new BadRequestException(
        'Invalid media platform.',
      );
    }
  }
}
