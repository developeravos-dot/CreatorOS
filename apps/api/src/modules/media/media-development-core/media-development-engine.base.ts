import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type DevelopmentStatus =
  | 'draft'
  | 'researching'
  | 'ideating'
  | 'evaluating'
  | 'developing'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'archived';

export type DevelopmentPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type DevelopmentType =
  | 'research'
  | 'idea'
  | 'concept'
  | 'story'
  | 'format'
  | 'audience'
  | 'culture'
  | 'trend'
  | 'opportunity'
  | 'other';

export interface MediaDevelopmentRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: DevelopmentType;
  status: DevelopmentStatus;
  priority: DevelopmentPriority;

  owner: string;
  platform: string;
  language: string;
  culture: string;
  targetAudience: string;
  ageGroup: string;

  problem: string;
  insight: string;
  concept: string;
  format: string;
  hook: string;
  emotionalPromise: string;

  originalityScore: number;
  audienceFitScore: number;
  culturalFitScore: number;
  platformFitScore: number;
  viralityScore: number;
  franchisePotentialScore: number;
  monetizationPotentialScore: number;
  confidenceScore: number;

  sources: string[];
  keywords: string[];
  trends: string[];
  opportunities: string[];
  storyElements: string[];
  recommendations: string[];
  risks: string[];
  tags: string[];

  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaDevelopmentInput {
  name: string;
  description?: string;
  category: string;
  type?: DevelopmentType;
  status?: DevelopmentStatus;
  priority?: DevelopmentPriority;

  owner: string;
  platform?: string;
  language?: string;
  culture?: string;
  targetAudience?: string;
  ageGroup?: string;

  problem?: string;
  insight?: string;
  concept?: string;
  format?: string;
  hook?: string;
  emotionalPromise?: string;

  originalityScore?: number;
  audienceFitScore?: number;
  culturalFitScore?: number;
  platformFitScore?: number;
  viralityScore?: number;
  franchisePotentialScore?: number;
  monetizationPotentialScore?: number;
  confidenceScore?: number;

  sources?: string[];
  keywords?: string[];
  trends?: string[];
  opportunities?: string[];
  storyElements?: string[];
  recommendations?: string[];
  risks?: string[];
  tags?: string[];

  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
}

export interface UpdateMediaDevelopmentInput
  extends Partial<CreateMediaDevelopmentInput> {}

export abstract class MediaDevelopmentEngineBase {
  private readonly records =
    new Map<string, MediaDevelopmentRecord>();

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
        'AVOS Media Intelligence and Development',
      humanFinalAuthority: true,

      totalRecords: records.length,

      researchingRecords: records.filter(
        (record) =>
          record.status === 'researching',
      ).length,

      ideatingRecords: records.filter(
        (record) => record.status === 'ideating',
      ).length,

      evaluatingRecords: records.filter(
        (record) =>
          record.status === 'evaluating',
      ).length,

      developingRecords: records.filter(
        (record) =>
          record.status === 'developing',
      ).length,

      approvedRecords: records.filter(
        (record) => record.status === 'approved',
      ).length,

      pendingHumanApproval: records.filter(
        (record) =>
          record.humanApprovalRequired &&
          !record.humanApproved,
      ).length,

      averageOriginalityScore: this.average(
        records.map(
          (record) => record.originalityScore,
        ),
      ),

      averageAudienceFitScore: this.average(
        records.map(
          (record) => record.audienceFitScore,
        ),
      ),

      averageViralityScore: this.average(
        records.map(
          (record) => record.viralityScore,
        ),
      ),

      averageFranchisePotentialScore:
        this.average(
          records.map(
            (record) =>
              record.franchisePotentialScore,
          ),
        ),

      averageMonetizationPotentialScore:
        this.average(
          records.map(
            (record) =>
              record.monetizationPotentialScore,
          ),
        ),

      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaDevelopmentInput,
  ): MediaDevelopmentRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Development record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Development category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Development owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: MediaDevelopmentRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',

      owner,
      platform:
        input.platform?.trim().toLowerCase() ??
        'global',
      language:
        input.language?.trim().toLowerCase() ??
        'en',
      culture:
        input.culture?.trim().toLowerCase() ??
        'global',
      targetAudience:
        input.targetAudience?.trim() ??
        'general audience',
      ageGroup:
        input.ageGroup?.trim() ?? 'all ages',

      problem: input.problem?.trim() ?? '',
      insight: input.insight?.trim() ?? '',
      concept: input.concept?.trim() ?? '',
      format: input.format?.trim() ?? '',
      hook: input.hook?.trim() ?? '',
      emotionalPromise:
        input.emotionalPromise?.trim() ?? '',

      originalityScore: this.score(
        input.originalityScore ?? 0,
        'originalityScore',
      ),

      audienceFitScore: this.score(
        input.audienceFitScore ?? 0,
        'audienceFitScore',
      ),

      culturalFitScore: this.score(
        input.culturalFitScore ?? 0,
        'culturalFitScore',
      ),

      platformFitScore: this.score(
        input.platformFitScore ?? 0,
        'platformFitScore',
      ),

      viralityScore: this.score(
        input.viralityScore ?? 0,
        'viralityScore',
      ),

      franchisePotentialScore: this.score(
        input.franchisePotentialScore ?? 0,
        'franchisePotentialScore',
      ),

      monetizationPotentialScore: this.score(
        input.monetizationPotentialScore ?? 0,
        'monetizationPotentialScore',
      ),

      confidenceScore: this.score(
        input.confidenceScore ?? 0,
        'confidenceScore',
      ),

      sources: this.normalizeList(
        input.sources,
        false,
      ),

      keywords: this.normalizeList(
        input.keywords,
      ),

      trends: this.normalizeList(
        input.trends,
      ),

      opportunities: this.normalizeList(
        input.opportunities,
        false,
      ),

      storyElements: this.normalizeList(
        input.storyElements,
        false,
      ),

      recommendations: this.normalizeList(
        input.recommendations,
        false,
      ),

      risks: this.normalizeList(
        input.risks,
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
    status?: DevelopmentStatus;
    priority?: DevelopmentPriority;
    type?: DevelopmentType;
    category?: string;
    owner?: string;
    platform?: string;
    language?: string;
    culture?: string;
    search?: string;
    humanApproved?: boolean;
  }): MediaDevelopmentRecord[] {
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
          filters?.platform &&
          record.platform !==
            filters.platform.toLowerCase()
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
          filters?.culture &&
          record.culture !==
            filters.culture.toLowerCase()
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
            record.language,
            record.culture,
            record.targetAudience,
            record.problem,
            record.insight,
            record.concept,
            record.format,
            record.hook,
            ...record.keywords,
            ...record.trends,
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
        const firstScore =
          first.originalityScore +
          first.audienceFitScore +
          first.viralityScore +
          first.franchisePotentialScore;

        const secondScore =
          second.originalityScore +
          second.audienceFitScore +
          second.viralityScore +
          second.franchisePotentialScore;

        return secondScore - firstScore;
      });
  }

  getRecord(id: string): MediaDevelopmentRecord {
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
    input: UpdateMediaDevelopmentInput,
  ): MediaDevelopmentRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Development record name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Development owner cannot be empty',
      );
    }

    const updated: MediaDevelopmentRecord = {
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

      platform:
        input.platform?.trim().toLowerCase() ??
        current.platform,

      language:
        input.language?.trim().toLowerCase() ??
        current.language,

      culture:
        input.culture?.trim().toLowerCase() ??
        current.culture,

      targetAudience:
        input.targetAudience?.trim() ??
        current.targetAudience,

      ageGroup:
        input.ageGroup?.trim() ??
        current.ageGroup,

      problem:
        input.problem?.trim() ??
        current.problem,

      insight:
        input.insight?.trim() ??
        current.insight,

      concept:
        input.concept?.trim() ??
        current.concept,

      format:
        input.format?.trim() ??
        current.format,

      hook:
        input.hook?.trim() ??
        current.hook,

      emotionalPromise:
        input.emotionalPromise?.trim() ??
        current.emotionalPromise,

      originalityScore:
        input.originalityScore !== undefined
          ? this.score(
              input.originalityScore,
              'originalityScore',
            )
          : current.originalityScore,

      audienceFitScore:
        input.audienceFitScore !== undefined
          ? this.score(
              input.audienceFitScore,
              'audienceFitScore',
            )
          : current.audienceFitScore,

      culturalFitScore:
        input.culturalFitScore !== undefined
          ? this.score(
              input.culturalFitScore,
              'culturalFitScore',
            )
          : current.culturalFitScore,

      platformFitScore:
        input.platformFitScore !== undefined
          ? this.score(
              input.platformFitScore,
              'platformFitScore',
            )
          : current.platformFitScore,

      viralityScore:
        input.viralityScore !== undefined
          ? this.score(
              input.viralityScore,
              'viralityScore',
            )
          : current.viralityScore,

      franchisePotentialScore:
        input.franchisePotentialScore !==
        undefined
          ? this.score(
              input.franchisePotentialScore,
              'franchisePotentialScore',
            )
          : current.franchisePotentialScore,

      monetizationPotentialScore:
        input.monetizationPotentialScore !==
        undefined
          ? this.score(
              input.monetizationPotentialScore,
              'monetizationPotentialScore',
            )
          : current.monetizationPotentialScore,

      confidenceScore:
        input.confidenceScore !== undefined
          ? this.score(
              input.confidenceScore,
              'confidenceScore',
            )
          : current.confidenceScore,

      sources:
        input.sources !== undefined
          ? this.normalizeList(
              input.sources,
              false,
            )
          : current.sources,

      keywords:
        input.keywords !== undefined
          ? this.normalizeList(input.keywords)
          : current.keywords,

      trends:
        input.trends !== undefined
          ? this.normalizeList(input.trends)
          : current.trends,

      opportunities:
        input.opportunities !== undefined
          ? this.normalizeList(
              input.opportunities,
              false,
            )
          : current.opportunities,

      storyElements:
        input.storyElements !== undefined
          ? this.normalizeList(
              input.storyElements,
              false,
            )
          : current.storyElements,

      recommendations:
        input.recommendations !== undefined
          ? this.normalizeList(
              input.recommendations,
              false,
            )
          : current.recommendations,

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

  startIdeation(id: string) {
    return this.updateRecord(id, {
      status: 'ideating',
    });
  }

  startEvaluation(id: string) {
    return this.updateRecord(id, {
      status: 'evaluating',
    });
  }

  startDevelopment(id: string) {
    return this.updateRecord(id, {
      status: 'developing',
    });
  }

  submitForReview(id: string) {
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

  rejectByHuman(id: string) {
    return this.updateRecord(id, {
      status: 'rejected',
      humanApproved: false,
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addSource(id: string, source: string) {
    const record = this.getRecord(id);
    const normalized = source?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Research source is required',
      );
    }

    return this.updateRecord(id, {
      sources: [...record.sources, normalized],
    });
  }

  addTrend(id: string, trend: string) {
    const record = this.getRecord(id);
    const normalized = trend?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Trend is required',
      );
    }

    return this.updateRecord(id, {
      trends: [...record.trends, normalized],
    });
  }

  addOpportunity(
    id: string,
    opportunity: string,
  ) {
    const record = this.getRecord(id);
    const normalized = opportunity?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Opportunity is required',
      );
    }

    return this.updateRecord(id, {
      opportunities: [
        ...record.opportunities,
        normalized,
      ],
    });
  }

  addStoryElement(
    id: string,
    storyElement: string,
  ) {
    const record = this.getRecord(id);
    const normalized = storyElement?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Story element is required',
      );
    }

    return this.updateRecord(id, {
      storyElements: [
        ...record.storyElements,
        normalized,
      ],
    });
  }

  evaluateIdea(id: string) {
    const record = this.getRecord(id);

    const score =
      record.originalityScore * 0.2 +
      record.audienceFitScore * 0.18 +
      record.culturalFitScore * 0.1 +
      record.platformFitScore * 0.12 +
      record.viralityScore * 0.15 +
      record.franchisePotentialScore * 0.1 +
      record.monetizationPotentialScore * 0.1 +
      record.confidenceScore * 0.05;

    const recommendation =
      score >= 85
        ? 'develop-immediately'
        : score >= 70
          ? 'high-potential'
          : score >= 55
            ? 'pilot-required'
            : score >= 40
              ? 'major-refinement-required'
              : 'reject';

    return {
      id: record.id,
      score: Number(score.toFixed(2)),
      recommendation,
      originalityScore:
        record.originalityScore,
      audienceFitScore:
        record.audienceFitScore,
      franchisePotentialScore:
        record.franchisePotentialScore,
      humanApprovalRequired:
        record.humanApprovalRequired,
      evaluatedAt: new Date().toISOString(),
    };
  }

  generateResearchBrief(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      title: record.name,
      platform: record.platform,
      language: record.language,
      culture: record.culture,
      targetAudience:
        record.targetAudience,
      researchQuestions: [
        'What problem or desire does the audience have?',
        'Which existing content already serves this audience?',
        'What gaps remain underserved?',
        'Which trends are accelerating?',
        'Which cultural factors affect adoption?',
        'What makes this concept original?',
        'Can this become a repeatable format?',
        'Can this become intellectual property?',
      ],
      sources: record.sources,
      generatedAt: new Date().toISOString(),
    };
  }

  generateConceptBlueprint(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      name: record.name,
      problem: record.problem,
      insight: record.insight,
      concept: record.concept,
      format: record.format,
      hook: record.hook,
      emotionalPromise:
        record.emotionalPromise,
      targetAudience:
        record.targetAudience,
      storyElements:
        record.storyElements,
      developmentStages: [
        'audience-insight',
        'creative-premise',
        'format-definition',
        'story-architecture',
        'character-definition',
        'visual-direction',
        'pilot-development',
        'audience-testing',
        'human-approval',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateStoryArchitecture(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      concept: record.concept,
      hook: record.hook,
      storyArchitecture: {
        opening: 'Immediate audience hook',
        setup: 'Introduce world and central question',
        escalation:
          'Increase conflict, discovery, or stakes',
        midpoint:
          'Reveal a major change or surprise',
        climax:
          'Deliver the central emotional payoff',
        ending:
          'Resolve the episode and open future potential',
      },
      storyElements:
        record.storyElements,
      generatedAt: new Date().toISOString(),
    };
  }

  generateAudienceProfile(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      audience: record.targetAudience,
      ageGroup: record.ageGroup,
      platform: record.platform,
      language: record.language,
      culture: record.culture,
      emotionalPromise:
        record.emotionalPromise,
      profileDimensions: [
        'needs',
        'motivations',
        'fears',
        'aspirations',
        'attention-patterns',
        'content-preferences',
        'cultural-sensitivities',
        'purchase-intent',
        'sharing-behavior',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateFormatSystem(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      formatName:
        record.format || record.name,
      coreConcept: record.concept,
      repeatableStructure: [
        'signature-opening',
        'core-challenge-or-question',
        'development-segments',
        'emotional-or-informational-payoff',
        'signature-ending',
      ],
      scalability: {
        episodes: true,
        seasons: true,
        languages: true,
        platforms: true,
        products: true,
        licensing: true,
      },
      generatedAt: new Date().toISOString(),
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
