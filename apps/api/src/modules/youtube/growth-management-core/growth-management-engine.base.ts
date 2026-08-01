import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type GrowthRecordStatus =
  | 'draft'
  | 'planned'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type GrowthRecordPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface GrowthRecord {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: GrowthRecordStatus;
  priority: GrowthRecordPriority;
  score: number;
  progress: number;
  targetValue: number;
  currentValue: number;
  startAt?: string;
  endAt?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGrowthRecordInput {
  title: string;
  description?: string;
  category: string;
  status?: GrowthRecordStatus;
  priority?: GrowthRecordPriority;
  score?: number;
  progress?: number;
  targetValue?: number;
  currentValue?: number;
  startAt?: string;
  endAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateGrowthRecordInput {
  title?: string;
  description?: string;
  category?: string;
  status?: GrowthRecordStatus;
  priority?: GrowthRecordPriority;
  score?: number;
  progress?: number;
  targetValue?: number;
  currentValue?: number;
  startAt?: string;
  endAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface GrowthDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalRecords: number;
  runningRecords: number;
  completedRecords: number;
  criticalRecords: number;
  averageScore: number;
  averageProgress: number;
  totalTargetValue: number;
  totalCurrentValue: number;
  achievementRate: number;
  updatedAt: string;
}

export abstract class GrowthManagementEngineBase {
  private readonly records =
    new Map<string, GrowthRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard(): GrowthDashboard {
    const records = [...this.records.values()];

    const totalTargetValue = records.reduce(
      (total, record) =>
        total + record.targetValue,
      0,
    );

    const totalCurrentValue = records.reduce(
      (total, record) =>
        total + record.currentValue,
      0,
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

    const averageProgress =
      records.length === 0
        ? 0
        : Number(
            (
              records.reduce(
                (total, record) =>
                  total + record.progress,
                0,
              ) / records.length
            ).toFixed(2),
          );

    const achievementRate =
      totalTargetValue <= 0
        ? 0
        : Number(
            Math.min(
              100,
              (totalCurrentValue /
                totalTargetValue) *
                100,
            ).toFixed(2),
          );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalRecords: records.length,
      runningRecords: records.filter(
        (record) => record.status === 'running',
      ).length,
      completedRecords: records.filter(
        (record) =>
          record.status === 'completed',
      ).length,
      criticalRecords: records.filter(
        (record) =>
          record.priority === 'critical',
      ).length,
      averageScore,
      averageProgress,
      totalTargetValue,
      totalCurrentValue,
      achievementRate,
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateGrowthRecordInput,
  ): GrowthRecord {
    const title = input.title?.trim();
    const category = input.category?.trim();

    if (!title) {
      throw new BadRequestException(
        'Record title is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Record category is required',
      );
    }

    const targetValue = this.normalizePositiveNumber(
      input.targetValue ?? 100,
      'targetValue',
    );

    const currentValue = this.normalizePositiveNumber(
      input.currentValue ?? 0,
      'currentValue',
    );

    const progress =
      input.progress !== undefined
        ? this.normalizePercentage(
            input.progress,
            'progress',
          )
        : this.calculateProgress(
            currentValue,
            targetValue,
          );

    const now = new Date().toISOString();

    const record: GrowthRecord = {
      id: randomUUID(),
      title,
      description: input.description?.trim(),
      category,
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      score: this.normalizePercentage(
        input.score ?? 50,
        'score',
      ),
      progress,
      targetValue,
      currentValue,
      startAt: this.normalizeDate(input.startAt),
      endAt: this.normalizeDate(input.endAt),
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: GrowthRecordStatus;
    priority?: GrowthRecordPriority;
    category?: string;
    search?: string;
    minimumScore?: number;
  }): GrowthRecord[] {
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
        if (second.score !== first.score) {
          return second.score - first.score;
        }

        return (
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime()
        );
      });
  }

  getRecord(id: string): GrowthRecord {
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
    input: UpdateGrowthRecordInput,
  ): GrowthRecord {
    const current = this.getRecord(id);

    if (
      input.title !== undefined &&
      !input.title.trim()
    ) {
      throw new BadRequestException(
        'Record title cannot be empty',
      );
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new BadRequestException(
        'Record category cannot be empty',
      );
    }

    const targetValue =
      input.targetValue !== undefined
        ? this.normalizePositiveNumber(
            input.targetValue,
            'targetValue',
          )
        : current.targetValue;

    const currentValue =
      input.currentValue !== undefined
        ? this.normalizePositiveNumber(
            input.currentValue,
            'currentValue',
          )
        : current.currentValue;

    const progress =
      input.progress !== undefined
        ? this.normalizePercentage(
            input.progress,
            'progress',
          )
        : this.calculateProgress(
            currentValue,
            targetValue,
          );

    const updated: GrowthRecord = {
      ...current,
      ...input,
      title: input.title?.trim() ?? current.title,
      description:
        input.description?.trim() ??
        current.description,
      category:
        input.category?.trim() ?? current.category,
      score:
        input.score !== undefined
          ? this.normalizePercentage(
              input.score,
              'score',
            )
          : current.score,
      progress,
      targetValue,
      currentValue,
      startAt:
        input.startAt !== undefined
          ? this.normalizeDate(input.startAt)
          : current.startAt,
      endAt:
        input.endAt !== undefined
          ? this.normalizeDate(input.endAt)
          : current.endAt,
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

  planRecord(id: string): GrowthRecord {
    return this.updateRecord(id, {
      status: 'planned',
    });
  }

  startRecord(id: string): GrowthRecord {
    const current = this.getRecord(id);

    return this.updateRecord(id, {
      status: 'running',
      startAt:
        current.startAt ??
        new Date().toISOString(),
    });
  }

  pauseRecord(id: string): GrowthRecord {
    const record = this.getRecord(id);

    if (record.status !== 'running') {
      throw new BadRequestException(
        'Only running records can be paused',
      );
    }

    return this.updateRecord(id, {
      status: 'paused',
    });
  }

  completeRecord(id: string): GrowthRecord {
    const current = this.getRecord(id);

    const updated: GrowthRecord = {
      ...current,
      status: 'completed',
      progress: 100,
      currentValue: Math.max(
        current.currentValue,
        current.targetValue,
      ),
      endAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);

    return updated;
  }

  cancelRecord(id: string): GrowthRecord {
    return this.updateRecord(id, {
      status: 'cancelled',
    });
  }

  recordProgress(
    id: string,
    currentValue: number,
  ): GrowthRecord {
    const record = this.getRecord(id);

    const normalizedCurrentValue =
      this.normalizePositiveNumber(
        currentValue,
        'currentValue',
      );

    const progress = this.calculateProgress(
      normalizedCurrentValue,
      record.targetValue,
    );

    if (progress >= 100) {
      const updated = this.updateRecord(id, {
        currentValue: normalizedCurrentValue,
      });

      return this.completeRecord(updated.id);
    }

    return this.updateRecord(id, {
      currentValue: normalizedCurrentValue,
      progress,
    });
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

  getTopRecords(limit = 10): GrowthRecord[] {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(0, safeLimit);
  }

  analyzeValues(values: number[]) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new BadRequestException(
        'At least one value is required',
      );
    }

    const normalizedValues = values.map(
      (value, index) => {
        if (!Number.isFinite(value)) {
          throw new BadRequestException(
            `Value ${index + 1} is invalid`,
          );
        }

        return value;
      },
    );

    const total = normalizedValues.reduce(
      (sum, value) => sum + value,
      0,
    );

    const average = total / normalizedValues.length;
    const minimum = Math.min(...normalizedValues);
    const maximum = Math.max(...normalizedValues);

    const firstValue = normalizedValues[0] ?? 0;
    const lastValue =
      normalizedValues[
        normalizedValues.length - 1
      ] ?? 0;

    const growth =
      firstValue === 0
        ? lastValue > 0
          ? 100
          : 0
        : ((lastValue - firstValue) /
            Math.abs(firstValue)) *
          100;

    return {
      engine: this.engineName,
      count: normalizedValues.length,
      total: Number(total.toFixed(2)),
      average: Number(average.toFixed(2)),
      minimum,
      maximum,
      growth: Number(growth.toFixed(2)),
      trend:
        lastValue > firstValue
          ? 'up'
          : lastValue < firstValue
            ? 'down'
            : 'stable',
      analyzedAt: new Date().toISOString(),
    };
  }

  generateRecommendations(
    id: string,
  ): string[] {
    const record = this.getRecord(id);
    const recommendations: string[] = [];

    if (record.score < 50) {
      recommendations.push(
        'Improve the strategy score before scaling',
      );
    }

    if (record.progress < 25) {
      recommendations.push(
        'Define and execute the next growth milestone',
      );
    }

    if (
      record.priority === 'critical' &&
      record.status === 'draft'
    ) {
      recommendations.push(
        'Move the critical record into planning',
      );
    }

    if (!record.startAt) {
      recommendations.push(
        'Assign a start date',
      );
    }

    if (record.targetValue <= 0) {
      recommendations.push(
        'Assign a measurable target',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Growth activity is progressing normally',
      );
    }

    return recommendations;
  }

  private calculateProgress(
    currentValue: number,
    targetValue: number,
  ): number {
    if (targetValue <= 0) {
      return 0;
    }

    return Number(
      Math.min(
        100,
        Math.max(
          0,
          (currentValue / targetValue) * 100,
        ),
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

    return Math.max(0, Math.min(100, value));
  }

  private normalizePositiveNumber(
    value: number,
    field: string,
  ): number {
    if (!Number.isFinite(value) || value < 0) {
      throw new BadRequestException(
        `${field} must be zero or greater`,
      );
    }

    return value;
  }

  private normalizeDate(
    value?: string,
  ): string | undefined {
    if (!value) {
      return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        'Invalid date value',
      );
    }

    return date.toISOString();
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
