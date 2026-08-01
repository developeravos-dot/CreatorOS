import { Injectable } from '@nestjs/common';

import {
  PrismaService,
} from '../../modules/persistence/prisma.service';

@Injectable()
export class MediaResearchRepository {
  constructor(
    public readonly prisma: PrismaService,
  ) {}

  id(prefix: string): string {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  async projectExists(projectId: string): Promise<boolean> {
    const count =
      await this.prisma.mediaProject.count({
        where: {
          id: projectId,
        },
      });

    return count > 0;
  }

  async metrics() {
    const [
      research,
      trends,
      competitors,
      audiences,
      opportunities,
      pendingOpportunities,
    ] = await Promise.all([
      this.prisma.mediaResearch.count(),
      this.prisma.mediaTrend.count(),
      this.prisma.mediaCompetitor.count(),
      this.prisma.mediaAudienceProfile.count(),
      this.prisma.mediaOpportunity.count(),
      this.prisma.mediaOpportunity.count({
        where: {
          status: 'awaiting_approval',
        },
      }),
    ]);

    return {
      research,
      trends,
      competitors,
      audiences,
      opportunities,
      pendingOpportunities,
    };
  }
}
