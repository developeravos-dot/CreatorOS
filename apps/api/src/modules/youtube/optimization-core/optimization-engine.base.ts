import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type OptimizationStatus =
  | 'draft'
  | 'analyzing'
  | 'optimized'
  | 'approved'
  | 'published'
  | 'rejected';

export type OptimizationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface OptimizationCandidate {
  id: string;
  name: string;
  content: string;
  description?: string;
  status: OptimizationStatus;
  priority: OptimizationPriority;
  score: number;
  clickPotential: number;
  searchPotential: number;
  engagementPotential: number;
  clarityScore: number;
  tags: string[];
  metadata: Record<string, unknown>;
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOptimizationCandidateInput {
  name: string;
  content: string;
  description?: string;
  status?: OptimizationStatus;
  priority?: OptimizationPriority;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateOptimizationCandidateInput {
  name?: string;
  content?: string;
  description?: string;
  status?: OptimizationStatus;
  priority?: OptimizationPriority;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface OptimizationRules {
  minimumLength: number;
  maximumLength: number;
  recommendedLength: number;
  maximumWords: number;
  powerWords: string[];
  prohibitedWords: string[];
}

export interface OptimizationDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalCandidates: number;
  optimizedCandidates: number;
  approvedCandidates: number;
  publishedCandidates: number;
  averageScore: number;
  topScore: number;
  updatedAt: string;
}

export abstract class OptimizationEngineBase {
  private readonly candidates =
    new Map<string, OptimizationCandidate>();

  protected constructor(
    private readonly engineName: string,
    private readonly rules: OptimizationRules,
  ) {}

  getDashboard(): OptimizationDashboard {
    const candidates = [...this.candidates.values()];

    const averageScore =
      candidates.length === 0
        ? 0
        : Number(
            (
              candidates.reduce(
                (total, candidate) =>
                  total + candidate.score,
                0,
              ) / candidates.length
            ).toFixed(2),
          );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalCandidates: candidates.length,
      optimizedCandidates: candidates.filter(
        (candidate) =>
          candidate.status === 'optimized',
      ).length,
      approvedCandidates: candidates.filter(
        (candidate) =>
          candidate.status === 'approved',
      ).length,
      publishedCandidates: candidates.filter(
        (candidate) =>
          candidate.status === 'published',
      ).length,
      averageScore,
      topScore:
        candidates.length === 0
          ? 0
          : Math.max(
              ...candidates.map(
                (candidate) => candidate.score,
              ),
            ),
      updatedAt: new Date().toISOString(),
    };
  }

  getRules(): OptimizationRules {
    return {
      ...this.rules,
      powerWords: [...this.rules.powerWords],
      prohibitedWords: [
        ...this.rules.prohibitedWords,
      ],
    };
  }

  createCandidate(
    input: CreateOptimizationCandidateInput,
  ): OptimizationCandidate {
    const name = input.name?.trim();
    const content = input.content?.trim();

    if (!name) {
      throw new BadRequestException(
        'Candidate name is required',
      );
    }

    if (!content) {
      throw new BadRequestException(
        'Candidate content is required',
      );
    }

    const evaluation = this.evaluateContent(content);
    const now = new Date().toISOString();

    const candidate: OptimizationCandidate = {
      id: randomUUID(),
      name,
      content,
      description: input.description?.trim(),
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      score: evaluation.score,
      clickPotential: evaluation.clickPotential,
      searchPotential: evaluation.searchPotential,
      engagementPotential:
        evaluation.engagementPotential,
      clarityScore: evaluation.clarityScore,
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      recommendations: evaluation.recommendations,
      createdAt: now,
      updatedAt: now,
    };

    this.candidates.set(candidate.id, candidate);

    return candidate;
  }

  listCandidates(filters?: {
    status?: OptimizationStatus;
    priority?: OptimizationPriority;
    search?: string;
    minimumScore?: number;
  }): OptimizationCandidate[] {
    const search = filters?.search
      ?.trim()
      .toLowerCase();

    return [...this.candidates.values()]
      .filter((candidate) => {
        if (
          filters?.status &&
          candidate.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          candidate.priority !== filters.priority
        ) {
          return false;
        }

        if (
          filters?.minimumScore !== undefined &&
          candidate.score < filters.minimumScore
        ) {
          return false;
        }

        if (search) {
          const text = [
            candidate.name,
            candidate.content,
            candidate.description ?? '',
            ...candidate.tags,
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

  getCandidate(
    id: string,
  ): OptimizationCandidate {
    const candidate = this.candidates.get(id);

    if (!candidate) {
      throw new NotFoundException(
        `${this.engineName} candidate '${id}' was not found`,
      );
    }

    return candidate;
  }

  updateCandidate(
    id: string,
    input: UpdateOptimizationCandidateInput,
  ): OptimizationCandidate {
    const current = this.getCandidate(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Candidate name cannot be empty',
      );
    }

    if (
      input.content !== undefined &&
      !input.content.trim()
    ) {
      throw new BadRequestException(
        'Candidate content cannot be empty',
      );
    }

    const content =
      input.content?.trim() ?? current.content;

    const evaluation = this.evaluateContent(content);

    const updated: OptimizationCandidate = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      content,
      description:
        input.description?.trim() ??
        current.description,
      score: evaluation.score,
      clickPotential: evaluation.clickPotential,
      searchPotential: evaluation.searchPotential,
      engagementPotential:
        evaluation.engagementPotential,
      clarityScore: evaluation.clarityScore,
      recommendations: evaluation.recommendations,
      tags:
        input.tags !== undefined
          ? this.normalizeTags(input.tags)
          : current.tags,
      metadata:
        input.metadata ?? current.metadata,
      updatedAt: new Date().toISOString(),
    };

    this.candidates.set(id, updated);

    return updated;
  }

  optimizeCandidate(
    id: string,
  ): OptimizationCandidate {
    const candidate = this.getCandidate(id);
    const optimizedContent =
      this.generateOptimizedContent(candidate.content);

    return this.updateCandidate(id, {
      content: optimizedContent,
      status: 'optimized',
    });
  }

  approveCandidate(
    id: string,
  ): OptimizationCandidate {
    const candidate = this.getCandidate(id);

    if (candidate.score < 50) {
      throw new BadRequestException(
        'Candidate score must be at least 50 before approval',
      );
    }

    return this.updateCandidate(id, {
      status: 'approved',
    });
  }

  publishCandidate(
    id: string,
  ): OptimizationCandidate {
    const candidate = this.getCandidate(id);

    if (candidate.status !== 'approved') {
      throw new BadRequestException(
        'Candidate must be approved before publishing',
      );
    }

    return this.updateCandidate(id, {
      status: 'published',
    });
  }

  rejectCandidate(
    id: string,
  ): OptimizationCandidate {
    return this.updateCandidate(id, {
      status: 'rejected',
    });
  }

  removeCandidate(id: string): {
    success: true;
    id: string;
  } {
    this.getCandidate(id);
    this.candidates.delete(id);

    return {
      success: true,
      id,
    };
  }

  evaluate(content: string) {
    if (!content?.trim()) {
      throw new BadRequestException(
        'Content is required for optimization',
      );
    }

    return {
      engine: this.engineName,
      content: content.trim(),
      ...this.evaluateContent(content.trim()),
      evaluatedAt: new Date().toISOString(),
    };
  }

  compare(contents: string[]) {
    if (!Array.isArray(contents) || contents.length < 2) {
      throw new BadRequestException(
        'At least two candidates are required for comparison',
      );
    }

    const results = contents.map((content, index) => {
      if (!content?.trim()) {
        throw new BadRequestException(
          `Candidate ${index + 1} content is empty`,
        );
      }

      return {
        position: index + 1,
        content: content.trim(),
        ...this.evaluateContent(content.trim()),
      };
    });

    const ranking = [...results].sort(
      (first, second) =>
        second.score - first.score,
    );

    return {
      engine: this.engineName,
      candidates: results,
      winner: ranking[0] ?? null,
      ranking,
      comparedAt: new Date().toISOString(),
    };
  }

  getTopCandidates(
    limit = 10,
  ): OptimizationCandidate[] {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listCandidates().slice(0, safeLimit);
  }

  private evaluateContent(content: string) {
    const normalized = content.trim();
    const lowered = normalized.toLowerCase();

    const words = normalized
      .split(/\s+/)
      .filter(Boolean);

    const length = normalized.length;
    const wordCount = words.length;

    const powerWordMatches =
      this.rules.powerWords.filter((word) =>
        lowered.includes(word.toLowerCase()),
      );

    const prohibitedMatches =
      this.rules.prohibitedWords.filter((word) =>
        lowered.includes(word.toLowerCase()),
      );

    const lengthDifference = Math.abs(
      length - this.rules.recommendedLength,
    );

    const lengthScore = Math.max(
      0,
      100 -
        Math.round(
          (lengthDifference /
            Math.max(
              1,
              this.rules.recommendedLength,
            )) *
            100,
        ),
    );

    const clarityScore = Math.max(
      0,
      Math.min(
        100,
        100 -
          Math.max(
            0,
            wordCount - this.rules.maximumWords,
          ) *
            7,
      ),
    );

    const clickPotential = Math.max(
      0,
      Math.min(
        100,
        45 +
          powerWordMatches.length * 12 +
          (normalized.includes('?') ? 8 : 0) +
          (/\d/.test(normalized) ? 8 : 0) -
          prohibitedMatches.length * 20,
      ),
    );

    const searchPotential = Math.max(
      0,
      Math.min(
        100,
        40 +
          Math.min(wordCount, 10) * 4 +
          powerWordMatches.length * 5 -
          prohibitedMatches.length * 15,
      ),
    );

    const engagementPotential = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          clickPotential * 0.55 +
            clarityScore * 0.45,
        ),
      ),
    );

    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          lengthScore * 0.25 +
            clarityScore * 0.25 +
            clickPotential * 0.25 +
            searchPotential * 0.25 -
            prohibitedMatches.length * 10,
        ),
      ),
    );

    const recommendations: string[] = [];

    if (length < this.rules.minimumLength) {
      recommendations.push(
        `Increase content length to at least ${this.rules.minimumLength} characters`,
      );
    }

    if (length > this.rules.maximumLength) {
      recommendations.push(
        `Reduce content length to ${this.rules.maximumLength} characters or fewer`,
      );
    }

    if (wordCount > this.rules.maximumWords) {
      recommendations.push(
        `Reduce word count to ${this.rules.maximumWords} words or fewer`,
      );
    }

    if (powerWordMatches.length === 0) {
      recommendations.push(
        `Consider using a power word such as: ${this.rules.powerWords
          .slice(0, 5)
          .join(', ')}`,
      );
    }

    if (prohibitedMatches.length > 0) {
      recommendations.push(
        `Remove prohibited words: ${prohibitedMatches.join(', ')}`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Content meets the current optimization rules',
      );
    }

    return {
      score,
      length,
      wordCount,
      clickPotential,
      searchPotential,
      engagementPotential,
      clarityScore,
      powerWordMatches,
      prohibitedMatches,
      recommendations,
    };
  }

  private generateOptimizedContent(
    content: string,
  ): string {
    let optimized = content.trim();

    for (const prohibitedWord of this.rules
      .prohibitedWords) {
      optimized = optimized.replace(
        new RegExp(
          this.escapeRegExp(prohibitedWord),
          'gi',
        ),
        '',
      );
    }

    optimized = optimized
      .replace(/\s+/g, ' ')
      .trim();

    if (
      optimized.length < this.rules.minimumLength &&
      this.rules.powerWords.length > 0
    ) {
      const powerWord =
        this.rules.powerWords[0] ?? '';

      optimized = `${powerWord} ${optimized}`.trim();
    }

    if (optimized.length > this.rules.maximumLength) {
      optimized = optimized
        .slice(0, this.rules.maximumLength)
        .trim();
    }

    return optimized;
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

  private escapeRegExp(value: string): string {
    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
  }
}
