import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateMediaAudienceProfileDto,
  CreateMediaCompetitorDto,
  CreateMediaOpportunityDto,
  CreateMediaResearchDto,
  CreateMediaTrendDto,
} from './media-research.dto';

import {
  MediaResearchRepository,
} from './media-research.repository';

@Injectable()
export class MediaResearchService {
  constructor(
    private readonly repository:
      MediaResearchRepository,
  ) {}

  async status() {
    return {
      name:
        'CreatorOS / AVOS Media Research Intelligence — Foundation Mega Pack 2',
      version: 'AME-FMP2-1.0.0',
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
        researchIntelligence: true,
        trendIntelligence: true,
        competitorIntelligence: true,
        audienceIntelligence: true,
        opportunityEngine: true,
        opportunityScoring: true,
        humanApprovals: true,
        domainEvents: true,
        autonomousWebCollection: false,
        semanticSearch: false,
        externalPlatformIntegrations: false,
      },
      metrics:
        await this.repository.metrics(),
      generatedAt: new Date().toISOString(),
    };
  }

  private async requireProject(
    projectId: string,
  ): Promise<void> {
    const exists =
      await this.repository.projectExists(
        projectId,
      );

    if (!exists) {
      throw new NotFoundException(
        `Media project was not found: ${projectId}`,
      );
    }
  }

  private cleanStrings(
    values?: string[],
  ): string[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return [
      ...new Set(
        values
          .filter(
            (value) =>
              typeof value === 'string' &&
              value.trim().length > 0,
          )
          .map((value) => value.trim()),
      ),
    ];
  }

  private validateScore(
    value: number,
    fieldName: string,
  ): void {
    if (
      !Number.isInteger(value) ||
      value < 0 ||
      value > 100
    ) {
      throw new BadRequestException(
        `${fieldName} must be an integer between 0 and 100.`,
      );
    }
  }

  async createResearch(
    dto: CreateMediaResearchDto,
  ) {
    await this.requireProject(dto.projectId);

    const research =
      await this.repository.prisma
        .mediaResearch.create({
          data: {
            id: this.repository.id('rsch'),
            projectId: dto.projectId,
            title: dto.title.trim(),
            summary: dto.summary.trim(),
            researchType: dto.researchType,
            sourceMode: dto.sourceMode,
            sourceUrl:
              dto.sourceUrl?.trim() || null,
            findings:
              this.cleanStrings(dto.findings),
            tags:
              this.cleanStrings(dto.tags),
            confidence:
              dto.confidence ?? null,
            status: 'completed',
          },
        });

    await this.repository.prisma
      .mediaDomainEvent.create({
        data: {
          id: this.repository.id('evt'),
          eventType:
            'media.research.created',
          entityType: 'MediaResearch',
          entityId: research.id,
          payload: {
            projectId: research.projectId,
            researchType:
              research.researchType,
            status: research.status,
          },
        },
      });

    return research;
  }

  async listResearch(
    projectId?: string,
  ) {
    return this.repository.prisma
      .mediaResearch.findMany({
        where: projectId
          ? {
              projectId,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
  }

  async createTrend(
    dto: CreateMediaTrendDto,
  ) {
    await this.requireProject(dto.projectId);

    this.validateScore(
      dto.growthScore,
      'Growth score',
    );

    this.validateScore(
      dto.opportunityScore,
      'Opportunity score',
    );

    this.validateScore(
      dto.competitionScore,
      'Competition score',
    );

    const trend =
      await this.repository.prisma
        .mediaTrend.create({
          data: {
            id: this.repository.id('trnd'),
            projectId: dto.projectId,
            name: dto.name.trim(),
            description:
              dto.description?.trim() || null,
            platform: dto.platform,
            market:
              dto.market?.trim() || null,
            language:
              dto.language
                ?.trim()
                .toLowerCase() || null,
            growthScore: dto.growthScore,
            opportunityScore:
              dto.opportunityScore,
            competitionScore:
              dto.competitionScore,
            status: 'detected',
          },
        });

    await this.repository.prisma
      .mediaDomainEvent.create({
        data: {
          id: this.repository.id('evt'),
          eventType:
            'media.trend.detected',
          entityType: 'MediaTrend',
          entityId: trend.id,
          payload: {
            projectId: trend.projectId,
            platform: trend.platform,
            opportunityScore:
              trend.opportunityScore,
          },
        },
      });

    return trend;
  }

  async listTrends(
    projectId?: string,
  ) {
    return this.repository.prisma
      .mediaTrend.findMany({
        where: projectId
          ? {
              projectId,
            }
          : undefined,
        orderBy: [
          {
            opportunityScore: 'desc',
          },
          {
            detectedAt: 'desc',
          },
        ],
      });
  }

  async createCompetitor(
    dto: CreateMediaCompetitorDto,
  ) {
    await this.requireProject(dto.projectId);

    const competitor =
      await this.repository.prisma
        .mediaCompetitor.create({
          data: {
            id: this.repository.id('comp'),
            projectId: dto.projectId,
            name: dto.name.trim(),
            platform: dto.platform,
            channelUrl:
              dto.channelUrl?.trim() || null,
            market:
              dto.market?.trim() || null,
            language:
              dto.language
                ?.trim()
                .toLowerCase() || null,
            niche:
              dto.niche?.trim() || null,
            strengths:
              this.cleanStrings(dto.strengths),
            weaknesses:
              this.cleanStrings(dto.weaknesses),
            publishingNotes:
              dto.publishingNotes?.trim() ||
              null,
            status: 'active',
          },
        });

    await this.repository.prisma
      .mediaDomainEvent.create({
        data: {
          id: this.repository.id('evt'),
          eventType:
            'media.competitor.created',
          entityType:
            'MediaCompetitor',
          entityId: competitor.id,
          payload: {
            projectId:
              competitor.projectId,
            platform:
              competitor.platform,
          },
        },
      });

    return competitor;
  }

  async listCompetitors(
    projectId?: string,
  ) {
    return this.repository.prisma
      .mediaCompetitor.findMany({
        where: projectId
          ? {
              projectId,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
  }

  async createAudience(
    dto: CreateMediaAudienceProfileDto,
  ) {
    await this.requireProject(dto.projectId);

    const audience =
      await this.repository.prisma
        .mediaAudienceProfile.create({
          data: {
            id: this.repository.id('aud'),
            projectId: dto.projectId,
            name: dto.name.trim(),
            description:
              dto.description?.trim() || null,
            market:
              dto.market?.trim() || null,
            language:
              dto.language
                ?.trim()
                .toLowerCase() || null,
            ageRange:
              dto.ageRange?.trim() || null,
            interests:
              this.cleanStrings(dto.interests),
            painPoints:
              this.cleanStrings(dto.painPoints),
            searchIntents:
              this.cleanStrings(
                dto.searchIntents,
              ),
            status: 'active',
          },
        });

    await this.repository.prisma
      .mediaDomainEvent.create({
        data: {
          id: this.repository.id('evt'),
          eventType:
            'media.audience.created',
          entityType:
            'MediaAudienceProfile',
          entityId: audience.id,
          payload: {
            projectId: audience.projectId,
            market: audience.market,
            language: audience.language,
          },
        },
      });

    return audience;
  }

  async listAudiences(
    projectId?: string,
  ) {
    return this.repository.prisma
      .mediaAudienceProfile.findMany({
        where: projectId
          ? {
              projectId,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
  }

  async createOpportunity(
    dto: CreateMediaOpportunityDto,
  ) {
    await this.requireProject(dto.projectId);

    this.validateScore(
      dto.demandScore,
      'Demand score',
    );

    this.validateScore(
      dto.competitionScore,
      'Competition score',
    );

    this.validateScore(
      dto.executionScore,
      'Execution score',
    );

    this.validateScore(
      dto.revenueScore,
      'Revenue score',
    );

    const adjustedCompetition =
      100 - dto.competitionScore;

    const totalScore = Math.round(
      dto.demandScore * 0.35 +
        adjustedCompetition * 0.2 +
        dto.executionScore * 0.2 +
        dto.revenueScore * 0.25,
    );

    return this.repository.prisma
      .$transaction(async (tx) => {
        const opportunity =
          await tx.mediaOpportunity.create({
            data: {
              id: this.repository.id('opp'),
              projectId: dto.projectId,
              title: dto.title.trim(),
              summary: dto.summary.trim(),
              opportunityType:
                dto.opportunityType,
              market:
                dto.market?.trim() || null,
              platform:
                dto.platform?.trim() || null,
              demandScore:
                dto.demandScore,
              competitionScore:
                dto.competitionScore,
              executionScore:
                dto.executionScore,
              revenueScore:
                dto.revenueScore,
              totalScore,
              rationale:
                dto.rationale?.trim() ||
                null,
              status:
                'awaiting_approval',
            },
          });

        const approval =
          await tx.mediaHumanApproval
            .create({
              data: {
                id: this.repository.id(
                  'apr',
                ),
                entityType:
                  'media_opportunity',
                entityId:
                  opportunity.id,
                action:
                  'approve_media_opportunity',
                requestedBy:
                  'media-research-intelligence',
                status: 'pending',
              },
            });

        await tx.mediaDomainEvent
          .createMany({
            data: [
              {
                id: this.repository.id(
                  'evt',
                ),
                eventType:
                  'media.opportunity.discovered',
                entityType:
                  'MediaOpportunity',
                entityId:
                  opportunity.id,
                payload: {
                  projectId:
                    opportunity.projectId,
                  totalScore:
                    opportunity.totalScore,
                  status:
                    opportunity.status,
                },
              },
              {
                id: this.repository.id(
                  'evt',
                ),
                eventType:
                  'media.approval.requested',
                entityType:
                  'MediaHumanApproval',
                entityId: approval.id,
                payload: {
                  entityType:
                    'media_opportunity',
                  entityId:
                    opportunity.id,
                  action:
                    'approve_media_opportunity',
                },
              },
            ],
          });

        return opportunity;
      });
  }

  async listOpportunities(
    projectId?: string,
  ) {
    return this.repository.prisma
      .mediaOpportunity.findMany({
        where: projectId
          ? {
              projectId,
            }
          : undefined,
        orderBy: [
          {
            totalScore: 'desc',
          },
          {
            createdAt: 'desc',
          },
        ],
      });
  }

  async approveOpportunity(
    id: string,
  ) {
    const opportunity =
      await this.repository.prisma
        .mediaOpportunity.findUnique({
          where: {
            id,
          },
        });

    if (!opportunity) {
      throw new NotFoundException(
        `Media opportunity was not found: ${id}`,
      );
    }

    if (
      opportunity.status === 'approved'
    ) {
      throw new BadRequestException(
        `Media opportunity is already approved: ${id}`,
      );
    }

    return this.repository.prisma
      .$transaction(async (tx) => {
        const updated =
          await tx.mediaOpportunity.update({
            where: {
              id,
            },
            data: {
              status: 'approved',
            },
          });

        await tx.mediaHumanApproval
          .updateMany({
            where: {
              entityType:
                'media_opportunity',
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
            eventType:
              'media.opportunity.approved',
            entityType:
              'MediaOpportunity',
            entityId: id,
            payload: {
              projectId:
                opportunity.projectId,
              totalScore:
                opportunity.totalScore,
            },
          },
        });

        return updated;
      });
  }
}
