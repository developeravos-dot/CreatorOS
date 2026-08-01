import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type ProductionStatus =
  | 'idea'
  | 'draft'
  | 'in-production'
  | 'review'
  | 'ready'
  | 'published'
  | 'cancelled';

export type ProductionPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type ProductionAssetType =
  | 'idea'
  | 'script'
  | 'voice'
  | 'video'
  | 'image'
  | 'audio'
  | 'document'
  | 'other';

export interface ProductionRecord {
  id: string;
  title: string;
  description?: string;
  category: string;
  assetType: ProductionAssetType;
  status: ProductionStatus;
  priority: ProductionPriority;
  score: number;
  progress: number;
  durationSeconds: number;
  language: string;
  fileUrl?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductionRecordInput {
  title: string;
  description?: string;
  category: string;
  assetType?: ProductionAssetType;
  status?: ProductionStatus;
  priority?: ProductionPriority;
  score?: number;
  progress?: number;
  durationSeconds?: number;
  language?: string;
  fileUrl?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateProductionRecordInput {
  title?: string;
  description?: string;
  category?: string;
  assetType?: ProductionAssetType;
  status?: ProductionStatus;
  priority?: ProductionPriority;
  score?: number;
  progress?: number;
  durationSeconds?: number;
  language?: string;
  fileUrl?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface ProductionDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalRecords: number;
  inProductionRecords: number;
  reviewRecords: number;
  readyRecords: number;
  publishedRecords: number;
  criticalRecords: number;
  averageScore: number;
  averageProgress: number;
  totalDurationSeconds: number;
  updatedAt: string;
}

export abstract class ContentProductionEngineBase {
  private readonly records =
    new Map<string, ProductionRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard(): ProductionDashboard {
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

    const totalDurationSeconds =
      records.reduce(
        (total, record) =>
          total + record.durationSeconds,
        0,
      );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalRecords: records.length,
      inProductionRecords: records.filter(
        (record) =>
          record.status === 'in-production',
      ).length,
      reviewRecords: records.filter(
        (record) => record.status === 'review',
      ).length,
      readyRecords: records.filter(
        (record) => record.status === 'ready',
      ).length,
      publishedRecords: records.filter(
        (record) => record.status === 'published',
      ).length,
      criticalRecords: records.filter(
        (record) =>
          record.priority === 'critical',
      ).length,
      averageScore,
      averageProgress,
      totalDurationSeconds,
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateProductionRecordInput,
  ): ProductionRecord {
    const title = input.title?.trim();
    const category = input.category?.trim();

    if (!title) {
      throw new BadRequestException(
        'Production title is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Production category is required',
      );
    }

    const now = new Date().toISOString();

    const record: ProductionRecord = {
      id: randomUUID(),
      title,
      description: input.description?.trim(),
      category,
      assetType: input.assetType ?? 'other',
      status: input.status ?? 'idea',
      priority: input.priority ?? 'medium',
      score: this.normalizePercentage(
        input.score ?? 50,
        'score',
      ),
      progress: this.normalizePercentage(
        input.progress ?? 0,
        'progress',
      ),
      durationSeconds: this.normalizeDuration(
        input.durationSeconds ?? 0,
      ),
      language:
        input.language?.trim().toLowerCase() ??
        'en',
      fileUrl: input.fileUrl?.trim(),
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: ProductionStatus;
    priority?: ProductionPriority;
    category?: string;
    assetType?: ProductionAssetType;
    language?: string;
    search?: string;
    minimumScore?: number;
  }): ProductionRecord[] {
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
          filters?.assetType &&
          record.assetType !== filters.assetType
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
            record.assetType,
            record.language,
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

  getRecord(id: string): ProductionRecord {
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
    input: UpdateProductionRecordInput,
  ): ProductionRecord {
    const current = this.getRecord(id);

    if (
      input.title !== undefined &&
      !input.title.trim()
    ) {
      throw new BadRequestException(
        'Production title cannot be empty',
      );
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new BadRequestException(
        'Production category cannot be empty',
      );
    }

    const updated: ProductionRecord = {
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
      progress:
        input.progress !== undefined
          ? this.normalizePercentage(
              input.progress,
              'progress',
            )
          : current.progress,
      durationSeconds:
        input.durationSeconds !== undefined
          ? this.normalizeDuration(
              input.durationSeconds,
            )
          : current.durationSeconds,
      language:
        input.language?.trim().toLowerCase() ??
        current.language,
      fileUrl:
        input.fileUrl?.trim() ?? current.fileUrl,
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

  moveToDraft(id: string): ProductionRecord {
    return this.updateRecord(id, {
      status: 'draft',
      progress: 10,
    });
  }

  startProduction(id: string): ProductionRecord {
    return this.updateRecord(id, {
      status: 'in-production',
      progress: 25,
    });
  }

  sendToReview(id: string): ProductionRecord {
    const record = this.getRecord(id);

    if (record.status !== 'in-production') {
      throw new BadRequestException(
        'Only in-production records can be reviewed',
      );
    }

    return this.updateRecord(id, {
      status: 'review',
      progress: 75,
    });
  }

  markReady(id: string): ProductionRecord {
    return this.updateRecord(id, {
      status: 'ready',
      progress: 100,
    });
  }

  publishRecord(id: string): ProductionRecord {
    const record = this.getRecord(id);

    if (
      record.status !== 'ready' &&
      record.status !== 'review'
    ) {
      throw new BadRequestException(
        'Only ready or reviewed records can be published',
      );
    }

    return this.updateRecord(id, {
      status: 'published',
      progress: 100,
    });
  }

  cancelRecord(id: string): ProductionRecord {
    return this.updateRecord(id, {
      status: 'cancelled',
    });
  }

  updateProgress(
    id: string,
    progress: number,
  ): ProductionRecord {
    const normalizedProgress =
      this.normalizePercentage(
        progress,
        'progress',
      );

    if (normalizedProgress === 100) {
      return this.markReady(id);
    }

    return this.updateRecord(id, {
      progress: normalizedProgress,
    });
  }

  attachFile(
    id: string,
    fileUrl: string,
  ): ProductionRecord {
    const normalizedUrl = fileUrl?.trim();

    if (!normalizedUrl) {
      throw new BadRequestException(
        'File URL is required',
      );
    }

    return this.updateRecord(id, {
      fileUrl: normalizedUrl,
    });
  }

  generateOutline(
    topic: string,
    sections = 5,
  ) {
    const normalizedTopic = topic?.trim();

    if (!normalizedTopic) {
      throw new BadRequestException(
        'Topic is required',
      );
    }

    const safeSections = Math.max(
      3,
      Math.min(12, Number(sections) || 5),
    );

    const outline = Array.from(
      { length: safeSections },
      (_, index) => ({
        order: index + 1,
        heading:
          index === 0
            ? `Hook: ${normalizedTopic}`
            : index === safeSections - 1
              ? `Conclusion: ${normalizedTopic}`
              : `Section ${index + 1}: ${normalizedTopic}`,
        purpose:
          index === 0
            ? 'Capture audience attention'
            : index === safeSections - 1
              ? 'Summarize and create a call to action'
              : 'Develop the main content',
      }),
    );

    return {
      engine: this.engineName,
      topic: normalizedTopic,
      sections: safeSections,
      outline,
      generatedAt: new Date().toISOString(),
    };
  }

  estimateProduction(
    words: number,
    wordsPerMinute = 150,
  ) {
    if (
      !Number.isFinite(words) ||
      words < 0
    ) {
      throw new BadRequestException(
        'words must be zero or greater',
      );
    }

    if (
      !Number.isFinite(wordsPerMinute) ||
      wordsPerMinute <= 0
    ) {
      throw new BadRequestException(
        'wordsPerMinute must be greater than zero',
      );
    }

    const durationMinutes =
      words / wordsPerMinute;

    const durationSeconds = Math.ceil(
      durationMinutes * 60,
    );

    return {
      words,
      wordsPerMinute,
      durationMinutes: Number(
        durationMinutes.toFixed(2),
      ),
      durationSeconds,
      estimatedAt: new Date().toISOString(),
    };
  }

  generateRecommendations(
    id: string,
  ): string[] {
    const record = this.getRecord(id);
    const recommendations: string[] = [];

    if (record.score < 50) {
      recommendations.push(
        'Improve the content quality score',
      );
    }

    if (record.progress < 25) {
      recommendations.push(
        'Move the asset into active production',
      );
    }

    if (!record.fileUrl) {
      recommendations.push(
        'Attach the generated production asset',
      );
    }

    if (record.durationSeconds === 0) {
      recommendations.push(
        'Define the expected content duration',
      );
    }

    if (record.tags.length === 0) {
      recommendations.push(
        'Add searchable production tags',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Production asset is progressing normally',
      );
    }

    return recommendations;
  }

  getTopRecords(limit = 10): ProductionRecord[] {
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

  private normalizeDuration(
    value: number,
  ): number {
    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      throw new BadRequestException(
        'durationSeconds must be zero or greater',
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
