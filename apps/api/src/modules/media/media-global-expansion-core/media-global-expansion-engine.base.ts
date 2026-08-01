import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type GlobalExpansionStage =
  | 'expansion-readiness'
  | 'market-selection'
  | 'local-audience-intelligence'
  | 'translation-localization'
  | 'cultural-adaptation'
  | 'regional-channel-launch'
  | 'partner-creator-network'
  | 'multi-platform-distribution'
  | 'advertising-expansion'
  | 'commerce-product-expansion'
  | 'licensing-franchise-expansion'
  | 'revenue-optimization'
  | 'global-risk-governance'
  | 'market-performance-intelligence'
  | 'profit-reinvestment';

export type GlobalExpansionStatus =
  | 'draft'
  | 'planned'
  | 'running'
  | 'blocked'
  | 'human-review'
  | 'approved'
  | 'completed'
  | 'cancelled'
  | 'archived';

export type GlobalExpansionPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface ExpansionMarket {
  id: string;
  country: string;
  region: string;
  language: string;
  currency: string;
  populationScore: number;
  demandScore: number;
  competitionScore: number;
  revenuePotentialScore: number;
  regulatoryRiskScore: number;
  culturalFitScore: number;
  localizationReadinessScore: number;
  overallMarketScore: number;
  selected: boolean;
  humanApproved: boolean;
}

export interface ExpansionStageExecution {
  id: string;
  stage: GlobalExpansionStage;
  sequence: number;
  status: GlobalExpansionStatus;
  assignedAgentIds: string[];
  dependencies: GlobalExpansionStage[];
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  qualityScore: number;
  confidenceScore: number;
  expectedRevenue: number;
  actualRevenue: number;
  cost: number;
  profit: number;
  risks: string[];
  blockers: string[];
  recommendations: string[];
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  startedAt: string;
  completedAt: string;
}

export interface ExpansionPartner {
  id: string;
  name: string;
  type:
    | 'creator'
    | 'publisher'
    | 'distributor'
    | 'advertiser'
    | 'brand'
    | 'licensing-partner'
    | 'commerce-partner'
    | 'other';
  country: string;
  region: string;
  audienceReach: number;
  performanceScore: number;
  trustScore: number;
  strategicValueScore: number;
  status:
    | 'prospect'
    | 'evaluation'
    | 'negotiation'
    | 'active'
    | 'paused'
    | 'terminated';
  humanApproved: boolean;
}

export interface ExpansionDecision {
  id: string;
  stage: GlobalExpansionStage;
  title: string;
  recommendation: string;
  rationale: string;
  confidence: number;
  expectedImpact: number;
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

export interface GlobalExpansionProject {
  id: string;
  name: string;
  description: string;
  owner: string;
  priority: GlobalExpansionPriority;
  status: GlobalExpansionStatus;

  brandId: string;
  mediaProjectId: string;
  ipAssetId: string;

  sourceCountry: string;
  sourceLanguage: string;
  targetRegions: string[];

  currentStage: GlobalExpansionStage;
  stages: ExpansionStageExecution[];
  markets: ExpansionMarket[];
  partners: ExpansionPartner[];
  decisions: ExpansionDecision[];

  channels: string[];
  platforms: string[];
  languages: string[];
  products: string[];
  licenses: string[];

  totalBudget: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  reinvestmentAmount: number;

  readinessScore: number;
  localizationScore: number;
  distributionScore: number;
  partnershipScore: number;
  advertisingScore: number;
  commerceScore: number;
  licensingScore: number;
  governanceScore: number;
  marketPerformanceScore: number;
  overallExpansionScore: number;

  risks: string[];
  opportunities: string[];
  recommendations: string[];
  lessons: string[];
  tags: string[];

  autonomousExecutionEnabled: boolean;
  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateGlobalExpansionInput {
  name: string;
  description?: string;
  owner: string;
  priority?: GlobalExpansionPriority;

  brandId?: string;
  mediaProjectId?: string;
  ipAssetId?: string;

  sourceCountry?: string;
  sourceLanguage?: string;
  targetRegions?: string[];

  channels?: string[];
  platforms?: string[];
  languages?: string[];
  products?: string[];
  licenses?: string[];

  totalBudget?: number;
  totalRevenue?: number;
  totalCost?: number;

  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  lessons?: string[];
  tags?: string[];

  autonomousExecutionEnabled?: boolean;
  humanApprovalRequired?: boolean;
}

export abstract class MediaGlobalExpansionEngineBase {
  private readonly projects =
    new Map<string, GlobalExpansionProject>();

  private readonly orderedStages: GlobalExpansionStage[] = [
    'expansion-readiness',
    'market-selection',
    'local-audience-intelligence',
    'translation-localization',
    'cultural-adaptation',
    'regional-channel-launch',
    'partner-creator-network',
    'multi-platform-distribution',
    'advertising-expansion',
    'commerce-product-expansion',
    'licensing-franchise-expansion',
    'revenue-optimization',
    'global-risk-governance',
    'market-performance-intelligence',
    'profit-reinvestment',
  ];

  protected constructor(
    private readonly engineName: string,
    private readonly managedStage: GlobalExpansionStage,
  ) {}

  getDashboard() {
    const projects = [...this.projects.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture:
        'AVOS Media Global Expansion and Network Growth',
      managedStage: this.managedStage,
      totalStages: this.orderedStages.length,
      humanFinalAuthority: true,

      totalProjects: projects.length,

      runningProjects: projects.filter(
        (project) => project.status === 'running',
      ).length,

      blockedProjects: projects.filter(
        (project) => project.status === 'blocked',
      ).length,

      pendingHumanApproval: projects.filter(
        (project) =>
          project.humanApprovalRequired &&
          !project.humanApproved,
      ).length,

      totalSelectedMarkets: projects.reduce(
        (total, project) =>
          total +
          project.markets.filter(
            (market) => market.selected,
          ).length,
        0,
      ),

      totalPartners: projects.reduce(
        (total, project) =>
          total + project.partners.length,
        0,
      ),

      totalRevenue: Number(
        projects
          .reduce(
            (total, project) =>
              total + project.totalRevenue,
            0,
          )
          .toFixed(2),
      ),

      totalProfit: Number(
        projects
          .reduce(
            (total, project) =>
              total + project.totalProfit,
            0,
          )
          .toFixed(2),
      ),

      totalReinvestment: Number(
        projects
          .reduce(
            (total, project) =>
              total + project.reinvestmentAmount,
            0,
          )
          .toFixed(2),
      ),

      averageExpansionScore: this.average(
        projects.map(
          (project) =>
            project.overallExpansionScore,
        ),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  getBlueprint() {
    return {
      name:
        'AVOS Media Global Expansion Blueprint',
      stages: this.orderedStages.map(
        (stage, index) => ({
          sequence: index + 1,
          stage,
          previousStage:
            index === 0
              ? null
              : this.orderedStages[index - 1],
          humanApprovalGate:
            stage === 'market-selection' ||
            stage ===
              'regional-channel-launch' ||
            stage ===
              'licensing-franchise-expansion' ||
            stage === 'profit-reinvestment',
        }),
      ),
      principles: [
        'global-by-design',
        'local-by-execution',
        'data-driven-market-selection',
        'cultural-adaptation',
        'shared-ip-architecture',
        'controlled-autonomy',
        'human-final-authority',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  createProject(
    input: CreateGlobalExpansionInput,
  ): GlobalExpansionProject {
    const name = input.name?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Expansion project name is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Expansion project owner is required',
      );
    }

    const budget = this.nonNegative(
      input.totalBudget ?? 0,
      'totalBudget',
    );

    const revenue = this.nonNegative(
      input.totalRevenue ?? 0,
      'totalRevenue',
    );

    const cost = this.nonNegative(
      input.totalCost ?? 0,
      'totalCost',
    );

    const now = new Date().toISOString();

    const stages = this.orderedStages.map(
      (
        stage,
        index,
      ): ExpansionStageExecution => ({
        id: randomUUID(),
        stage,
        sequence: index + 1,
        status:
          index === 0 ? 'planned' : 'draft',
        assignedAgentIds: [],
        dependencies:
          index === 0
            ? []
            : [
                this.orderedStages[index - 1]!,
              ],
        inputs: {},
        outputs: {},
        qualityScore: 0,
        confidenceScore: 0,
        expectedRevenue: 0,
        actualRevenue: 0,
        cost: 0,
        profit: 0,
        risks: [],
        blockers: [],
        recommendations: [],
        humanApprovalRequired:
          stage === 'market-selection' ||
          stage ===
            'regional-channel-launch' ||
          stage ===
            'licensing-franchise-expansion' ||
          stage === 'profit-reinvestment',
        humanApproved: false,
        startedAt: '',
        completedAt: '',
      }),
    );

    const project: GlobalExpansionProject = {
      id: randomUUID(),
      name,
      description:
        input.description?.trim() ?? '',
      owner,
      priority: input.priority ?? 'medium',
      status: 'draft',

      brandId: input.brandId?.trim() ?? '',
      mediaProjectId:
        input.mediaProjectId?.trim() ?? '',
      ipAssetId:
        input.ipAssetId?.trim() ?? '',

      sourceCountry:
        input.sourceCountry?.trim() ?? '',
      sourceLanguage:
        input.sourceLanguage?.trim() ?? 'en',

      targetRegions: this.normalizeList(
        input.targetRegions,
      ),

      currentStage: 'expansion-readiness',
      stages,
      markets: [],
      partners: [],
      decisions: [],

      channels: this.normalizeList(
        input.channels,
      ),

      platforms: this.normalizeList(
        input.platforms,
      ),

      languages: this.normalizeList(
        input.languages,
      ),

      products: this.normalizeList(
        input.products,
      ),

      licenses: this.normalizeList(
        input.licenses,
      ),

      totalBudget: budget,
      totalRevenue: revenue,
      totalCost: cost,
      totalProfit: Number(
        (revenue - cost).toFixed(2),
      ),
      reinvestmentAmount: 0,

      readinessScore: 0,
      localizationScore: 0,
      distributionScore: 0,
      partnershipScore: 0,
      advertisingScore: 0,
      commerceScore: 0,
      licensingScore: 0,
      governanceScore: 0,
      marketPerformanceScore: 0,
      overallExpansionScore: 0,

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

      lessons: this.normalizeList(
        input.lessons,
        false,
      ),

      tags: this.normalizeList(input.tags),

      autonomousExecutionEnabled:
        input.autonomousExecutionEnabled ??
        false,

      humanApprovalRequired:
        input.humanApprovalRequired ?? true,

      humanApproved: false,

      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);

    return project;
  }

  listProjects(filters?: {
    status?: GlobalExpansionStatus;
    priority?: GlobalExpansionPriority;
    stage?: GlobalExpansionStage;
    owner?: string;
    search?: string;
  }) {
    const search =
      filters?.search?.trim().toLowerCase();

    return [...this.projects.values()]
      .filter((project) => {
        if (
          filters?.status &&
          project.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          project.priority !== filters.priority
        ) {
          return false;
        }

        if (
          filters?.stage &&
          project.currentStage !== filters.stage
        ) {
          return false;
        }

        if (
          filters?.owner &&
          project.owner.toLowerCase() !==
            filters.owner.toLowerCase()
        ) {
          return false;
        }

        if (search) {
          const searchable = [
            project.name,
            project.description,
            project.owner,
            ...project.targetRegions,
            ...project.languages,
            ...project.platforms,
            ...project.channels,
            ...project.opportunities,
            ...project.tags,
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
          second.overallExpansionScore -
          first.overallExpansionScore,
      );
  }

  getProject(id: string) {
    const project = this.projects.get(id);

    if (!project) {
      throw new NotFoundException(
        `Global expansion project '${id}' was not found`,
      );
    }

    return project;
  }

  updateProject(
    id: string,
    input: Partial<GlobalExpansionProject>,
  ) {
    const current = this.getProject(id);

    const revenue =
      input.totalRevenue !== undefined
        ? this.nonNegative(
            input.totalRevenue,
            'totalRevenue',
          )
        : current.totalRevenue;

    const cost =
      input.totalCost !== undefined
        ? this.nonNegative(
            input.totalCost,
            'totalCost',
          )
        : current.totalCost;

    const updated: GlobalExpansionProject = {
      ...current,
      ...input,
      id: current.id,

      name:
        input.name?.trim() ?? current.name,

      description:
        input.description?.trim() ??
        current.description,

      owner:
        input.owner?.trim() ?? current.owner,

      totalBudget:
        input.totalBudget !== undefined
          ? this.nonNegative(
              input.totalBudget,
              'totalBudget',
            )
          : current.totalBudget,

      totalRevenue: revenue,
      totalCost: cost,
      totalProfit: Number(
        (revenue - cost).toFixed(2),
      ),

      readinessScore:
        input.readinessScore !== undefined
          ? this.score(input.readinessScore)
          : current.readinessScore,

      localizationScore:
        input.localizationScore !== undefined
          ? this.score(
              input.localizationScore,
            )
          : current.localizationScore,

      distributionScore:
        input.distributionScore !== undefined
          ? this.score(
              input.distributionScore,
            )
          : current.distributionScore,

      partnershipScore:
        input.partnershipScore !== undefined
          ? this.score(
              input.partnershipScore,
            )
          : current.partnershipScore,

      advertisingScore:
        input.advertisingScore !== undefined
          ? this.score(
              input.advertisingScore,
            )
          : current.advertisingScore,

      commerceScore:
        input.commerceScore !== undefined
          ? this.score(input.commerceScore)
          : current.commerceScore,

      licensingScore:
        input.licensingScore !== undefined
          ? this.score(input.licensingScore)
          : current.licensingScore,

      governanceScore:
        input.governanceScore !== undefined
          ? this.score(
              input.governanceScore,
            )
          : current.governanceScore,

      marketPerformanceScore:
        input.marketPerformanceScore !==
        undefined
          ? this.score(
              input.marketPerformanceScore,
            )
          : current.marketPerformanceScore,

      overallExpansionScore:
        input.overallExpansionScore !==
        undefined
          ? this.score(
              input.overallExpansionScore,
            )
          : current.overallExpansionScore,

      targetRegions:
        input.targetRegions !== undefined
          ? this.normalizeList(
              input.targetRegions,
            )
          : current.targetRegions,

      channels:
        input.channels !== undefined
          ? this.normalizeList(input.channels)
          : current.channels,

      platforms:
        input.platforms !== undefined
          ? this.normalizeList(
              input.platforms,
            )
          : current.platforms,

      languages:
        input.languages !== undefined
          ? this.normalizeList(
              input.languages,
            )
          : current.languages,

      products:
        input.products !== undefined
          ? this.normalizeList(input.products)
          : current.products,

      licenses:
        input.licenses !== undefined
          ? this.normalizeList(input.licenses)
          : current.licenses,

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

      lessons:
        input.lessons !== undefined
          ? this.normalizeList(
              input.lessons,
              false,
            )
          : current.lessons,

      tags:
        input.tags !== undefined
          ? this.normalizeList(input.tags)
          : current.tags,

      updatedAt: new Date().toISOString(),
    };

    this.projects.set(id, updated);

    return updated;
  }

  approveAutonomousExecution(
    id: string,
    approvedBy: string,
  ) {
    const project = this.getProject(id);

    const decision: ExpansionDecision = {
      id: randomUUID(),
      stage: project.currentStage,
      title:
        'Approve controlled global expansion',
      recommendation:
        'Enable autonomous stage orchestration',
      rationale:
        'Approved by Human Final Authority',
      confidence: 100,
      expectedImpact: 100,
      status: 'approved',
      humanApproved: true,
      decidedBy:
        approvedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
    };

    return this.updateProject(id, {
      humanApproved: true,
      decisions: [
        ...project.decisions,
        decision,
      ],
    });
  }

  startExpansion(id: string) {
    const project = this.getProject(id);

    if (
      project.autonomousExecutionEnabled &&
      project.humanApprovalRequired &&
      !project.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before autonomous expansion',
      );
    }

    this.updateStage(id, 'expansion-readiness', {
      status: 'running',
      startedAt: new Date().toISOString(),
    });

    return this.updateProject(id, {
      status: 'running',
      currentStage: 'expansion-readiness',
    });
  }

  executeManagedStage(
    id: string,
    input?: {
      assignedAgentIds?: string[];
      inputs?: Record<string, unknown>;
    },
  ) {
    const project = this.getProject(id);

    if (
      project.currentStage !== this.managedStage
    ) {
      throw new BadRequestException(
        `Current stage is '${project.currentStage}', not '${this.managedStage}'`,
      );
    }

    const stage = this.getStage(
      id,
      this.managedStage,
    );

    if (
      stage.humanApprovalRequired &&
      !stage.humanApproved
    ) {
      return this.submitStageForHumanReview(
        id,
        this.managedStage,
      );
    }

    this.updateStage(id, this.managedStage, {
      status: 'running',
      assignedAgentIds: [
        ...new Set(
          input?.assignedAgentIds ?? [],
        ),
      ],
      inputs: input?.inputs ?? {},
      startedAt:
        stage.startedAt ||
        new Date().toISOString(),
    });

    return this.getProject(id);
  }

  completeManagedStage(
    id: string,
    input?: {
      outputs?: Record<string, unknown>;
      qualityScore?: number;
      confidenceScore?: number;
      expectedRevenue?: number;
      actualRevenue?: number;
      cost?: number;
      risks?: string[];
      recommendations?: string[];
    },
  ) {
    return this.completeStage(
      id,
      this.managedStage,
      input,
    );
  }

  completeStage(
    id: string,
    stageName: GlobalExpansionStage,
    input?: {
      outputs?: Record<string, unknown>;
      qualityScore?: number;
      confidenceScore?: number;
      expectedRevenue?: number;
      actualRevenue?: number;
      cost?: number;
      risks?: string[];
      recommendations?: string[];
    },
  ) {
    const project = this.getProject(id);
    const stage = this.getStage(id, stageName);

    if (
      stage.humanApprovalRequired &&
      !stage.humanApproved
    ) {
      throw new BadRequestException(
        `Human approval is required before completing '${stageName}'`,
      );
    }

    const actualRevenue = this.nonNegative(
      input?.actualRevenue ?? 0,
      'actualRevenue',
    );

    const cost = this.nonNegative(
      input?.cost ?? 0,
      'cost',
    );

    const qualityScore = this.score(
      input?.qualityScore ?? 0,
    );

    this.updateStage(id, stageName, {
      status: 'completed',
      outputs: input?.outputs ?? {},
      qualityScore,
      confidenceScore: this.score(
        input?.confidenceScore ?? 0,
      ),
      expectedRevenue: this.nonNegative(
        input?.expectedRevenue ?? 0,
        'expectedRevenue',
      ),
      actualRevenue,
      cost,
      profit: Number(
        (actualRevenue - cost).toFixed(2),
      ),
      risks: this.normalizeList(
        input?.risks,
        false,
      ),
      recommendations: this.normalizeList(
        input?.recommendations,
        false,
      ),
      completedAt: new Date().toISOString(),
    });

    const scoreUpdate =
      this.stageScoreUpdate(
        stageName,
        qualityScore,
      );

    const stageIndex =
      this.orderedStages.indexOf(stageName);

    const nextStage =
      this.orderedStages[stageIndex + 1];

    const totalRevenue =
      project.totalRevenue + actualRevenue;

    const totalCost =
      project.totalCost + cost;

    if (!nextStage) {
      this.updateProject(id, {
        ...scoreUpdate,
        totalRevenue,
        totalCost,
        status: 'completed',
        currentStage: 'profit-reinvestment',
      });

      this.recalculateOverallScore(id);

      return this.getProject(id);
    }

    this.updateStage(id, nextStage, {
      status: 'planned',
    });

    this.updateProject(id, {
      ...scoreUpdate,
      totalRevenue,
      totalCost,
      status: 'running',
      currentStage: nextStage,
    });

    this.recalculateOverallScore(id);

    return this.getProject(id);
  }

  submitStageForHumanReview(
    id: string,
    stage: GlobalExpansionStage,
  ) {
    this.updateStage(id, stage, {
      status: 'human-review',
    });

    return this.updateProject(id, {
      status: 'human-review',
      currentStage: stage,
    });
  }

  approveStage(
    id: string,
    stage: GlobalExpansionStage,
    approvedBy: string,
  ) {
    const project = this.getProject(id);

    this.updateStage(id, stage, {
      status: 'approved',
      humanApproved: true,
    });

    const decision: ExpansionDecision = {
      id: randomUUID(),
      stage,
      title: `Approve ${stage}`,
      recommendation:
        'Proceed with global expansion stage',
      rationale:
        'Approved by Human Final Authority',
      confidence: 100,
      expectedImpact: 100,
      status: 'approved',
      humanApproved: true,
      decidedBy:
        approvedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
    };

    return this.updateProject(id, {
      status: 'running',
      decisions: [
        ...project.decisions,
        decision,
      ],
    });
  }

  rejectStage(
    id: string,
    stage: GlobalExpansionStage,
    reason: string,
    decidedBy: string,
  ) {
    const project = this.getProject(id);

    this.updateStage(id, stage, {
      status: 'blocked',
      blockers: [
        reason?.trim() ||
          'Rejected by human authority',
      ],
      humanApproved: false,
    });

    const decision: ExpansionDecision = {
      id: randomUUID(),
      stage,
      title: `Reject ${stage}`,
      recommendation:
        'Return stage for remediation',
      rationale:
        reason?.trim() ||
        'Rejected by Human Final Authority',
      confidence: 100,
      expectedImpact: 0,
      status: 'rejected',
      humanApproved: false,
      decidedBy:
        decidedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
    };

    return this.updateProject(id, {
      status: 'blocked',
      decisions: [
        ...project.decisions,
        decision,
      ],
    });
  }

  addMarket(
    id: string,
    input: Partial<ExpansionMarket>,
  ) {
    const project = this.getProject(id);

    const country = input.country?.trim();

    if (!country) {
      throw new BadRequestException(
        'Market country is required',
      );
    }

    const populationScore = this.score(
      input.populationScore ?? 0,
    );

    const demandScore = this.score(
      input.demandScore ?? 0,
    );

    const competitionScore = this.score(
      input.competitionScore ?? 0,
    );

    const revenuePotentialScore = this.score(
      input.revenuePotentialScore ?? 0,
    );

    const regulatoryRiskScore = this.score(
      input.regulatoryRiskScore ?? 0,
    );

    const culturalFitScore = this.score(
      input.culturalFitScore ?? 0,
    );

    const localizationReadinessScore =
      this.score(
        input.localizationReadinessScore ?? 0,
      );

    const overallMarketScore = Number(
      (
        populationScore * 0.12 +
        demandScore * 0.2 +
        (100 - competitionScore) * 0.12 +
        revenuePotentialScore * 0.2 +
        (100 - regulatoryRiskScore) * 0.12 +
        culturalFitScore * 0.12 +
        localizationReadinessScore * 0.12
      ).toFixed(2),
    );

    const market: ExpansionMarket = {
      id: randomUUID(),
      country,
      region: input.region?.trim() ?? '',
      language:
        input.language?.trim() ?? '',
      currency:
        input.currency?.trim() ?? '',
      populationScore,
      demandScore,
      competitionScore,
      revenuePotentialScore,
      regulatoryRiskScore,
      culturalFitScore,
      localizationReadinessScore,
      overallMarketScore,
      selected: input.selected ?? false,
      humanApproved:
        input.humanApproved ?? false,
    };

    return this.updateProject(id, {
      markets: [...project.markets, market],
    });
  }

  approveMarket(
    id: string,
    marketId: string,
  ) {
    const project = this.getProject(id);

    const exists = project.markets.some(
      (market) => market.id === marketId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Market '${marketId}' was not found`,
      );
    }

    return this.updateProject(id, {
      markets: project.markets.map(
        (market) =>
          market.id === marketId
            ? {
                ...market,
                selected: true,
                humanApproved: true,
              }
            : market,
      ),
    });
  }

  getRankedMarkets(id: string) {
    return [...this.getProject(id).markets].sort(
      (first, second) =>
        second.overallMarketScore -
        first.overallMarketScore,
    );
  }

  addPartner(
    id: string,
    input: Partial<ExpansionPartner>,
  ) {
    const project = this.getProject(id);
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'Partner name is required',
      );
    }

    const partner: ExpansionPartner = {
      id: randomUUID(),
      name,
      type: input.type ?? 'other',
      country: input.country?.trim() ?? '',
      region: input.region?.trim() ?? '',
      audienceReach: this.nonNegative(
        input.audienceReach ?? 0,
        'audienceReach',
      ),
      performanceScore: this.score(
        input.performanceScore ?? 0,
      ),
      trustScore: this.score(
        input.trustScore ?? 0,
      ),
      strategicValueScore: this.score(
        input.strategicValueScore ?? 0,
      ),
      status: input.status ?? 'prospect',
      humanApproved:
        input.humanApproved ?? false,
    };

    return this.updateProject(id, {
      partners: [...project.partners, partner],
    });
  }

  approvePartner(
    id: string,
    partnerId: string,
  ) {
    const project = this.getProject(id);

    const exists = project.partners.some(
      (partner) => partner.id === partnerId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Partner '${partnerId}' was not found`,
      );
    }

    return this.updateProject(id, {
      partners: project.partners.map(
        (partner) =>
          partner.id === partnerId
            ? {
                ...partner,
                status: 'active',
                humanApproved: true,
              }
            : partner,
      ),
    });
  }

  calculateReinvestment(
    id: string,
    reinvestmentPercentage: number,
  ) {
    const project = this.getProject(id);

    if (
      !Number.isFinite(
        reinvestmentPercentage,
      ) ||
      reinvestmentPercentage < 0 ||
      reinvestmentPercentage > 100
    ) {
      throw new BadRequestException(
        'Reinvestment percentage must be between 0 and 100',
      );
    }

    const amount = Number(
      (
        Math.max(0, project.totalProfit) *
        (reinvestmentPercentage / 100)
      ).toFixed(2),
    );

    return this.updateProject(id, {
      reinvestmentAmount: amount,
    });
  }

  generateMarketEntryPlan(id: string) {
    const project = this.getProject(id);

    return {
      projectId: project.id,
      rankedMarkets: this.getRankedMarkets(id),
      approvedMarkets:
        project.markets.filter(
          (market) =>
            market.selected &&
            market.humanApproved,
        ),
      entryStages: [
        'market-validation',
        'localization-pilot',
        'regional-channel-launch',
        'partner-activation',
        'distribution-expansion',
        'revenue-validation',
        'controlled-scale-up',
      ],
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateGlobalExpansionReport(id: string) {
    const project = this.getProject(id);

    const completedStages =
      project.stages.filter(
        (stage) => stage.status === 'completed',
      ).length;

    return {
      project,
      progress: Number(
        (
          (completedStages /
            this.orderedStages.length) *
          100
        ).toFixed(2),
      ),
      completedStages,
      totalStages: this.orderedStages.length,
      selectedMarkets:
        project.markets.filter(
          (market) => market.selected,
        ),
      activePartners:
        project.partners.filter(
          (partner) =>
            partner.status === 'active',
        ),
      financialPerformance: {
        budget: project.totalBudget,
        revenue: project.totalRevenue,
        cost: project.totalCost,
        profit: project.totalProfit,
        reinvestment:
          project.reinvestmentAmount,
        returnOnInvestment:
          project.totalCost > 0
            ? Number(
                (
                  (project.totalProfit /
                    project.totalCost) *
                  100
                ).toFixed(2),
              )
            : project.totalRevenue > 0
              ? 100
              : 0,
      },
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  removeProject(id: string) {
    this.getProject(id);
    this.projects.delete(id);

    return {
      success: true as const,
      id,
    };
  }

  private getStage(
    projectId: string,
    stage: GlobalExpansionStage,
  ) {
    const project = this.getProject(projectId);

    const result = project.stages.find(
      (item) => item.stage === stage,
    );

    if (!result) {
      throw new NotFoundException(
        `Expansion stage '${stage}' was not found`,
      );
    }

    return result;
  }

  private updateStage(
    projectId: string,
    stage: GlobalExpansionStage,
    input: Partial<ExpansionStageExecution>,
  ) {
    const project = this.getProject(projectId);

    return this.updateProject(projectId, {
      stages: project.stages.map(
        (execution) =>
          execution.stage === stage
            ? {
                ...execution,
                ...input,
                id: execution.id,
                stage: execution.stage,
                sequence: execution.sequence,
              }
            : execution,
      ),
    });
  }

  private stageScoreUpdate(
    stage: GlobalExpansionStage,
    value: number,
  ): Partial<GlobalExpansionProject> {
    switch (stage) {
      case 'expansion-readiness':
      case 'market-selection':
        return {
          readinessScore: value,
        };

      case 'local-audience-intelligence':
      case 'translation-localization':
      case 'cultural-adaptation':
        return {
          localizationScore: value,
        };

      case 'regional-channel-launch':
      case 'multi-platform-distribution':
        return {
          distributionScore: value,
        };

      case 'partner-creator-network':
        return {
          partnershipScore: value,
        };

      case 'advertising-expansion':
        return {
          advertisingScore: value,
        };

      case 'commerce-product-expansion':
        return {
          commerceScore: value,
        };

      case 'licensing-franchise-expansion':
        return {
          licensingScore: value,
        };

      case 'global-risk-governance':
        return {
          governanceScore: value,
        };

      case 'market-performance-intelligence':
      case 'revenue-optimization':
      case 'profit-reinvestment':
        return {
          marketPerformanceScore: value,
        };

      default:
        return {};
    }
  }

  private recalculateOverallScore(id: string) {
    const project = this.getProject(id);

    const overallExpansionScore =
      project.readinessScore * 0.12 +
      project.localizationScore * 0.13 +
      project.distributionScore * 0.13 +
      project.partnershipScore * 0.1 +
      project.advertisingScore * 0.1 +
      project.commerceScore * 0.1 +
      project.licensingScore * 0.1 +
      project.governanceScore * 0.1 +
      project.marketPerformanceScore * 0.12;

    return this.updateProject(id, {
      overallExpansionScore: Number(
        overallExpansionScore.toFixed(2),
      ),
    });
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

  private score(value: number) {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        'Score must be a valid number',
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private nonNegative(
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
