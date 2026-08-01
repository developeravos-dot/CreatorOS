import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type StrategyStatus =
  | 'draft'
  | 'analyzing'
  | 'recommended'
  | 'approved'
  | 'executing'
  | 'completed'
  | 'rejected'
  | 'archived';

export type StrategyPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type StrategyType =
  | 'channel'
  | 'trend'
  | 'opportunity'
  | 'investment'
  | 'executive-decision'
  | 'content'
  | 'market'
  | 'other';

export type RiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface StrategyRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: StrategyType;
  status: StrategyStatus;
  priority: StrategyPriority;
  riskLevel: RiskLevel;
  owner: string;
  market: string;
  audience: string;
  opportunityScore: number;
  trendScore: number;
  strategicScore: number;
  confidenceScore: number;
  investmentScore: number;
  estimatedCost: number;
  estimatedRevenue: number;
  estimatedViews: number;
  expectedGrowthRate: number;
  timeframeDays: number;
  decision?: string;
  rationale?: string;
  tags: string[];
  signals: string[];
  assumptions: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStrategyRecordInput {
  name: string;
  description?: string;
  category: string;
  type?: StrategyType;
  status?: StrategyStatus;
  priority?: StrategyPriority;
  riskLevel?: RiskLevel;
  owner: string;
  market?: string;
  audience?: string;
  opportunityScore?: number;
  trendScore?: number;
  strategicScore?: number;
  confidenceScore?: number;
  investmentScore?: number;
  estimatedCost?: number;
  estimatedRevenue?: number;
  estimatedViews?: number;
  expectedGrowthRate?: number;
  timeframeDays?: number;
  decision?: string;
  rationale?: string;
  tags?: string[];
  signals?: string[];
  assumptions?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateStrategyRecordInput {
  name?: string;
  description?: string;
  category?: string;
  type?: StrategyType;
  status?: StrategyStatus;
  priority?: StrategyPriority;
  riskLevel?: RiskLevel;
  owner?: string;
  market?: string;
  audience?: string;
  opportunityScore?: number;
  trendScore?: number;
  strategicScore?: number;
  confidenceScore?: number;
  investmentScore?: number;
  estimatedCost?: number;
  estimatedRevenue?: number;
  estimatedViews?: number;
  expectedGrowthRate?: number;
  timeframeDays?: number;
  decision?: string;
  rationale?: string;
  tags?: string[];
  signals?: string[];
  assumptions?: string[];
  metadata?: Record<string, unknown>;
}

export abstract class IntelligenceStrategyEngineBase {
  private readonly records =
    new Map<string, StrategyRecord>();

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
      analyzingRecords: records.filter(
        (record) => record.status === 'analyzing',
      ).length,
      recommendedRecords: records.filter(
        (record) =>
          record.status === 'recommended',
      ).length,
      approvedRecords: records.filter(
        (record) => record.status === 'approved',
      ).length,
      executingRecords: records.filter(
        (record) => record.status === 'executing',
      ).length,
      completedRecords: records.filter(
        (record) => record.status === 'completed',
      ).length,
      criticalPriorityRecords: records.filter(
        (record) =>
          record.priority === 'critical',
      ).length,
      highRiskRecords: records.filter(
        (record) =>
          record.riskLevel === 'high' ||
          record.riskLevel === 'critical',
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
      averageOpportunityScore: this.average(
        records.map(
          (record) => record.opportunityScore,
        ),
      ),
      averageTrendScore: this.average(
        records.map(
          (record) => record.trendScore,
        ),
      ),
      averageStrategicScore: this.average(
        records.map(
          (record) => record.strategicScore,
        ),
      ),
      averageConfidenceScore: this.average(
        records.map(
          (record) => record.confidenceScore,
        ),
      ),
      averageInvestmentScore: this.average(
        records.map(
          (record) => record.investmentScore,
        ),
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateStrategyRecordInput,
  ): StrategyRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Strategy name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Strategy category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Strategy owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: StrategyRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      riskLevel: input.riskLevel ?? 'medium',
      owner,
      market:
        input.market?.trim().toUpperCase() ??
        'GLOBAL',
      audience:
        input.audience?.trim() ??
        'general audience',
      opportunityScore: this.percentage(
        input.opportunityScore ?? 0,
        'opportunityScore',
      ),
      trendScore: this.percentage(
        input.trendScore ?? 0,
        'trendScore',
      ),
      strategicScore: this.percentage(
        input.strategicScore ?? 0,
        'strategicScore',
      ),
      confidenceScore: this.percentage(
        input.confidenceScore ?? 0,
        'confidenceScore',
      ),
      investmentScore: this.percentage(
        input.investmentScore ?? 0,
        'investmentScore',
      ),
      estimatedCost: this.money(
        input.estimatedCost ?? 0,
        'estimatedCost',
      ),
      estimatedRevenue: this.money(
        input.estimatedRevenue ?? 0,
        'estimatedRevenue',
      ),
      estimatedViews: this.nonNegativeInteger(
        input.estimatedViews ?? 0,
        'estimatedViews',
      ),
      expectedGrowthRate: this.percentage(
        input.expectedGrowthRate ?? 0,
        'expectedGrowthRate',
      ),
      timeframeDays: this.positiveInteger(
        input.timeframeDays ?? 30,
        'timeframeDays',
      ),
      decision: input.decision?.trim(),
      rationale: input.rationale?.trim(),
      tags: this.normalizeList(input.tags),
      signals: this.normalizeList(
        input.signals,
        false,
      ),
      assumptions: this.normalizeList(
        input.assumptions,
        false,
      ),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: StrategyStatus;
    priority?: StrategyPriority;
    type?: StrategyType;
    riskLevel?: RiskLevel;
    category?: string;
    owner?: string;
    market?: string;
    search?: string;
    minimumStrategicScore?: number;
  }): StrategyRecord[] {
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
          filters?.riskLevel &&
          record.riskLevel !== filters.riskLevel
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
          filters?.market &&
          record.market !==
            filters.market.toUpperCase()
        ) {
          return false;
        }

        if (
          filters?.minimumStrategicScore !==
            undefined &&
          record.strategicScore <
            filters.minimumStrategicScore
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
            record.market,
            record.audience,
            record.decision ?? '',
            record.rationale ?? '',
            ...record.tags,
            ...record.signals,
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
          second.opportunityScore -
          first.opportunityScore
        );
      });
  }

  getRecord(id: string): StrategyRecord {
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
    input: UpdateStrategyRecordInput,
  ): StrategyRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Strategy name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Strategy owner cannot be empty',
      );
    }

    const updated: StrategyRecord = {
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
      market:
        input.market?.trim().toUpperCase() ??
        current.market,
      audience:
        input.audience?.trim() ?? current.audience,
      opportunityScore:
        input.opportunityScore !== undefined
          ? this.percentage(
              input.opportunityScore,
              'opportunityScore',
            )
          : current.opportunityScore,
      trendScore:
        input.trendScore !== undefined
          ? this.percentage(
              input.trendScore,
              'trendScore',
            )
          : current.trendScore,
      strategicScore:
        input.strategicScore !== undefined
          ? this.percentage(
              input.strategicScore,
              'strategicScore',
            )
          : current.strategicScore,
      confidenceScore:
        input.confidenceScore !== undefined
          ? this.percentage(
              input.confidenceScore,
              'confidenceScore',
            )
          : current.confidenceScore,
      investmentScore:
        input.investmentScore !== undefined
          ? this.percentage(
              input.investmentScore,
              'investmentScore',
            )
          : current.investmentScore,
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
      estimatedViews:
        input.estimatedViews !== undefined
          ? this.nonNegativeInteger(
              input.estimatedViews,
              'estimatedViews',
            )
          : current.estimatedViews,
      expectedGrowthRate:
        input.expectedGrowthRate !== undefined
          ? this.percentage(
              input.expectedGrowthRate,
              'expectedGrowthRate',
            )
          : current.expectedGrowthRate,
      timeframeDays:
        input.timeframeDays !== undefined
          ? this.positiveInteger(
              input.timeframeDays,
              'timeframeDays',
            )
          : current.timeframeDays,
      decision:
        input.decision?.trim() ?? current.decision,
      rationale:
        input.rationale?.trim() ??
        current.rationale,
      tags:
        input.tags !== undefined
          ? this.normalizeList(input.tags)
          : current.tags,
      signals:
        input.signals !== undefined
          ? this.normalizeList(
              input.signals,
              false,
            )
          : current.signals,
      assumptions:
        input.assumptions !== undefined
          ? this.normalizeList(
              input.assumptions,
              false,
            )
          : current.assumptions,
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

  recommendRecord(
    id: string,
    rationale: string,
  ) {
    if (!rationale?.trim()) {
      throw new BadRequestException(
        'Recommendation rationale is required',
      );
    }

    return this.updateRecord(id, {
      status: 'recommended',
      rationale,
    });
  }

  approveRecord(
    id: string,
    decision: string,
  ) {
    if (!decision?.trim()) {
      throw new BadRequestException(
        'Executive decision is required',
      );
    }

    return this.updateRecord(id, {
      status: 'approved',
      decision,
    });
  }

  executeRecord(id: string) {
    const record = this.getRecord(id);

    if (record.status !== 'approved') {
      throw new BadRequestException(
        'Only approved strategies can execute',
      );
    }

    return this.updateRecord(id, {
      status: 'executing',
    });
  }

  completeRecord(id: string) {
    return this.updateRecord(id, {
      status: 'completed',
    });
  }

  rejectRecord(
    id: string,
    rationale: string,
  ) {
    if (!rationale?.trim()) {
      throw new BadRequestException(
        'Rejection rationale is required',
      );
    }

    return this.updateRecord(id, {
      status: 'rejected',
      rationale,
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addSignal(
    id: string,
    signal: string,
  ) {
    const record = this.getRecord(id);
    const normalizedSignal = signal?.trim();

    if (!normalizedSignal) {
      throw new BadRequestException(
        'Signal is required',
      );
    }

    return this.updateRecord(id, {
      signals: [
        ...record.signals,
        normalizedSignal,
      ],
    });
  }

  calculateInvestmentCase(id: string) {
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

    const revenuePerView =
      record.estimatedViews === 0
        ? 0
        : record.estimatedRevenue /
          record.estimatedViews;

    return {
      id: record.id,
      estimatedCost: record.estimatedCost,
      estimatedRevenue:
        record.estimatedRevenue,
      estimatedProfit: Number(
        estimatedProfit.toFixed(2),
      ),
      roi: Number(roi.toFixed(2)),
      revenuePerView: Number(
        revenuePerView.toFixed(4),
      ),
      investmentScore:
        record.investmentScore,
      calculatedAt: new Date().toISOString(),
    };
  }

  analyzeOpportunity(id: string) {
    const record = this.getRecord(id);

    const combinedScore =
      record.opportunityScore * 0.3 +
      record.trendScore * 0.2 +
      record.strategicScore * 0.25 +
      record.confidenceScore * 0.15 +
      record.investmentScore * 0.1;

    const recommendation =
      combinedScore >= 80
        ? 'strong-opportunity'
        : combinedScore >= 60
          ? 'promising-opportunity'
          : combinedScore >= 40
            ? 'monitor'
            : 'low-priority';

    return {
      id: record.id,
      combinedScore: Number(
        combinedScore.toFixed(2),
      ),
      recommendation,
      riskLevel: record.riskLevel,
      signals: record.signals,
      analyzedAt: new Date().toISOString(),
    };
  }

  generateStrategicPlan(id: string) {
    const record = this.getRecord(id);

    const phases = [
      {
        phase: 1,
        name: 'Research',
        days: Math.max(
          1,
          Math.round(record.timeframeDays * 0.15),
        ),
      },
      {
        phase: 2,
        name: 'Validation',
        days: Math.max(
          1,
          Math.round(record.timeframeDays * 0.2),
        ),
      },
      {
        phase: 3,
        name: 'Production',
        days: Math.max(
          1,
          Math.round(record.timeframeDays * 0.4),
        ),
      },
      {
        phase: 4,
        name: 'Launch',
        days: Math.max(
          1,
          Math.round(record.timeframeDays * 0.15),
        ),
      },
      {
        phase: 5,
        name: 'Optimization',
        days: Math.max(
          1,
          Math.round(record.timeframeDays * 0.1),
        ),
      },
    ];

    return {
      id: record.id,
      name: record.name,
      market: record.market,
      audience: record.audience,
      timeframeDays: record.timeframeDays,
      phases,
      assumptions: record.assumptions,
      generatedAt: new Date().toISOString(),
    };
  }

  getExecutiveSummary(id: string) {
    const record = this.getRecord(id);
    const opportunity =
      this.analyzeOpportunity(id);
    const investment =
      this.calculateInvestmentCase(id);

    return {
      id: record.id,
      name: record.name,
      status: record.status,
      priority: record.priority,
      riskLevel: record.riskLevel,
      decision: record.decision,
      rationale: record.rationale,
      opportunity,
      investment,
      recommendedAction:
        opportunity.combinedScore >= 70 &&
        investment.estimatedProfit > 0
          ? 'approve'
          : opportunity.combinedScore >= 50
            ? 'review'
            : 'defer',
      generatedAt: new Date().toISOString(),
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

  private positiveInteger(
    value: number,
    field: string,
  ) {
    if (
      !Number.isInteger(value) ||
      value < 1
    ) {
      throw new BadRequestException(
        `${field} must be a positive integer`,
      );
    }

    return value;
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
