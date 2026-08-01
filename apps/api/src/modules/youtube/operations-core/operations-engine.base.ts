import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type OperationStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type OperationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface OperationRecord {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: OperationStatus;
  priority: OperationPriority;
  score: number;
  progress: number;
  scheduledAt?: string;
  completedAt?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOperationInput {
  title: string;
  description?: string;
  category: string;
  status?: OperationStatus;
  priority?: OperationPriority;
  score?: number;
  progress?: number;
  scheduledAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateOperationInput {
  title?: string;
  description?: string;
  category?: string;
  status?: OperationStatus;
  priority?: OperationPriority;
  score?: number;
  progress?: number;
  scheduledAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface OperationsDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalRecords: number;
  activeRecords: number;
  scheduledRecords: number;
  completedRecords: number;
  criticalRecords: number;
  averageScore: number;
  averageProgress: number;
  updatedAt: string;
}

export abstract class OperationsEngineBase {
  private readonly records =
    new Map<string, OperationRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard(): OperationsDashboard {
    const records = [...this.records.values()];

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

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalRecords: records.length,
      activeRecords: records.filter(
        (record) => record.status === 'active',
      ).length,
      scheduledRecords: records.filter(
        (record) => record.status === 'scheduled',
      ).length,
      completedRecords: records.filter(
        (record) => record.status === 'completed',
      ).length,
      criticalRecords: records.filter(
        (record) => record.priority === 'critical',
      ).length,
      averageScore,
      averageProgress,
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateOperationInput,
  ): OperationRecord {
    const title = input.title?.trim();
    const category = input.category?.trim();

    if (!title) {
      throw new BadRequestException(
        'Operation title is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Operation category is required',
      );
    }

    const now = new Date().toISOString();

    const record: OperationRecord = {
      id: randomUUID(),
      title,
      description: input.description?.trim(),
      category,
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      score: this.normalizeNumber(
        input.score ?? 50,
        'score',
      ),
      progress: this.normalizeNumber(
        input.progress ?? 0,
        'progress',
      ),
      scheduledAt: this.normalizeDate(
        input.scheduledAt,
      ),
      completedAt: undefined,
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: OperationStatus;
    priority?: OperationPriority;
    category?: string;
    search?: string;
    minimumScore?: number;
  }): OperationRecord[] {
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
          const text = [
            record.title,
            record.description ?? '',
            record.category,
            ...record.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!text.includes(search)) {
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

  getRecord(id: string): OperationRecord {
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
    input: UpdateOperationInput,
  ): OperationRecord {
    const current = this.getRecord(id);

    if (
      input.title !== undefined &&
      !input.title.trim()
    ) {
      throw new BadRequestException(
        'Operation title cannot be empty',
      );
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new BadRequestException(
        'Operation category cannot be empty',
      );
    }

    const updated: OperationRecord = {
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
          ? this.normalizeNumber(
              input.score,
              'score',
            )
          : current.score,
      progress:
        input.progress !== undefined
          ? this.normalizeNumber(
              input.progress,
              'progress',
            )
          : current.progress,
      scheduledAt:
        input.scheduledAt !== undefined
          ? this.normalizeDate(input.scheduledAt)
          : current.scheduledAt,
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

  scheduleRecord(
    id: string,
    scheduledAt: string,
  ): OperationRecord {
    const normalizedDate =
      this.normalizeDate(scheduledAt);

    if (!normalizedDate) {
      throw new BadRequestException(
        'Scheduled date is required',
      );
    }

    return this.updateRecord(id, {
      status: 'scheduled',
      scheduledAt: normalizedDate,
    });
  }

  activateRecord(id: string): OperationRecord {
    return this.updateRecord(id, {
      status: 'active',
    });
  }

  pauseRecord(id: string): OperationRecord {
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

  completeRecord(id: string): OperationRecord {
    const current = this.getRecord(id);
    const now = new Date().toISOString();

    const updated: OperationRecord = {
      ...current,
      status: 'completed',
      progress: 100,
      completedAt: now,
      updatedAt: now,
    };

    this.records.set(id, updated);

    return updated;
  }

  cancelRecord(id: string): OperationRecord {
    return this.updateRecord(id, {
      status: 'cancelled',
    });
  }

  updateProgress(
    id: string,
    progress: number,
  ): OperationRecord {
    const normalizedProgress =
      this.normalizeNumber(progress, 'progress');

    if (normalizedProgress === 100) {
      return this.completeRecord(id);
    }

    return this.updateRecord(id, {
      progress: normalizedProgress,
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

  getTopRecords(limit = 10): OperationRecord[] {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(0, safeLimit);
  }

  analyzeMetrics(values: number[]) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new BadRequestException(
        'At least one metric value is required',
      );
    }

    const normalizedValues = values.map(
      (value, index) => {
        if (!Number.isFinite(value)) {
          throw new BadRequestException(
            `Metric ${index + 1} is invalid`,
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

    const trend =
      normalizedValues.length < 2
        ? 'stable'
        : normalizedValues[
              normalizedValues.length - 1
            ]! > normalizedValues[0]!
          ? 'up'
          : normalizedValues[
                normalizedValues.length - 1
              ]! < normalizedValues[0]!
            ? 'down'
            : 'stable';

    return {
      engine: this.engineName,
      count: normalizedValues.length,
      total: Number(total.toFixed(2)),
      average: Number(average.toFixed(2)),
      minimum,
      maximum,
      trend,
      analyzedAt: new Date().toISOString(),
    };
  }

  generateRecommendations(
    recordId: string,
  ): string[] {
    const record = this.getRecord(recordId);
    const recommendations: string[] = [];

    if (record.score < 50) {
      recommendations.push(
        'Improve the operation score before execution',
      );
    }

    if (record.progress < 25) {
      recommendations.push(
        'Define the next executable milestone',
      );
    }

    if (
      record.priority === 'critical' &&
      record.status === 'draft'
    ) {
      recommendations.push(
        'Schedule or activate this critical operation',
      );
    }

    if (!record.scheduledAt) {
      recommendations.push(
        'Assign a target execution date',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Operation is progressing normally',
      );
    }

    return recommendations;
  }

  private normalizeNumber(
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
