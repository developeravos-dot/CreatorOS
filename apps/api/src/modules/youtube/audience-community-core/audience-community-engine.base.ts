import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type AudienceStatus =
  | 'new'
  | 'observing'
  | 'engaged'
  | 'loyal'
  | 'inactive'
  | 'blocked';

export type AudiencePriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type SentimentType =
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'mixed';

export type AudienceSegment =
  | 'viewer'
  | 'subscriber'
  | 'member'
  | 'advocate'
  | 'creator'
  | 'brand'
  | 'other';

export interface AudienceRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  segment: AudienceSegment;
  status: AudienceStatus;
  priority: AudiencePriority;
  sentiment: SentimentType;
  engagementScore: number;
  loyaltyScore: number;
  growthScore: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  subscribers: number;
  language: string;
  country?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAudienceRecordInput {
  name: string;
  description?: string;
  category: string;
  segment?: AudienceSegment;
  status?: AudienceStatus;
  priority?: AudiencePriority;
  sentiment?: SentimentType;
  engagementScore?: number;
  loyaltyScore?: number;
  growthScore?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  subscribers?: number;
  language?: string;
  country?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateAudienceRecordInput {
  name?: string;
  description?: string;
  category?: string;
  segment?: AudienceSegment;
  status?: AudienceStatus;
  priority?: AudiencePriority;
  sentiment?: SentimentType;
  engagementScore?: number;
  loyaltyScore?: number;
  growthScore?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  subscribers?: number;
  language?: string;
  country?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface AudienceDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalRecords: number;
  engagedRecords: number;
  loyalRecords: number;
  inactiveRecords: number;
  criticalRecords: number;
  positiveRecords: number;
  negativeRecords: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSubscribers: number;
  averageEngagementScore: number;
  averageLoyaltyScore: number;
  averageGrowthScore: number;
  engagementRate: number;
  updatedAt: string;
}

export abstract class AudienceCommunityEngineBase {
  private readonly records =
    new Map<string, AudienceRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard(): AudienceDashboard {
    const records = [...this.records.values()];

    const totalViews = records.reduce(
      (total, record) => total + record.views,
      0,
    );

    const totalLikes = records.reduce(
      (total, record) => total + record.likes,
      0,
    );

    const totalComments = records.reduce(
      (total, record) => total + record.comments,
      0,
    );

    const totalShares = records.reduce(
      (total, record) => total + record.shares,
      0,
    );

    const totalSubscribers = records.reduce(
      (total, record) =>
        total + record.subscribers,
      0,
    );

    const totalInteractions =
      totalLikes + totalComments + totalShares;

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalRecords: records.length,
      engagedRecords: records.filter(
        (record) => record.status === 'engaged',
      ).length,
      loyalRecords: records.filter(
        (record) => record.status === 'loyal',
      ).length,
      inactiveRecords: records.filter(
        (record) => record.status === 'inactive',
      ).length,
      criticalRecords: records.filter(
        (record) =>
          record.priority === 'critical',
      ).length,
      positiveRecords: records.filter(
        (record) =>
          record.sentiment === 'positive',
      ).length,
      negativeRecords: records.filter(
        (record) =>
          record.sentiment === 'negative',
      ).length,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalSubscribers,
      averageEngagementScore:
        this.calculateAverage(
          records.map(
            (record) => record.engagementScore,
          ),
        ),
      averageLoyaltyScore:
        this.calculateAverage(
          records.map(
            (record) => record.loyaltyScore,
          ),
        ),
      averageGrowthScore:
        this.calculateAverage(
          records.map(
            (record) => record.growthScore,
          ),
        ),
      engagementRate:
        totalViews <= 0
          ? 0
          : Number(
              (
                (totalInteractions / totalViews) *
                100
              ).toFixed(2),
            ),
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateAudienceRecordInput,
  ): AudienceRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();

    if (!name) {
      throw new BadRequestException(
        'Audience record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Audience category is required',
      );
    }

    const now = new Date().toISOString();

    const record: AudienceRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      segment: input.segment ?? 'viewer',
      status: input.status ?? 'new',
      priority: input.priority ?? 'medium',
      sentiment: input.sentiment ?? 'neutral',
      engagementScore:
        this.normalizePercentage(
          input.engagementScore ?? 0,
          'engagementScore',
        ),
      loyaltyScore:
        this.normalizePercentage(
          input.loyaltyScore ?? 0,
          'loyaltyScore',
        ),
      growthScore:
        this.normalizePercentage(
          input.growthScore ?? 0,
          'growthScore',
        ),
      views: this.normalizeCount(
        input.views ?? 0,
        'views',
      ),
      likes: this.normalizeCount(
        input.likes ?? 0,
        'likes',
      ),
      comments: this.normalizeCount(
        input.comments ?? 0,
        'comments',
      ),
      shares: this.normalizeCount(
        input.shares ?? 0,
        'shares',
      ),
      subscribers: this.normalizeCount(
        input.subscribers ?? 0,
        'subscribers',
      ),
      language:
        input.language?.trim().toLowerCase() ??
        'en',
      country: input.country?.trim().toUpperCase(),
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: AudienceStatus;
    priority?: AudiencePriority;
    sentiment?: SentimentType;
    segment?: AudienceSegment;
    category?: string;
    language?: string;
    country?: string;
    search?: string;
    minimumEngagementScore?: number;
  }): AudienceRecord[] {
    const search = filters?.search
      ?.trim()
      .toLowerCase();

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
          filters?.sentiment &&
          record.sentiment !== filters.sentiment
        ) {
          return false;
        }

        if (
          filters?.segment &&
          record.segment !== filters.segment
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
          filters?.language &&
          record.language !==
            filters.language.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.country &&
          record.country !==
            filters.country.toUpperCase()
        ) {
          return false;
        }

        if (
          filters?.minimumEngagementScore !==
            undefined &&
          record.engagementScore <
            filters.minimumEngagementScore
        ) {
          return false;
        }

        if (search) {
          const searchableText = [
            record.name,
            record.description ?? '',
            record.category,
            record.segment,
            record.language,
            record.country ?? '',
            ...record.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort((first, second) => {
        if (
          second.engagementScore !==
          first.engagementScore
        ) {
          return (
            second.engagementScore -
            first.engagementScore
          );
        }

        return (
          second.loyaltyScore -
          first.loyaltyScore
        );
      });
  }

  getRecord(id: string): AudienceRecord {
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
    input: UpdateAudienceRecordInput,
  ): AudienceRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Audience name cannot be empty',
      );
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new BadRequestException(
        'Audience category cannot be empty',
      );
    }

    const updated: AudienceRecord = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ??
        current.description,
      category:
        input.category?.trim() ?? current.category,
      engagementScore:
        input.engagementScore !== undefined
          ? this.normalizePercentage(
              input.engagementScore,
              'engagementScore',
            )
          : current.engagementScore,
      loyaltyScore:
        input.loyaltyScore !== undefined
          ? this.normalizePercentage(
              input.loyaltyScore,
              'loyaltyScore',
            )
          : current.loyaltyScore,
      growthScore:
        input.growthScore !== undefined
          ? this.normalizePercentage(
              input.growthScore,
              'growthScore',
            )
          : current.growthScore,
      views:
        input.views !== undefined
          ? this.normalizeCount(
              input.views,
              'views',
            )
          : current.views,
      likes:
        input.likes !== undefined
          ? this.normalizeCount(
              input.likes,
              'likes',
            )
          : current.likes,
      comments:
        input.comments !== undefined
          ? this.normalizeCount(
              input.comments,
              'comments',
            )
          : current.comments,
      shares:
        input.shares !== undefined
          ? this.normalizeCount(
              input.shares,
              'shares',
            )
          : current.shares,
      subscribers:
        input.subscribers !== undefined
          ? this.normalizeCount(
              input.subscribers,
              'subscribers',
            )
          : current.subscribers,
      language:
        input.language?.trim().toLowerCase() ??
        current.language,
      country:
        input.country?.trim().toUpperCase() ??
        current.country,
      tags:
        input.tags !== undefined
          ? this.normalizeTags(input.tags)
          : current.tags,
      metadata:
        input.metadata ?? current.metadata,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);

    return updated;
  }

  observeRecord(id: string): AudienceRecord {
    return this.updateRecord(id, {
      status: 'observing',
    });
  }

  markEngaged(id: string): AudienceRecord {
    return this.updateRecord(id, {
      status: 'engaged',
      engagementScore: Math.max(
        50,
        this.getRecord(id).engagementScore,
      ),
    });
  }

  markLoyal(id: string): AudienceRecord {
    return this.updateRecord(id, {
      status: 'loyal',
      loyaltyScore: Math.max(
        70,
        this.getRecord(id).loyaltyScore,
      ),
    });
  }

  markInactive(id: string): AudienceRecord {
    return this.updateRecord(id, {
      status: 'inactive',
    });
  }

  blockRecord(id: string): AudienceRecord {
    return this.updateRecord(id, {
      status: 'blocked',
    });
  }

  updateSentiment(
    id: string,
    sentiment: SentimentType,
  ): AudienceRecord {
    return this.updateRecord(id, {
      sentiment,
    });
  }

  addInteraction(
    id: string,
    input: {
      views?: number;
      likes?: number;
      comments?: number;
      shares?: number;
      subscribers?: number;
    },
  ): AudienceRecord {
    const record = this.getRecord(id);

    return this.updateRecord(id, {
      views:
        record.views +
        this.normalizeCount(
          input.views ?? 0,
          'views',
        ),
      likes:
        record.likes +
        this.normalizeCount(
          input.likes ?? 0,
          'likes',
        ),
      comments:
        record.comments +
        this.normalizeCount(
          input.comments ?? 0,
          'comments',
        ),
      shares:
        record.shares +
        this.normalizeCount(
          input.shares ?? 0,
          'shares',
        ),
      subscribers:
        record.subscribers +
        this.normalizeCount(
          input.subscribers ?? 0,
          'subscribers',
        ),
    });
  }

  getEngagementSummary(id: string) {
    const record = this.getRecord(id);

    const totalInteractions =
      record.likes +
      record.comments +
      record.shares;

    const engagementRate =
      record.views <= 0
        ? 0
        : (totalInteractions / record.views) * 100;

    const subscriberConversionRate =
      record.views <= 0
        ? 0
        : (record.subscribers / record.views) * 100;

    return {
      id: record.id,
      views: record.views,
      likes: record.likes,
      comments: record.comments,
      shares: record.shares,
      subscribers: record.subscribers,
      totalInteractions,
      engagementRate: Number(
        engagementRate.toFixed(2),
      ),
      subscriberConversionRate: Number(
        subscriberConversionRate.toFixed(2),
      ),
      engagementScore: record.engagementScore,
      loyaltyScore: record.loyaltyScore,
      growthScore: record.growthScore,
    };
  }

  analyzeComment(
    comment: string,
  ) {
    const normalizedComment = comment
      ?.trim()
      .toLowerCase();

    if (!normalizedComment) {
      throw new BadRequestException(
        'Comment is required',
      );
    }

    const positiveWords = [
      'great',
      'excellent',
      'love',
      'amazing',
      'ممتاز',
      'رائع',
      'احب',
      'جميل',
    ];

    const negativeWords = [
      'bad',
      'poor',
      'hate',
      'terrible',
      'سيء',
      'ضعيف',
      'اكره',
      'مزعج',
    ];

    const positiveMatches =
      positiveWords.filter((word) =>
        normalizedComment.includes(word),
      ).length;

    const negativeMatches =
      negativeWords.filter((word) =>
        normalizedComment.includes(word),
      ).length;

    let sentiment: SentimentType = 'neutral';

    if (
      positiveMatches > 0 &&
      negativeMatches > 0
    ) {
      sentiment = 'mixed';
    } else if (
      positiveMatches > negativeMatches
    ) {
      sentiment = 'positive';
    } else if (
      negativeMatches > positiveMatches
    ) {
      sentiment = 'negative';
    }

    return {
      comment: comment.trim(),
      sentiment,
      positiveMatches,
      negativeMatches,
      requiresResponse:
        sentiment === 'negative' ||
        comment.includes('?') ||
        comment.includes('؟'),
      analyzedAt: new Date().toISOString(),
    };
  }

  forecastSubscriberGrowth(
    currentSubscribers: number,
    monthlyGrowthRate: number,
    months: number,
  ) {
    const subscribers =
      this.normalizeCount(
        currentSubscribers,
        'currentSubscribers',
      );

    if (!Number.isFinite(monthlyGrowthRate)) {
      throw new BadRequestException(
        'monthlyGrowthRate must be a valid number',
      );
    }

    if (
      !Number.isInteger(months) ||
      months < 1 ||
      months > 60
    ) {
      throw new BadRequestException(
        'months must be between 1 and 60',
      );
    }

    const forecast: Array<{
      month: number;
      subscribers: number;
    }> = [];

    let projectedSubscribers = subscribers;

    for (let month = 1; month <= months; month += 1) {
      projectedSubscribers *=
        1 + monthlyGrowthRate / 100;

      forecast.push({
        month,
        subscribers: Math.round(
          projectedSubscribers,
        ),
      });
    }

    return {
      currentSubscribers: subscribers,
      monthlyGrowthRate,
      months,
      forecast,
      finalSubscribers:
        forecast[forecast.length - 1]
          ?.subscribers ?? subscribers,
      generatedAt: new Date().toISOString(),
    };
  }

  generateRecommendations(
    id: string,
  ): string[] {
    const record = this.getRecord(id);
    const summary = this.getEngagementSummary(id);
    const recommendations: string[] = [];

    if (summary.engagementRate < 3) {
      recommendations.push(
        'Improve calls to action and audience interaction',
      );
    }

    if (record.sentiment === 'negative') {
      recommendations.push(
        'Review negative audience feedback',
      );
    }

    if (record.loyaltyScore < 40) {
      recommendations.push(
        'Create recurring community experiences',
      );
    }

    if (
      summary.subscriberConversionRate < 1
    ) {
      recommendations.push(
        'Improve viewer-to-subscriber conversion',
      );
    }

    if (record.status === 'inactive') {
      recommendations.push(
        'Launch an audience re-engagement campaign',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Audience performance is progressing normally',
      );
    }

    return recommendations;
  }

  getTopRecords(limit = 10): AudienceRecord[] {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(0, safeLimit);
  }

  removeRecord(id: string): {
    success: true;
    id: string;
  } {
    this.getRecord(id);
    this.records.delete(id);

    return {
      success: true,
      id,
    };
  }

  private calculateAverage(
    values: number[],
  ): number {
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

  private normalizePercentage(
    value: number,
    field: string,
  ): number {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        `${field} must be a valid number`,
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private normalizeCount(
    value: number,
    field: string,
  ): number {
    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      throw new BadRequestException(
        `${field} must be zero or greater`,
      );
    }

    return Math.round(value);
  }

  private normalizeTags(tags?: string[]): string[] {
    if (!tags) {
      return [];
    }

    return [
      ...new Set(
        tags
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
  }
}
