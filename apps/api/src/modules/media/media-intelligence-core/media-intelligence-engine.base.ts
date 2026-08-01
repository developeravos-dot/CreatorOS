import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type IntelligenceStatus =
  | 'draft'
  | 'collecting'
  | 'analyzing'
  | 'forecasting'
  | 'review'
  | 'approved'
  | 'active'
  | 'monitoring'
  | 'completed'
  | 'archived';

export type IntelligencePriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type IntelligenceType =
  | 'performance'
  | 'audience'
  | 'trend'
  | 'opportunity'
  | 'forecast'
  | 'executive-decision'
  | 'experiment'
  | 'other';

export interface IntelligenceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  source: string;
  capturedAt: string;
}

export interface IntelligenceSignal {
  id: string;
  title: string;
  description: string;
  type:
    | 'positive'
    | 'negative'
    | 'warning'
    | 'opportunity'
    | 'anomaly';
  confidence: number;
  impact: number;
  source: string;
  detectedAt: string;
}

export interface IntelligenceForecast {
  id: string;
  metric: string;
  horizonDays: number;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  generatedAt: string;
}

export interface IntelligenceDecision {
  id: string;
  title: string;
  recommendation: string;
  rationale: string;
  expectedImpact: number;
  confidence: number;
  status:
    | 'proposed'
    | 'human-review'
    | 'approved'
    | 'rejected'
    | 'executed';
  humanApproved: boolean;
  decidedBy: string;
  decidedAt: string;
}

export interface MediaIntelligenceRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: IntelligenceType;
  status: IntelligenceStatus;
  priority: IntelligencePriority;

  owner: string;
  projectId: string;
  contentId: string;
  channelId: string;
  campaignId: string;
  publicationId: string;

  platform: string;
  region: string;
  language: string;
  audience: string;

  metrics: IntelligenceMetric[];
  signals: IntelligenceSignal[];
  forecasts: IntelligenceForecast[];
  decisions: IntelligenceDecision[];

  views: number;
  impressions: number;
  watchTimeMinutes: number;
  engagementRate: number;
  clickThroughRate: number;
  conversionRate: number;
  retentionRate: number;
  revenue: number;
  cost: number;
  profit: number;

  performanceScore: number;
  audienceScore: number;
  trendScore: number;
  opportunityScore: number;
  forecastConfidenceScore: number;
  decisionConfidenceScore: number;
  strategicValueScore: number;

  insights: string[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  experiments: string[];
  tags: string[];

  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaIntelligenceInput {
  name: string;
  description?: string;
  category: string;
  type?: IntelligenceType;
  status?: IntelligenceStatus;
  priority?: IntelligencePriority;

  owner: string;
  projectId?: string;
  contentId?: string;
  channelId?: string;
  campaignId?: string;
  publicationId?: string;

  platform?: string;
  region?: string;
  language?: string;
  audience?: string;

  metrics?: IntelligenceMetric[];
  signals?: IntelligenceSignal[];
  forecasts?: IntelligenceForecast[];
  decisions?: IntelligenceDecision[];

  views?: number;
  impressions?: number;
  watchTimeMinutes?: number;
  engagementRate?: number;
  clickThroughRate?: number;
  conversionRate?: number;
  retentionRate?: number;
  revenue?: number;
  cost?: number;
  profit?: number;

  performanceScore?: number;
  audienceScore?: number;
  trendScore?: number;
  opportunityScore?: number;
  forecastConfidenceScore?: number;
  decisionConfidenceScore?: number;
  strategicValueScore?: number;

  insights?: string[];
  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  experiments?: string[];
  tags?: string[];

  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
}

export interface UpdateMediaIntelligenceInput
  extends Partial<CreateMediaIntelligenceInput> {}

export abstract class MediaIntelligenceEngineBase {
  private readonly records =
    new Map<string, MediaIntelligenceRecord>();

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
        'AVOS Media Intelligence Analytics Forecasting and Decision Support',
      humanFinalAuthority: true,

      totalRecords: records.length,

      collectingRecords: records.filter(
        (record) => record.status === 'collecting',
      ).length,

      analyzingRecords: records.filter(
        (record) => record.status === 'analyzing',
      ).length,

      forecastingRecords: records.filter(
        (record) => record.status === 'forecasting',
      ).length,

      monitoringRecords: records.filter(
        (record) => record.status === 'monitoring',
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

      totalRevenue: Number(
        records
          .reduce(
            (total, record) =>
              total + record.revenue,
            0,
          )
          .toFixed(2),
      ),

      totalProfit: Number(
        records
          .reduce(
            (total, record) =>
              total + record.profit,
            0,
          )
          .toFixed(2),
      ),

      totalSignals: records.reduce(
        (total, record) =>
          total + record.signals.length,
        0,
      ),

      totalForecasts: records.reduce(
        (total, record) =>
          total + record.forecasts.length,
        0,
      ),

      totalDecisions: records.reduce(
        (total, record) =>
          total + record.decisions.length,
        0,
      ),

      averagePerformanceScore: this.average(
        records.map(
          (record) => record.performanceScore,
        ),
      ),

      averageOpportunityScore: this.average(
        records.map(
          (record) => record.opportunityScore,
        ),
      ),

      averageStrategicValueScore: this.average(
        records.map(
          (record) => record.strategicValueScore,
        ),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaIntelligenceInput,
  ): MediaIntelligenceRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Intelligence record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Intelligence category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Intelligence owner is required',
      );
    }

    const now = new Date().toISOString();

    const revenue = this.nonNegativeNumber(
      input.revenue ?? 0,
      'revenue',
    );

    const cost = this.nonNegativeNumber(
      input.cost ?? 0,
      'cost',
    );

    const record: MediaIntelligenceRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',

      owner,
      projectId: input.projectId?.trim() ?? '',
      contentId: input.contentId?.trim() ?? '',
      channelId: input.channelId?.trim() ?? '',
      campaignId:
        input.campaignId?.trim() ?? '',
      publicationId:
        input.publicationId?.trim() ?? '',

      platform:
        input.platform?.trim().toLowerCase() ??
        'global',

      region:
        input.region?.trim().toLowerCase() ??
        'global',

      language:
        input.language?.trim().toLowerCase() ??
        'en',

      audience:
        input.audience?.trim() ??
        'general audience',

      metrics:
        input.metrics?.map((metric) =>
          this.normalizeMetric(metric),
        ) ?? [],

      signals:
        input.signals?.map((signal) =>
          this.normalizeSignal(signal),
        ) ?? [],

      forecasts:
        input.forecasts?.map((forecast) =>
          this.normalizeForecast(forecast),
        ) ?? [],

      decisions:
        input.decisions?.map((decision) =>
          this.normalizeDecision(decision),
        ) ?? [],

      views: this.nonNegativeNumber(
        input.views ?? 0,
        'views',
      ),

      impressions: this.nonNegativeNumber(
        input.impressions ?? 0,
        'impressions',
      ),

      watchTimeMinutes:
        this.nonNegativeNumber(
          input.watchTimeMinutes ?? 0,
          'watchTimeMinutes',
        ),

      engagementRate: this.percentage(
        input.engagementRate ?? 0,
        'engagementRate',
      ),

      clickThroughRate: this.percentage(
        input.clickThroughRate ?? 0,
        'clickThroughRate',
      ),

      conversionRate: this.percentage(
        input.conversionRate ?? 0,
        'conversionRate',
      ),

      retentionRate: this.percentage(
        input.retentionRate ?? 0,
        'retentionRate',
      ),

      revenue,
      cost,

      profit:
        input.profit !== undefined
          ? Number(input.profit.toFixed(2))
          : Number((revenue - cost).toFixed(2)),

      performanceScore: this.score(
        input.performanceScore ?? 0,
        'performanceScore',
      ),

      audienceScore: this.score(
        input.audienceScore ?? 0,
        'audienceScore',
      ),

      trendScore: this.score(
        input.trendScore ?? 0,
        'trendScore',
      ),

      opportunityScore: this.score(
        input.opportunityScore ?? 0,
        'opportunityScore',
      ),

      forecastConfidenceScore: this.score(
        input.forecastConfidenceScore ?? 0,
        'forecastConfidenceScore',
      ),

      decisionConfidenceScore: this.score(
        input.decisionConfidenceScore ?? 0,
        'decisionConfidenceScore',
      ),

      strategicValueScore: this.score(
        input.strategicValueScore ?? 0,
        'strategicValueScore',
      ),

      insights: this.normalizeList(
        input.insights,
        false,
      ),

      risks: this.normalizeList(
        input.risks,
        false,
      ),

      opportunities: this.normalizeList(
        input.opportunities,
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
    status?: IntelligenceStatus;
    priority?: IntelligencePriority;
    type?: IntelligenceType;
    owner?: string;
    platform?: string;
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
          filters?.region &&
          record.region !==
            filters.region.toLowerCase()
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
            record.region,
            record.language,
            record.audience,
            ...record.insights,
            ...record.risks,
            ...record.opportunities,
            ...record.recommendations,
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
          second.strategicValueScore -
          first.strategicValueScore,
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
    input: UpdateMediaIntelligenceInput,
  ) {
    const current = this.getRecord(id);

    const revenue =
      input.revenue !== undefined
        ? this.nonNegativeNumber(
            input.revenue,
            'revenue',
          )
        : current.revenue;

    const cost =
      input.cost !== undefined
        ? this.nonNegativeNumber(
            input.cost,
            'cost',
          )
        : current.cost;

    const updated: MediaIntelligenceRecord = {
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

      contentId:
        input.contentId?.trim() ??
        current.contentId,

      channelId:
        input.channelId?.trim() ??
        current.channelId,

      campaignId:
        input.campaignId?.trim() ??
        current.campaignId,

      publicationId:
        input.publicationId?.trim() ??
        current.publicationId,

      platform:
        input.platform?.trim().toLowerCase() ??
        current.platform,

      region:
        input.region?.trim().toLowerCase() ??
        current.region,

      language:
        input.language?.trim().toLowerCase() ??
        current.language,

      audience:
        input.audience?.trim() ??
        current.audience,

      metrics:
        input.metrics !== undefined
          ? input.metrics.map((metric) =>
              this.normalizeMetric(metric),
            )
          : current.metrics,

      signals:
        input.signals !== undefined
          ? input.signals.map((signal) =>
              this.normalizeSignal(signal),
            )
          : current.signals,

      forecasts:
        input.forecasts !== undefined
          ? input.forecasts.map((forecast) =>
              this.normalizeForecast(forecast),
            )
          : current.forecasts,

      decisions:
        input.decisions !== undefined
          ? input.decisions.map((decision) =>
              this.normalizeDecision(decision),
            )
          : current.decisions,

      views:
        input.views !== undefined
          ? this.nonNegativeNumber(
              input.views,
              'views',
            )
          : current.views,

      impressions:
        input.impressions !== undefined
          ? this.nonNegativeNumber(
              input.impressions,
              'impressions',
            )
          : current.impressions,

      watchTimeMinutes:
        input.watchTimeMinutes !== undefined
          ? this.nonNegativeNumber(
              input.watchTimeMinutes,
              'watchTimeMinutes',
            )
          : current.watchTimeMinutes,

      engagementRate:
        input.engagementRate !== undefined
          ? this.percentage(
              input.engagementRate,
              'engagementRate',
            )
          : current.engagementRate,

      clickThroughRate:
        input.clickThroughRate !== undefined
          ? this.percentage(
              input.clickThroughRate,
              'clickThroughRate',
            )
          : current.clickThroughRate,

      conversionRate:
        input.conversionRate !== undefined
          ? this.percentage(
              input.conversionRate,
              'conversionRate',
            )
          : current.conversionRate,

      retentionRate:
        input.retentionRate !== undefined
          ? this.percentage(
              input.retentionRate,
              'retentionRate',
            )
          : current.retentionRate,

      revenue,
      cost,

      profit:
        input.profit !== undefined
          ? Number(input.profit.toFixed(2))
          : Number((revenue - cost).toFixed(2)),

      performanceScore:
        input.performanceScore !== undefined
          ? this.score(
              input.performanceScore,
              'performanceScore',
            )
          : current.performanceScore,

      audienceScore:
        input.audienceScore !== undefined
          ? this.score(
              input.audienceScore,
              'audienceScore',
            )
          : current.audienceScore,

      trendScore:
        input.trendScore !== undefined
          ? this.score(
              input.trendScore,
              'trendScore',
            )
          : current.trendScore,

      opportunityScore:
        input.opportunityScore !== undefined
          ? this.score(
              input.opportunityScore,
              'opportunityScore',
            )
          : current.opportunityScore,

      forecastConfidenceScore:
        input.forecastConfidenceScore !==
        undefined
          ? this.score(
              input.forecastConfidenceScore,
              'forecastConfidenceScore',
            )
          : current.forecastConfidenceScore,

      decisionConfidenceScore:
        input.decisionConfidenceScore !==
        undefined
          ? this.score(
              input.decisionConfidenceScore,
              'decisionConfidenceScore',
            )
          : current.decisionConfidenceScore,

      strategicValueScore:
        input.strategicValueScore !== undefined
          ? this.score(
              input.strategicValueScore,
              'strategicValueScore',
            )
          : current.strategicValueScore,

      insights:
        input.insights !== undefined
          ? this.normalizeList(
              input.insights,
              false,
            )
          : current.insights,

      risks:
        input.risks !== undefined
          ? this.normalizeList(
              input.risks,
              false,
            )
          : current.risks,

      opportunities:
        input.opportunities !== undefined
          ? this.normalizeList(
              input.opportunities,
              false,
            )
          : current.opportunities,

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

  startCollection(id: string) {
    return this.updateRecord(id, {
      status: 'collecting',
    });
  }

  startAnalysis(id: string) {
    return this.updateRecord(id, {
      status: 'analyzing',
    });
  }

  startForecasting(id: string) {
    return this.updateRecord(id, {
      status: 'forecasting',
    });
  }

  submitForHumanReview(id: string) {
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

  activateIntelligence(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before activation',
      );
    }

    return this.updateRecord(id, {
      status: 'active',
    });
  }

  startMonitoring(id: string) {
    return this.updateRecord(id, {
      status: 'monitoring',
    });
  }

  completeRecord(id: string) {
    return this.updateRecord(id, {
      status: 'completed',
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addMetric(
    id: string,
    input: Partial<IntelligenceMetric>,
  ) {
    const record = this.getRecord(id);
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'Metric name is required',
      );
    }

    const metric = this.normalizeMetric({
      id: input.id ?? randomUUID(),
      name,
      value: input.value ?? 0,
      previousValue:
        input.previousValue ?? 0,
      unit: input.unit?.trim() ?? 'number',
      source:
        input.source?.trim() ?? 'manual',
      capturedAt:
        input.capturedAt?.trim() ??
        new Date().toISOString(),
    });

    return this.updateRecord(id, {
      metrics: [...record.metrics, metric],
    });
  }

  addSignal(
    id: string,
    input: Partial<IntelligenceSignal>,
  ) {
    const record = this.getRecord(id);
    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException(
        'Signal title is required',
      );
    }

    const signal = this.normalizeSignal({
      id: input.id ?? randomUUID(),
      title,
      description:
        input.description?.trim() ?? '',
      type: input.type ?? 'opportunity',
      confidence: input.confidence ?? 0,
      impact: input.impact ?? 0,
      source:
        input.source?.trim() ?? 'system',
      detectedAt:
        input.detectedAt?.trim() ??
        new Date().toISOString(),
    });

    return this.updateRecord(id, {
      signals: [...record.signals, signal],
    });
  }

  addForecast(
    id: string,
    input: Partial<IntelligenceForecast>,
  ) {
    const record = this.getRecord(id);
    const metric = input.metric?.trim();

    if (!metric) {
      throw new BadRequestException(
        'Forecast metric is required',
      );
    }

    const forecast = this.normalizeForecast({
      id: input.id ?? randomUUID(),
      metric,
      horizonDays:
        input.horizonDays ?? 30,
      predictedValue:
        input.predictedValue ?? 0,
      lowerBound:
        input.lowerBound ?? 0,
      upperBound:
        input.upperBound ?? 0,
      confidence:
        input.confidence ?? 0,
      generatedAt:
        input.generatedAt?.trim() ??
        new Date().toISOString(),
    });

    return this.updateRecord(id, {
      forecasts: [
        ...record.forecasts,
        forecast,
      ],
    });
  }

  addDecision(
    id: string,
    input: Partial<IntelligenceDecision>,
  ) {
    const record = this.getRecord(id);
    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException(
        'Decision title is required',
      );
    }

    const decision = this.normalizeDecision({
      id: input.id ?? randomUUID(),
      title,
      recommendation:
        input.recommendation?.trim() ?? '',
      rationale:
        input.rationale?.trim() ?? '',
      expectedImpact:
        input.expectedImpact ?? 0,
      confidence:
        input.confidence ?? 0,
      status: input.status ?? 'proposed',
      humanApproved:
        input.humanApproved ?? false,
      decidedBy:
        input.decidedBy?.trim() ?? '',
      decidedAt:
        input.decidedAt?.trim() ?? '',
    });

    return this.updateRecord(id, {
      decisions: [
        ...record.decisions,
        decision,
      ],
    });
  }

  approveDecision(
    id: string,
    decisionId: string,
    decidedBy: string,
  ) {
    const record = this.getRecord(id);

    const exists = record.decisions.some(
      (decision) =>
        decision.id === decisionId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Decision '${decisionId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      decisions: record.decisions.map(
        (decision) =>
          decision.id === decisionId
            ? {
                ...decision,
                status: 'approved' as const,
                humanApproved: true,
                decidedBy:
                  decidedBy?.trim() ||
                  record.owner,
                decidedAt:
                  new Date().toISOString(),
              }
            : decision,
      ),
    });
  }

  calculateUnifiedPerformance(id: string) {
    const record = this.getRecord(id);

    const calculatedCtr =
      record.impressions > 0
        ? (record.views /
            record.impressions) *
          100
        : 0;

    const returnOnInvestment =
      record.cost > 0
        ? (record.profit / record.cost) * 100
        : record.revenue > 0
          ? 100
          : 0;

    return {
      id: record.id,
      views: record.views,
      impressions: record.impressions,
      calculatedClickThroughRate: Number(
        calculatedCtr.toFixed(2),
      ),
      engagementRate:
        record.engagementRate,
      conversionRate:
        record.conversionRate,
      retentionRate:
        record.retentionRate,
      revenue: record.revenue,
      cost: record.cost,
      profit: record.profit,
      returnOnInvestment: Number(
        returnOnInvestment.toFixed(2),
      ),
      calculatedAt: new Date().toISOString(),
    };
  }

  generateAudienceIntelligence(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      audience: record.audience,
      audienceScore: record.audienceScore,
      engagementRate:
        record.engagementRate,
      retentionRate:
        record.retentionRate,
      signals: record.signals.filter(
        (signal) =>
          signal.type === 'positive' ||
          signal.type === 'negative' ||
          signal.type === 'anomaly',
      ),
      analysisStages: [
        'audience-segmentation',
        'behavior-analysis',
        'retention-analysis',
        'engagement-analysis',
        'conversion-analysis',
        'audience-value-analysis',
        'growth-recommendation',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateTrendIntelligence(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      trendScore: record.trendScore,
      opportunities:
        record.opportunities,
      signals: record.signals,
      trendStages: [
        'signal-collection',
        'velocity-detection',
        'trend-classification',
        'market-fit-analysis',
        'content-fit-analysis',
        'timing-assessment',
        'human-opportunity-review',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateOpportunityRadar(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      opportunityScore:
        record.opportunityScore,
      opportunities:
        record.opportunities,
      recommendations:
        record.recommendations,
      opportunitySignals:
        record.signals.filter(
          (signal) =>
            signal.type === 'opportunity',
        ),
      radarDimensions: [
        'content-opportunity',
        'audience-opportunity',
        'platform-opportunity',
        'market-opportunity',
        'revenue-opportunity',
        'ip-opportunity',
        'partnership-opportunity',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateForecastReport(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      forecastConfidenceScore:
        record.forecastConfidenceScore,
      forecasts: record.forecasts,
      horizons: {
        shortTermDays: 7,
        mediumTermDays: 30,
        longTermDays: 90,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  generateExecutiveDecisionBrief(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      name: record.name,
      strategicValueScore:
        record.strategicValueScore,
      performanceScore:
        record.performanceScore,
      opportunityScore:
        record.opportunityScore,
      decisionConfidenceScore:
        record.decisionConfidenceScore,
      insights: record.insights,
      risks: record.risks,
      opportunities:
        record.opportunities,
      recommendations:
        record.recommendations,
      decisions: record.decisions,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  runIntelligenceAssessment(id: string) {
    const record = this.getRecord(id);

    const score =
      record.performanceScore * 0.18 +
      record.audienceScore * 0.14 +
      record.trendScore * 0.14 +
      record.opportunityScore * 0.16 +
      record.forecastConfidenceScore * 0.13 +
      record.decisionConfidenceScore * 0.13 +
      record.strategicValueScore * 0.12;

    const recommendation =
      score >= 90
        ? 'strategic-action-ready-for-human-approval'
        : score >= 75
          ? 'additional-validation-required'
          : score >= 60
            ? 'intelligence-improvement-required'
            : 'insufficient-decision-confidence';

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

  private normalizeMetric(
    metric: IntelligenceMetric,
  ): IntelligenceMetric {
    return {
      id: metric.id?.trim() || randomUUID(),
      name:
        metric.name?.trim() ||
        'Unnamed metric',
      value: Number(metric.value ?? 0),
      previousValue: Number(
        metric.previousValue ?? 0,
      ),
      unit: metric.unit?.trim() ?? 'number',
      source:
        metric.source?.trim() ?? 'manual',
      capturedAt:
        metric.capturedAt?.trim() ??
        new Date().toISOString(),
    };
  }

  private normalizeSignal(
    signal: IntelligenceSignal,
  ): IntelligenceSignal {
    return {
      id: signal.id?.trim() || randomUUID(),
      title:
        signal.title?.trim() ||
        'Untitled signal',
      description:
        signal.description?.trim() ?? '',
      type: signal.type ?? 'opportunity',
      confidence: this.score(
        signal.confidence ?? 0,
        'signal confidence',
      ),
      impact: this.score(
        signal.impact ?? 0,
        'signal impact',
      ),
      source:
        signal.source?.trim() ?? 'system',
      detectedAt:
        signal.detectedAt?.trim() ??
        new Date().toISOString(),
    };
  }

  private normalizeForecast(
    forecast: IntelligenceForecast,
  ): IntelligenceForecast {
    return {
      id:
        forecast.id?.trim() || randomUUID(),
      metric:
        forecast.metric?.trim() ||
        'unknown',
      horizonDays: Math.max(
        1,
        Math.round(forecast.horizonDays ?? 30),
      ),
      predictedValue: Number(
        forecast.predictedValue ?? 0,
      ),
      lowerBound: Number(
        forecast.lowerBound ?? 0,
      ),
      upperBound: Number(
        forecast.upperBound ?? 0,
      ),
      confidence: this.score(
        forecast.confidence ?? 0,
        'forecast confidence',
      ),
      generatedAt:
        forecast.generatedAt?.trim() ??
        new Date().toISOString(),
    };
  }

  private normalizeDecision(
    decision: IntelligenceDecision,
  ): IntelligenceDecision {
    return {
      id:
        decision.id?.trim() || randomUUID(),
      title:
        decision.title?.trim() ||
        'Untitled decision',
      recommendation:
        decision.recommendation?.trim() ?? '',
      rationale:
        decision.rationale?.trim() ?? '',
      expectedImpact: this.score(
        decision.expectedImpact ?? 0,
        'expected impact',
      ),
      confidence: this.score(
        decision.confidence ?? 0,
        'decision confidence',
      ),
      status:
        decision.status ?? 'proposed',
      humanApproved:
        decision.humanApproved ?? false,
      decidedBy:
        decision.decidedBy?.trim() ?? '',
      decidedAt:
        decision.decidedAt?.trim() ?? '',
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

  private percentage(
    value: number,
    field: string,
  ) {
    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      throw new BadRequestException(
        `${field} must be between 0 and 100`,
      );
    }

    return Number(value.toFixed(2));
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
