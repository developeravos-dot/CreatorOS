import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type IntelligenceSignalStatus =
  | 'detected'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'completed';

export type IntelligenceSignalPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface IntelligenceSignal {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: IntelligenceSignalStatus;
  priority: IntelligenceSignalPriority;
  score: number;
  source?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntelligenceSignalInput {
  title: string;
  description?: string;
  category: string;
  status?: IntelligenceSignalStatus;
  priority?: IntelligenceSignalPriority;
  score?: number;
  source?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateIntelligenceSignalInput {
  title?: string;
  description?: string;
  category?: string;
  status?: IntelligenceSignalStatus;
  priority?: IntelligenceSignalPriority;
  score?: number;
  source?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface IntelligenceDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalSignals: number;
  averageScore: number;
  criticalSignals: number;
  approvedSignals: number;
  totalsByStatus: Record<IntelligenceSignalStatus, number>;
  updatedAt: string;
}

export abstract class IntelligenceEngineBase {
  private readonly signals =
    new Map<string, IntelligenceSignal>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard(): IntelligenceDashboard {
    const signals = [...this.signals.values()];

    const averageScore =
      signals.length === 0
        ? 0
        : Number(
            (
              signals.reduce(
                (total, signal) => total + signal.score,
                0,
              ) / signals.length
            ).toFixed(2),
          );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalSignals: signals.length,
      averageScore,
      criticalSignals: signals.filter(
        (signal) => signal.priority === 'critical',
      ).length,
      approvedSignals: signals.filter(
        (signal) => signal.status === 'approved',
      ).length,
      totalsByStatus: {
        detected: signals.filter(
          (signal) => signal.status === 'detected',
        ).length,
        reviewing: signals.filter(
          (signal) => signal.status === 'reviewing',
        ).length,
        approved: signals.filter(
          (signal) => signal.status === 'approved',
        ).length,
        rejected: signals.filter(
          (signal) => signal.status === 'rejected',
        ).length,
        completed: signals.filter(
          (signal) => signal.status === 'completed',
        ).length,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  createSignal(
    input: CreateIntelligenceSignalInput,
  ): IntelligenceSignal {
    const title = input.title?.trim();
    const category = input.category?.trim();

    if (!title) {
      throw new BadRequestException(
        'Signal title is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Signal category is required',
      );
    }

    const score = this.normalizeScore(input.score ?? 50);
    const now = new Date().toISOString();

    const signal: IntelligenceSignal = {
      id: randomUUID(),
      title,
      description: input.description?.trim(),
      category,
      status: input.status ?? 'detected',
      priority: input.priority ?? 'medium',
      score,
      source: input.source?.trim(),
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.signals.set(signal.id, signal);

    return signal;
  }

  listSignals(filters?: {
    category?: string;
    status?: IntelligenceSignalStatus;
    priority?: IntelligenceSignalPriority;
    search?: string;
  }): IntelligenceSignal[] {
    const search = filters?.search?.trim().toLowerCase();

    return [...this.signals.values()]
      .filter((signal) => {
        if (
          filters?.category &&
          signal.category !== filters.category
        ) {
          return false;
        }

        if (
          filters?.status &&
          signal.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          signal.priority !== filters.priority
        ) {
          return false;
        }

        if (search) {
          const text = [
            signal.title,
            signal.description ?? '',
            signal.category,
            signal.source ?? '',
            ...signal.tags,
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

  getSignal(id: string): IntelligenceSignal {
    const signal = this.signals.get(id);

    if (!signal) {
      throw new NotFoundException(
        `${this.engineName} signal '${id}' was not found`,
      );
    }

    return signal;
  }

  updateSignal(
    id: string,
    input: UpdateIntelligenceSignalInput,
  ): IntelligenceSignal {
    const current = this.getSignal(id);

    if (
      input.title !== undefined &&
      !input.title.trim()
    ) {
      throw new BadRequestException(
        'Signal title cannot be empty',
      );
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new BadRequestException(
        'Signal category cannot be empty',
      );
    }

    const updated: IntelligenceSignal = {
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
          ? this.normalizeScore(input.score)
          : current.score,
      source:
        input.source?.trim() ?? current.source,
      tags:
        input.tags !== undefined
          ? this.normalizeTags(input.tags)
          : current.tags,
      metadata:
        input.metadata ?? current.metadata,
      updatedAt: new Date().toISOString(),
    };

    this.signals.set(id, updated);

    return updated;
  }

  advanceSignal(id: string): IntelligenceSignal {
    const signal = this.getSignal(id);

    const workflow: IntelligenceSignalStatus[] = [
      'detected',
      'reviewing',
      'approved',
      'completed',
    ];

    if (
      signal.status === 'completed' ||
      signal.status === 'rejected'
    ) {
      return signal;
    }

    const index = workflow.indexOf(signal.status);
    const nextStatus = workflow[index + 1];

    return this.updateSignal(id, {
      status: nextStatus,
    });
  }

  rejectSignal(id: string): IntelligenceSignal {
    return this.updateSignal(id, {
      status: 'rejected',
    });
  }

  removeSignal(id: string): {
    success: true;
    id: string;
  } {
    this.getSignal(id);
    this.signals.delete(id);

    return {
      success: true,
      id,
    };
  }

  analyzeText(content: string) {
    const normalized = content?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Content is required for analysis',
      );
    }

    const words = normalized
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const frequencies = words.reduce<
      Record<string, number>
    >((result, word) => {
      const cleaned = word.replace(
        /[^a-z0-9\u0600-\u06ff]/gi,
        '',
      );

      if (cleaned.length >= 3) {
        result[cleaned] =
          (result[cleaned] ?? 0) + 1;
      }

      return result;
    }, {});

    const keywords = Object.entries(frequencies)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({
        keyword,
        count,
      }));

    return {
      engine: this.engineName,
      characterCount: normalized.length,
      wordCount: words.length,
      uniqueWordCount: Object.keys(frequencies).length,
      keywords,
      qualityScore: Math.min(
        100,
        Math.max(
          1,
          Math.round(
            Math.min(words.length / 2, 50) +
              Math.min(
                Object.keys(frequencies).length,
                50,
              ),
          ),
        ),
      ),
      analyzedAt: new Date().toISOString(),
    };
  }

  getTopSignals(limit = 10): IntelligenceSignal[] {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listSignals().slice(0, safeLimit);
  }

  private normalizeScore(score: number): number {
    if (!Number.isFinite(score)) {
      throw new BadRequestException(
        'Signal score must be a valid number',
      );
    }

    return Math.max(0, Math.min(100, score));
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
