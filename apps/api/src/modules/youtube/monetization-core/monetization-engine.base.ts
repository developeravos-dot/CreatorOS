import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type MonetizationStatus =
  | 'draft'
  | 'planned'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type MonetizationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type MonetizationCurrency =
  | 'USD'
  | 'AED'
  | 'EUR'
  | 'GBP';

export interface MonetizationRecord {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: MonetizationStatus;
  priority: MonetizationPriority;
  currency: MonetizationCurrency;
  revenue: number;
  cost: number;
  targetRevenue: number;
  conversionRate: number;
  score: number;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMonetizationRecordInput {
  title: string;
  description?: string;
  category: string;
  status?: MonetizationStatus;
  priority?: MonetizationPriority;
  currency?: MonetizationCurrency;
  revenue?: number;
  cost?: number;
  targetRevenue?: number;
  conversionRate?: number;
  score?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateMonetizationRecordInput {
  title?: string;
  description?: string;
  category?: string;
  status?: MonetizationStatus;
  priority?: MonetizationPriority;
  currency?: MonetizationCurrency;
  revenue?: number;
  cost?: number;
  targetRevenue?: number;
  conversionRate?: number;
  score?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface MonetizationDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalRecords: number;
  activeRecords: number;
  completedRecords: number;
  criticalRecords: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalTargetRevenue: number;
  achievementRate: number;
  averageConversionRate: number;
  averageScore: number;
  updatedAt: string;
}

export abstract class MonetizationEngineBase {
  private readonly records =
    new Map<string, MonetizationRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard(): MonetizationDashboard {
    const records = [...this.records.values()];

    const totalRevenue = records.reduce(
      (total, record) => total + record.revenue,
      0,
    );

    const totalCost = records.reduce(
      (total, record) => total + record.cost,
      0,
    );

    const totalTargetRevenue = records.reduce(
      (total, record) =>
        total + record.targetRevenue,
      0,
    );

    const averageConversionRate =
      records.length === 0
        ? 0
        : Number(
            (
              records.reduce(
                (total, record) =>
                  total + record.conversionRate,
                0,
              ) / records.length
            ).toFixed(2),
          );

    const averageScore =
      records.length === 0
        ? 0
        : Number(
            (
              records.reduce(
                (total, record) =>
                  total + record.score,
                0,
              ) / records.length
            ).toFixed(2),
          );

    const achievementRate =
      totalTargetRevenue <= 0
        ? 0
        : Number(
            Math.min(
              100,
              (totalRevenue /
                totalTargetRevenue) *
                100,
            ).toFixed(2),
          );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalRecords: records.length,
      activeRecords: records.filter(
        (record) => record.status === 'active',
      ).length,
      completedRecords: records.filter(
        (record) =>
          record.status === 'completed',
      ).length,
      criticalRecords: records.filter(
        (record) =>
          record.priority === 'critical',
      ).length,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      totalProfit: Number(
        (totalRevenue - totalCost).toFixed(2),
      ),
      totalTargetRevenue: Number(
        totalTargetRevenue.toFixed(2),
      ),
      achievementRate,
      averageConversionRate,
      averageScore,
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMonetizationRecordInput,
  ): MonetizationRecord {
    const title = input.title?.trim();
    const category = input.category?.trim();

    if (!title) {
      throw new BadRequestException(
        'Monetization record title is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Monetization category is required',
      );
    }

    const now = new Date().toISOString();

    const record: MonetizationRecord = {
      id: randomUUID(),
      title,
      description: input.description?.trim(),
      category,
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      currency: input.currency ?? 'USD',
      revenue: this.normalizeMoney(
        input.revenue ?? 0,
        'revenue',
      ),
      cost: this.normalizeMoney(
        input.cost ?? 0,
        'cost',
      ),
      targetRevenue: this.normalizeMoney(
        input.targetRevenue ?? 1000,
        'targetRevenue',
      ),
      conversionRate: this.normalizePercentage(
        input.conversionRate ?? 0,
        'conversionRate',
      ),
      score: this.normalizePercentage(
        input.score ?? 50,
        'score',
      ),
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: MonetizationStatus;
    priority?: MonetizationPriority;
    category?: string;
    currency?: MonetizationCurrency;
    search?: string;
    minimumRevenue?: number;
    minimumScore?: number;
  }): MonetizationRecord[] {
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
          filters?.category &&
          record.category !== filters.category
        ) {
          return false;
        }

        if (
          filters?.currency &&
          record.currency !== filters.currency
        ) {
          return false;
        }

        if (
          filters?.minimumRevenue !== undefined &&
          record.revenue < filters.minimumRevenue
        ) {
          return false;
        }

        if (
          filters?.minimumScore !== undefined &&
          record.score < filters.minimumScore
        ) {
          return false;
        }

        if (search) {
          const searchableText = [
            record.title,
            record.description ?? '',
            record.category,
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
        const firstProfit =
          first.revenue - first.cost;
        const secondProfit =
          second.revenue - second.cost;

        if (secondProfit !== firstProfit) {
          return secondProfit - firstProfit;
        }

        return second.score - first.score;
      });
  }

  getRecord(id: string): MonetizationRecord {
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
    input: UpdateMonetizationRecordInput,
  ): MonetizationRecord {
    const current = this.getRecord(id);

    if (
      input.title !== undefined &&
      !input.title.trim()
    ) {
      throw new BadRequestException(
        'Monetization title cannot be empty',
      );
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new BadRequestException(
        'Monetization category cannot be empty',
      );
    }

    const updated: MonetizationRecord = {
      ...current,
      ...input,
      title: input.title?.trim() ?? current.title,
      description:
        input.description?.trim() ??
        current.description,
      category:
        input.category?.trim() ?? current.category,
      revenue:
        input.revenue !== undefined
          ? this.normalizeMoney(
              input.revenue,
              'revenue',
            )
          : current.revenue,
      cost:
        input.cost !== undefined
          ? this.normalizeMoney(
              input.cost,
              'cost',
            )
          : current.cost,
      targetRevenue:
        input.targetRevenue !== undefined
          ? this.normalizeMoney(
              input.targetRevenue,
              'targetRevenue',
            )
          : current.targetRevenue,
      conversionRate:
        input.conversionRate !== undefined
          ? this.normalizePercentage(
              input.conversionRate,
              'conversionRate',
            )
          : current.conversionRate,
      score:
        input.score !== undefined
          ? this.normalizePercentage(
              input.score,
              'score',
            )
          : current.score,
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

  planRecord(id: string): MonetizationRecord {
    return this.updateRecord(id, {
      status: 'planned',
    });
  }

  activateRecord(id: string): MonetizationRecord {
    return this.updateRecord(id, {
      status: 'active',
    });
  }

  pauseRecord(id: string): MonetizationRecord {
    const record = this.getRecord(id);

    if (record.status !== 'active') {
      throw new BadRequestException(
        'Only active records can be paused',
      );
    }

    return this.updateRecord(id, {
      status: 'paused',
    });
  }

  completeRecord(id: string): MonetizationRecord {
    return this.updateRecord(id, {
      status: 'completed',
    });
  }

  cancelRecord(id: string): MonetizationRecord {
    return this.updateRecord(id, {
      status: 'cancelled',
    });
  }

  addRevenue(
    id: string,
    amount: number,
  ): MonetizationRecord {
    const record = this.getRecord(id);

    const normalizedAmount = this.normalizeMoney(
      amount,
      'amount',
    );

    return this.updateRecord(id, {
      revenue: record.revenue + normalizedAmount,
    });
  }

  addCost(
    id: string,
    amount: number,
  ): MonetizationRecord {
    const record = this.getRecord(id);

    const normalizedAmount = this.normalizeMoney(
      amount,
      'amount',
    );

    return this.updateRecord(id, {
      cost: record.cost + normalizedAmount,
    });
  }

  getFinancialSummary(id: string) {
    const record = this.getRecord(id);

    const profit = record.revenue - record.cost;

    const margin =
      record.revenue <= 0
        ? 0
        : (profit / record.revenue) * 100;

    const achievementRate =
      record.targetRevenue <= 0
        ? 0
        : Math.min(
            100,
            (record.revenue /
              record.targetRevenue) *
              100,
          );

    return {
      id: record.id,
      currency: record.currency,
      revenue: record.revenue,
      cost: record.cost,
      profit: Number(profit.toFixed(2)),
      margin: Number(margin.toFixed(2)),
      targetRevenue: record.targetRevenue,
      achievementRate: Number(
        achievementRate.toFixed(2),
      ),
      profitable: profit > 0,
    };
  }

  forecastRevenue(
    currentRevenue: number,
    growthRate: number,
    periods: number,
  ) {
    const normalizedRevenue = this.normalizeMoney(
      currentRevenue,
      'currentRevenue',
    );

    if (!Number.isFinite(growthRate)) {
      throw new BadRequestException(
        'growthRate must be a valid number',
      );
    }

    if (
      !Number.isInteger(periods) ||
      periods < 1 ||
      periods > 120
    ) {
      throw new BadRequestException(
        'periods must be between 1 and 120',
      );
    }

    const forecast: Array<{
      period: number;
      revenue: number;
    }> = [];

    let revenue = normalizedRevenue;

    for (let period = 1; period <= periods; period += 1) {
      revenue *= 1 + growthRate / 100;

      forecast.push({
        period,
        revenue: Number(revenue.toFixed(2)),
      });
    }

    return {
      engine: this.engineName,
      currentRevenue: normalizedRevenue,
      growthRate,
      periods,
      forecast,
      finalRevenue:
        forecast[forecast.length - 1]?.revenue ??
        normalizedRevenue,
      generatedAt: new Date().toISOString(),
    };
  }

  generateRecommendations(
    id: string,
  ): string[] {
    const record = this.getRecord(id);
    const summary = this.getFinancialSummary(id);
    const recommendations: string[] = [];

    if (record.revenue === 0) {
      recommendations.push(
        'Activate the first revenue channel',
      );
    }

    if (summary.profit < 0) {
      recommendations.push(
        'Reduce costs or improve monetization revenue',
      );
    }

    if (record.conversionRate < 2) {
      recommendations.push(
        'Improve the conversion funnel',
      );
    }

    if (summary.achievementRate < 25) {
      recommendations.push(
        'Create a measurable revenue growth plan',
      );
    }

    if (record.score < 50) {
      recommendations.push(
        'Improve monetization readiness before scaling',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Monetization performance is progressing normally',
      );
    }

    return recommendations;
  }

  getTopRecords(
    limit = 10,
  ): MonetizationRecord[] {
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

  private normalizeMoney(
    value: number,
    field: string,
  ): number {
    if (!Number.isFinite(value) || value < 0) {
      throw new BadRequestException(
        `${field} must be zero or greater`,
      );
    }

    return Number(value.toFixed(2));
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
