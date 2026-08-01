import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type ExpansionStatus =
  | 'draft'
  | 'researching'
  | 'localizing'
  | 'review'
  | 'approved'
  | 'launching'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected'
  | 'archived';

export type ExpansionPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type ExpansionType =
  | 'localization'
  | 'multilingual-content'
  | 'market-expansion'
  | 'regional-compliance'
  | 'global-distribution'
  | 'partnership'
  | 'campaign'
  | 'other';

export type ComplianceStatus =
  | 'unknown'
  | 'pending'
  | 'compliant'
  | 'conditional'
  | 'non-compliant';

export interface GlobalExpansionRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: ExpansionType;
  status: ExpansionStatus;
  priority: ExpansionPriority;
  complianceStatus: ComplianceStatus;
  owner: string;
  sourceLanguage: string;
  targetLanguage: string;
  country: string;
  region: string;
  marketSize: number;
  localizationScore: number;
  culturalFitScore: number;
  complianceScore: number;
  distributionScore: number;
  opportunityScore: number;
  confidenceScore: number;
  estimatedCost: number;
  estimatedRevenue: number;
  estimatedAudience: number;
  expectedGrowthRate: number;
  launchDate?: string;
  distributionChannels: string[];
  requirements: string[];
  risks: string[];
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGlobalExpansionInput {
  name: string;
  description?: string;
  category: string;
  type?: ExpansionType;
  status?: ExpansionStatus;
  priority?: ExpansionPriority;
  complianceStatus?: ComplianceStatus;
  owner: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  country?: string;
  region?: string;
  marketSize?: number;
  localizationScore?: number;
  culturalFitScore?: number;
  complianceScore?: number;
  distributionScore?: number;
  opportunityScore?: number;
  confidenceScore?: number;
  estimatedCost?: number;
  estimatedRevenue?: number;
  estimatedAudience?: number;
  expectedGrowthRate?: number;
  launchDate?: string;
  distributionChannels?: string[];
  requirements?: string[];
  risks?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateGlobalExpansionInput {
  name?: string;
  description?: string;
  category?: string;
  type?: ExpansionType;
  status?: ExpansionStatus;
  priority?: ExpansionPriority;
  complianceStatus?: ComplianceStatus;
  owner?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  country?: string;
  region?: string;
  marketSize?: number;
  localizationScore?: number;
  culturalFitScore?: number;
  complianceScore?: number;
  distributionScore?: number;
  opportunityScore?: number;
  confidenceScore?: number;
  estimatedCost?: number;
  estimatedRevenue?: number;
  estimatedAudience?: number;
  expectedGrowthRate?: number;
  launchDate?: string;
  distributionChannels?: string[];
  requirements?: string[];
  risks?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export abstract class GlobalExpansionEngineBase {
  private readonly records =
    new Map<string, GlobalExpansionRecord>();

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
      totalRecords: records.length,
      researchingRecords: records.filter(
        (record) =>
          record.status === 'researching',
      ).length,
      localizingRecords: records.filter(
        (record) =>
          record.status === 'localizing',
      ).length,
      approvedRecords: records.filter(
        (record) => record.status === 'approved',
      ).length,
      activeRecords: records.filter(
        (record) => record.status === 'active',
      ).length,
      compliantRecords: records.filter(
        (record) =>
          record.complianceStatus === 'compliant',
      ).length,
      nonCompliantRecords: records.filter(
        (record) =>
          record.complianceStatus ===
          'non-compliant',
      ).length,
      criticalRecords: records.filter(
        (record) =>
          record.priority === 'critical',
      ).length,
      representedCountries: new Set(
        records.map((record) => record.country),
      ).size,
      representedLanguages: new Set(
        records.map(
          (record) => record.targetLanguage,
        ),
      ).size,
      totalEstimatedAudience: records.reduce(
        (total, record) =>
          total + record.estimatedAudience,
        0,
      ),
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
      averageLocalizationScore: this.average(
        records.map(
          (record) => record.localizationScore,
        ),
      ),
      averageCulturalFitScore: this.average(
        records.map(
          (record) => record.culturalFitScore,
        ),
      ),
      averageComplianceScore: this.average(
        records.map(
          (record) => record.complianceScore,
        ),
      ),
      averageDistributionScore: this.average(
        records.map(
          (record) => record.distributionScore,
        ),
      ),
      averageOpportunityScore: this.average(
        records.map(
          (record) => record.opportunityScore,
        ),
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateGlobalExpansionInput,
  ): GlobalExpansionRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Expansion name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Expansion category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Expansion owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: GlobalExpansionRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      complianceStatus:
        input.complianceStatus ?? 'unknown',
      owner,
      sourceLanguage:
        input.sourceLanguage?.trim().toLowerCase() ??
        'en',
      targetLanguage:
        input.targetLanguage?.trim().toLowerCase() ??
        'en',
      country:
        input.country?.trim().toUpperCase() ??
        'GLOBAL',
      region:
        input.region?.trim().toUpperCase() ??
        'GLOBAL',
      marketSize: this.money(
        input.marketSize ?? 0,
        'marketSize',
      ),
      localizationScore: this.percentage(
        input.localizationScore ?? 0,
        'localizationScore',
      ),
      culturalFitScore: this.percentage(
        input.culturalFitScore ?? 0,
        'culturalFitScore',
      ),
      complianceScore: this.percentage(
        input.complianceScore ?? 0,
        'complianceScore',
      ),
      distributionScore: this.percentage(
        input.distributionScore ?? 0,
        'distributionScore',
      ),
      opportunityScore: this.percentage(
        input.opportunityScore ?? 0,
        'opportunityScore',
      ),
      confidenceScore: this.percentage(
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
      estimatedAudience: this.nonNegativeInteger(
        input.estimatedAudience ?? 0,
        'estimatedAudience',
      ),
      expectedGrowthRate: this.percentage(
        input.expectedGrowthRate ?? 0,
        'expectedGrowthRate',
      ),
      launchDate: this.optionalDate(
        input.launchDate,
        'launchDate',
      ),
      distributionChannels: this.normalizeList(
        input.distributionChannels,
      ),
      requirements: this.normalizeList(
        input.requirements,
        false,
      ),
      risks: this.normalizeList(
        input.risks,
        false,
      ),
      tags: this.normalizeList(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: ExpansionStatus;
    priority?: ExpansionPriority;
    type?: ExpansionType;
    complianceStatus?: ComplianceStatus;
    category?: string;
    owner?: string;
    country?: string;
    region?: string;
    targetLanguage?: string;
    search?: string;
    minimumOpportunityScore?: number;
  }): GlobalExpansionRecord[] {
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
          filters?.type &&
          record.type !== filters.type
        ) {
          return false;
        }

        if (
          filters?.complianceStatus &&
          record.complianceStatus !==
            filters.complianceStatus
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
          filters?.country &&
          record.country !==
            filters.country.toUpperCase()
        ) {
          return false;
        }

        if (
          filters?.region &&
          record.region !==
            filters.region.toUpperCase()
        ) {
          return false;
        }

        if (
          filters?.targetLanguage &&
          record.targetLanguage !==
            filters.targetLanguage.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.minimumOpportunityScore !==
            undefined &&
          record.opportunityScore <
            filters.minimumOpportunityScore
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
            record.sourceLanguage,
            record.targetLanguage,
            record.country,
            record.region,
            ...record.distributionChannels,
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
          second.opportunityScore !==
          first.opportunityScore
        ) {
          return (
            second.opportunityScore -
            first.opportunityScore
          );
        }

        return (
          second.distributionScore -
          first.distributionScore
        );
      });
  }

  getRecord(id: string): GlobalExpansionRecord {
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
    input: UpdateGlobalExpansionInput,
  ): GlobalExpansionRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Expansion name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Expansion owner cannot be empty',
      );
    }

    const updated: GlobalExpansionRecord = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ??
        current.description,
      category:
        input.category?.trim() ?? current.category,
      owner:
        input.owner?.trim() ?? current.owner,
      sourceLanguage:
        input.sourceLanguage?.trim().toLowerCase() ??
        current.sourceLanguage,
      targetLanguage:
        input.targetLanguage?.trim().toLowerCase() ??
        current.targetLanguage,
      country:
        input.country?.trim().toUpperCase() ??
        current.country,
      region:
        input.region?.trim().toUpperCase() ??
        current.region,
      marketSize:
        input.marketSize !== undefined
          ? this.money(
              input.marketSize,
              'marketSize',
            )
          : current.marketSize,
      localizationScore:
        input.localizationScore !== undefined
          ? this.percentage(
              input.localizationScore,
              'localizationScore',
            )
          : current.localizationScore,
      culturalFitScore:
        input.culturalFitScore !== undefined
          ? this.percentage(
              input.culturalFitScore,
              'culturalFitScore',
            )
          : current.culturalFitScore,
      complianceScore:
        input.complianceScore !== undefined
          ? this.percentage(
              input.complianceScore,
              'complianceScore',
            )
          : current.complianceScore,
      distributionScore:
        input.distributionScore !== undefined
          ? this.percentage(
              input.distributionScore,
              'distributionScore',
            )
          : current.distributionScore,
      opportunityScore:
        input.opportunityScore !== undefined
          ? this.percentage(
              input.opportunityScore,
              'opportunityScore',
            )
          : current.opportunityScore,
      confidenceScore:
        input.confidenceScore !== undefined
          ? this.percentage(
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
      estimatedAudience:
        input.estimatedAudience !== undefined
          ? this.nonNegativeInteger(
              input.estimatedAudience,
              'estimatedAudience',
            )
          : current.estimatedAudience,
      expectedGrowthRate:
        input.expectedGrowthRate !== undefined
          ? this.percentage(
              input.expectedGrowthRate,
              'expectedGrowthRate',
            )
          : current.expectedGrowthRate,
      launchDate:
        input.launchDate !== undefined
          ? this.optionalDate(
              input.launchDate,
              'launchDate',
            )
          : current.launchDate,
      distributionChannels:
        input.distributionChannels !== undefined
          ? this.normalizeList(
              input.distributionChannels,
            )
          : current.distributionChannels,
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

  startResearch(id: string) {
    return this.updateRecord(id, {
      status: 'researching',
    });
  }

  startLocalization(id: string) {
    return this.updateRecord(id, {
      status: 'localizing',
    });
  }

  submitForReview(id: string) {
    return this.updateRecord(id, {
      status: 'review',
    });
  }

  approveRecord(id: string) {
    const record = this.getRecord(id);

    if (
      record.complianceStatus ===
      'non-compliant'
    ) {
      throw new BadRequestException(
        'Non-compliant expansion cannot be approved',
      );
    }

    return this.updateRecord(id, {
      status: 'approved',
    });
  }

  launchRecord(id: string) {
    const record = this.getRecord(id);

    if (record.status !== 'approved') {
      throw new BadRequestException(
        'Only approved expansion can launch',
      );
    }

    return this.updateRecord(id, {
      status: 'launching',
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
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  updateCompliance(
    id: string,
    complianceStatus: ComplianceStatus,
    complianceScore: number,
  ) {
    return this.updateRecord(id, {
      complianceStatus,
      complianceScore,
    });
  }

  addDistributionChannel(
    id: string,
    channel: string,
  ) {
    const record = this.getRecord(id);
    const normalized = channel?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Distribution channel is required',
      );
    }

    return this.updateRecord(id, {
      distributionChannels: [
        ...record.distributionChannels,
        normalized,
      ],
    });
  }

  addRisk(id: string, risk: string) {
    const record = this.getRecord(id);
    const normalized = risk?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Risk description is required',
      );
    }

    return this.updateRecord(id, {
      risks: [...record.risks, normalized],
    });
  }

  analyzeMarketOpportunity(id: string) {
    const record = this.getRecord(id);

    const score =
      record.opportunityScore * 0.3 +
      record.localizationScore * 0.15 +
      record.culturalFitScore * 0.15 +
      record.complianceScore * 0.15 +
      record.distributionScore * 0.15 +
      record.confidenceScore * 0.1;

    const recommendation =
      score >= 80
        ? 'expand-immediately'
        : score >= 65
          ? 'high-potential'
          : score >= 45
            ? 'pilot-market'
            : 'defer';

    return {
      id: record.id,
      country: record.country,
      region: record.region,
      targetLanguage: record.targetLanguage,
      score: Number(score.toFixed(2)),
      recommendation,
      estimatedAudience:
        record.estimatedAudience,
      expectedGrowthRate:
        record.expectedGrowthRate,
      analyzedAt: new Date().toISOString(),
    };
  }

  calculateExpansionCase(id: string) {
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

    const audienceAcquisitionCost =
      record.estimatedAudience === 0
        ? 0
        : record.estimatedCost /
          record.estimatedAudience;

    return {
      id: record.id,
      estimatedCost: record.estimatedCost,
      estimatedRevenue:
        record.estimatedRevenue,
      estimatedProfit: Number(
        estimatedProfit.toFixed(2),
      ),
      roi: Number(roi.toFixed(2)),
      audienceAcquisitionCost: Number(
        audienceAcquisitionCost.toFixed(4),
      ),
      calculatedAt: new Date().toISOString(),
    };
  }

  generateLocalizationPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      sourceLanguage: record.sourceLanguage,
      targetLanguage: record.targetLanguage,
      country: record.country,
      steps: [
        'Translate scripts and metadata',
        'Adapt cultural references',
        'Review regional terminology',
        'Localize thumbnails and titles',
        'Produce regional voice assets',
        'Run native-language quality review',
        'Validate regional compliance',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateDistributionPlan(id: string) {
    const record = this.getRecord(id);

    const channels =
      record.distributionChannels.length > 0
        ? record.distributionChannels
        : [
            'youtube-main-channel',
            'youtube-shorts',
            'regional-social-media',
          ];

    return {
      id: record.id,
      country: record.country,
      region: record.region,
      channels,
      phases: [
        'Pre-launch audience validation',
        'Regional content launch',
        'Paid and organic distribution',
        'Performance monitoring',
        'Regional optimization',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  runComplianceAssessment(id: string) {
    const record = this.getRecord(id);
    const issues: string[] = [];

    if (record.complianceScore < 70) {
      issues.push(
        'Compliance score is below launch target',
      );
    }

    if (record.requirements.length === 0) {
      issues.push(
        'Regional requirements are not documented',
      );
    }

    if (
      record.complianceStatus === 'unknown' ||
      record.complianceStatus === 'pending'
    ) {
      issues.push(
        'Compliance assessment is incomplete',
      );
    }

    if (
      record.complianceStatus ===
      'non-compliant'
    ) {
      issues.push(
        'Expansion is marked non-compliant',
      );
    }

    return {
      id: record.id,
      passed: issues.length === 0,
      complianceStatus:
        record.complianceStatus,
      complianceScore:
        record.complianceScore,
      requirements: record.requirements,
      issues,
      assessedAt: new Date().toISOString(),
    };
  }

  getTopRecords(limit = 10) {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(0, safeLimit);
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

  private percentage(
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

  private nonNegativeInteger(
    value: number,
    field: string,
  ) {
    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      throw new BadRequestException(
        `${field} must be a non-negative integer`,
      );
    }

    return value;
  }

  private optionalDate(
    value: string | undefined,
    field: string,
  ) {
    if (!value) {
      return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        `${field} must be a valid date`,
      );
    }

    return date.toISOString();
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
