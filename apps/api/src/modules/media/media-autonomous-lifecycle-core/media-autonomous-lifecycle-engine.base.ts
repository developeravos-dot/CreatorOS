import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type LifecycleStage =
  | 'opportunity-discovery'
  | 'concept-development'
  | 'research-validation'
  | 'strategic-planning'
  | 'content-creation'
  | 'production'
  | 'quality-assurance'
  | 'governance-approval'
  | 'publishing-distribution'
  | 'growth-optimization'
  | 'monetization-ip-expansion'
  | 'continuous-learning';

export type LifecycleStatus =
  | 'draft'
  | 'queued'
  | 'running'
  | 'blocked'
  | 'human-review'
  | 'approved'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'archived';

export type LifecyclePriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface LifecycleStageExecution {
  id: string;
  stage: LifecycleStage;
  status: LifecycleStatus;
  sequence: number;
  assignedAgentIds: string[];
  dependencyStageIds: string[];
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  qualityScore: number;
  confidenceScore: number;
  strategicValueScore: number;
  risks: string[];
  blockers: string[];
  recommendations: string[];
  startedAt: string;
  completedAt: string;
  humanApprovalRequired: boolean;
  humanApproved: boolean;
}

export interface LifecycleEvent {
  id: string;
  type: string;
  stage: LifecycleStage;
  actor: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface LifecycleDecision {
  id: string;
  stage: LifecycleStage;
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

export interface MediaLifecycleProject {
  id: string;
  name: string;
  description: string;
  owner: string;
  priority: LifecyclePriority;
  status: LifecycleStatus;

  projectId: string;
  brandId: string;
  channelId: string;
  contentId: string;
  ipAssetId: string;

  platform: string;
  region: string;
  language: string;
  audience: string;

  currentStage: LifecycleStage;
  stageExecutions: LifecycleStageExecution[];
  events: LifecycleEvent[];
  decisions: LifecycleDecision[];

  budget: number;
  revenue: number;
  cost: number;
  profit: number;

  opportunityScore: number;
  researchScore: number;
  strategyScore: number;
  contentScore: number;
  productionScore: number;
  qualityScore: number;
  complianceScore: number;
  distributionScore: number;
  growthScore: number;
  monetizationScore: number;
  learningScore: number;
  overallScore: number;

  risks: string[];
  opportunities: string[];
  recommendations: string[];
  lessons: string[];
  tags: string[];

  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;
  autonomousExecutionEnabled: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateLifecycleProjectInput {
  name: string;
  description?: string;
  owner: string;
  priority?: LifecyclePriority;

  projectId?: string;
  brandId?: string;
  channelId?: string;
  contentId?: string;
  ipAssetId?: string;

  platform?: string;
  region?: string;
  language?: string;
  audience?: string;

  budget?: number;
  revenue?: number;
  cost?: number;

  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  lessons?: string[];
  tags?: string[];

  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  autonomousExecutionEnabled?: boolean;
}

export abstract class MediaAutonomousLifecycleEngineBase {
  private readonly projects =
    new Map<string, MediaLifecycleProject>();

  private readonly orderedStages: LifecycleStage[] = [
    'opportunity-discovery',
    'concept-development',
    'research-validation',
    'strategic-planning',
    'content-creation',
    'production',
    'quality-assurance',
    'governance-approval',
    'publishing-distribution',
    'growth-optimization',
    'monetization-ip-expansion',
    'continuous-learning',
  ];

  protected constructor(
    private readonly engineName: string,
    private readonly managedStage: LifecycleStage,
  ) {}

  getDashboard() {
    const projects = [...this.projects.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture:
        'AVOS Media Autonomous Content Lifecycle',
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

      pendingHumanReview: projects.filter(
        (project) =>
          project.status === 'human-review',
      ).length,

      completedProjects: projects.filter(
        (project) =>
          project.status === 'completed',
      ).length,

      autonomousProjects: projects.filter(
        (project) =>
          project.autonomousExecutionEnabled,
      ).length,

      totalRevenue: Number(
        projects
          .reduce(
            (total, project) =>
              total + project.revenue,
            0,
          )
          .toFixed(2),
      ),

      totalProfit: Number(
        projects
          .reduce(
            (total, project) =>
              total + project.profit,
            0,
          )
          .toFixed(2),
      ),

      averageOverallScore: this.average(
        projects.map(
          (project) => project.overallScore,
        ),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  getLifecycleBlueprint() {
    return {
      architecture:
        'AVOS Media Autonomous Content Lifecycle',
      stages: this.orderedStages.map(
        (stage, index) => ({
          sequence: index + 1,
          stage,
          requiresPreviousStage:
            index > 0,
          humanApprovalGate:
            stage === 'governance-approval' ||
            stage ===
              'monetization-ip-expansion',
        }),
      ),
      operatingPrinciples: [
        'foundation-first',
        'capability-first',
        'blueprint-driven',
        'shared-intelligence',
        'agent-team-collaboration',
        'continuous-learning',
        'human-final-authority',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  createProject(
    input: CreateLifecycleProjectInput,
  ): MediaLifecycleProject {
    const name = input.name?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Lifecycle project name is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Lifecycle project owner is required',
      );
    }

    const budget = this.nonNegative(
      input.budget ?? 0,
      'budget',
    );

    const revenue = this.nonNegative(
      input.revenue ?? 0,
      'revenue',
    );

    const cost = this.nonNegative(
      input.cost ?? 0,
      'cost',
    );

    const now = new Date().toISOString();

    const stageExecutions =
      this.orderedStages.map(
        (stage, index): LifecycleStageExecution => ({
          id: randomUUID(),
          stage,
          status:
            index === 0 ? 'queued' : 'draft',
          sequence: index + 1,
          assignedAgentIds: [],
          dependencyStageIds:
            index === 0
              ? []
              : [
                  this.orderedStages[
                    index - 1
                  ]!,
                ],
          inputs: {},
          outputs: {},
          qualityScore: 0,
          confidenceScore: 0,
          strategicValueScore: 0,
          risks: [],
          blockers: [],
          recommendations: [],
          startedAt: '',
          completedAt: '',
          humanApprovalRequired:
            stage === 'governance-approval' ||
            stage ===
              'monetization-ip-expansion',
          humanApproved: false,
        }),
      );

    const project: MediaLifecycleProject = {
      id: randomUUID(),
      name,
      description:
        input.description?.trim() ?? '',
      owner,
      priority: input.priority ?? 'medium',
      status: 'draft',

      projectId:
        input.projectId?.trim() ?? '',
      brandId: input.brandId?.trim() ?? '',
      channelId:
        input.channelId?.trim() ?? '',
      contentId:
        input.contentId?.trim() ?? '',
      ipAssetId:
        input.ipAssetId?.trim() ?? '',

      platform:
        input.platform?.trim().toLowerCase() ??
        'global',

      region:
        input.region?.trim().toLowerCase() ??
        'global',

      language:
        input.language?.trim().toLowerCase() ??
        'en',

      audience:
        input.audience?.trim() ??
        'general audience',

      currentStage: 'opportunity-discovery',
      stageExecutions,
      events: [],
      decisions: [],

      budget,
      revenue,
      cost,
      profit: Number(
        (revenue - cost).toFixed(2),
      ),

      opportunityScore: 0,
      researchScore: 0,
      strategyScore: 0,
      contentScore: 0,
      productionScore: 0,
      qualityScore: 0,
      complianceScore: 0,
      distributionScore: 0,
      growthScore: 0,
      monetizationScore: 0,
      learningScore: 0,
      overallScore: 0,

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

      metadata: input.metadata ?? {},

      humanApprovalRequired:
        input.humanApprovalRequired ?? true,

      humanApproved: false,

      autonomousExecutionEnabled:
        input.autonomousExecutionEnabled ??
        false,

      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);

    this.appendEvent(
      project.id,
      'lifecycle-project-created',
      'system',
      {
        stageCount: this.orderedStages.length,
      },
    );

    return this.getProject(project.id);
  }

  listProjects(filters?: {
    status?: LifecycleStatus;
    priority?: LifecyclePriority;
    stage?: LifecycleStage;
    owner?: string;
    platform?: string;
    region?: string;
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

        if (
          filters?.platform &&
          project.platform !==
            filters.platform.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.region &&
          project.region !==
            filters.region.toLowerCase()
        ) {
          return false;
        }

        if (search) {
          const searchable = [
            project.name,
            project.description,
            project.owner,
            project.platform,
            project.region,
            project.language,
            project.audience,
            ...project.risks,
            ...project.opportunities,
            ...project.recommendations,
            ...project.lessons,
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
          second.overallScore -
          first.overallScore,
      );
  }

  getProject(id: string) {
    const project = this.projects.get(id);

    if (!project) {
      throw new NotFoundException(
        `Lifecycle project '${id}' was not found`,
      );
    }

    return project;
  }

  updateProject(
    id: string,
    input: Partial<MediaLifecycleProject>,
  ) {
    const current = this.getProject(id);

    const revenue =
      input.revenue !== undefined
        ? this.nonNegative(
            input.revenue,
            'revenue',
          )
        : current.revenue;

    const cost =
      input.cost !== undefined
        ? this.nonNegative(
            input.cost,
            'cost',
          )
        : current.cost;

    const updated: MediaLifecycleProject = {
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

      platform:
        input.platform?.trim().toLowerCase() ??
        current.platform,

      region:
        input.region?.trim().toLowerCase() ??
        current.region,

      language:
        input.language?.trim().toLowerCase() ??
        current.language,

      audience:
        input.audience?.trim() ??
        current.audience,

      budget:
        input.budget !== undefined
          ? this.nonNegative(
              input.budget,
              'budget',
            )
          : current.budget,

      revenue,
      cost,
      profit: Number(
        (revenue - cost).toFixed(2),
      ),

      opportunityScore:
        input.opportunityScore !== undefined
          ? this.score(
              input.opportunityScore,
            )
          : current.opportunityScore,

      researchScore:
        input.researchScore !== undefined
          ? this.score(input.researchScore)
          : current.researchScore,

      strategyScore:
        input.strategyScore !== undefined
          ? this.score(input.strategyScore)
          : current.strategyScore,

      contentScore:
        input.contentScore !== undefined
          ? this.score(input.contentScore)
          : current.contentScore,

      productionScore:
        input.productionScore !== undefined
          ? this.score(
              input.productionScore,
            )
          : current.productionScore,

      qualityScore:
        input.qualityScore !== undefined
          ? this.score(input.qualityScore)
          : current.qualityScore,

      complianceScore:
        input.complianceScore !== undefined
          ? this.score(
              input.complianceScore,
            )
          : current.complianceScore,

      distributionScore:
        input.distributionScore !== undefined
          ? this.score(
              input.distributionScore,
            )
          : current.distributionScore,

      growthScore:
        input.growthScore !== undefined
          ? this.score(input.growthScore)
          : current.growthScore,

      monetizationScore:
        input.monetizationScore !== undefined
          ? this.score(
              input.monetizationScore,
            )
          : current.monetizationScore,

      learningScore:
        input.learningScore !== undefined
          ? this.score(input.learningScore)
          : current.learningScore,

      overallScore:
        input.overallScore !== undefined
          ? this.score(input.overallScore)
          : current.overallScore,

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

  startLifecycle(id: string) {
    const project = this.getProject(id);

    if (
      project.autonomousExecutionEnabled &&
      project.humanApprovalRequired &&
      !project.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before autonomous lifecycle execution',
      );
    }

    this.updateStage(id, 'opportunity-discovery', {
      status: 'running',
      startedAt: new Date().toISOString(),
    });

    this.appendEvent(
      id,
      'lifecycle-started',
      'system',
      {
        autonomous:
          project.autonomousExecutionEnabled,
      },
    );

    return this.updateProject(id, {
      status: 'running',
      currentStage: 'opportunity-discovery',
    });
  }

  approveAutonomousExecution(
    id: string,
    approvedBy: string,
  ) {
    const project = this.getProject(id);

    const decision: LifecycleDecision = {
      id: randomUUID(),
      stage: project.currentStage,
      title:
        'Approve autonomous lifecycle execution',
      recommendation:
        'Allow controlled autonomous stage execution',
      rationale:
        'Approved under Human Final Authority',
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
        `Current lifecycle stage is '${project.currentStage}', not '${this.managedStage}'`,
      );
    }

    const stageExecution = this.getStageExecution(
      id,
      this.managedStage,
    );

    if (
      stageExecution.humanApprovalRequired &&
      !stageExecution.humanApproved
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
        stageExecution.startedAt ||
        new Date().toISOString(),
    });

    this.appendEvent(
      id,
      'stage-execution-started',
      'system',
      {
        stage: this.managedStage,
      },
    );

    return this.getProject(id);
  }

  completeManagedStage(
    id: string,
    input?: {
      outputs?: Record<string, unknown>;
      qualityScore?: number;
      confidenceScore?: number;
      strategicValueScore?: number;
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
    stage: LifecycleStage,
    input?: {
      outputs?: Record<string, unknown>;
      qualityScore?: number;
      confidenceScore?: number;
      strategicValueScore?: number;
      risks?: string[];
      recommendations?: string[];
    },
  ) {
    const project = this.getProject(id);
    const execution =
      this.getStageExecution(id, stage);

    if (
      execution.humanApprovalRequired &&
      !execution.humanApproved
    ) {
      throw new BadRequestException(
        `Human approval is required before completing '${stage}'`,
      );
    }

    this.updateStage(id, stage, {
      status: 'completed',
      outputs: input?.outputs ?? {},
      qualityScore: this.score(
        input?.qualityScore ?? 0,
      ),
      confidenceScore: this.score(
        input?.confidenceScore ?? 0,
      ),
      strategicValueScore: this.score(
        input?.strategicValueScore ?? 0,
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

    const stageIndex =
      this.orderedStages.indexOf(stage);

    const nextStage =
      this.orderedStages[stageIndex + 1];

    const scoreUpdates =
      this.getProjectScoreUpdate(
        stage,
        input?.qualityScore ?? 0,
      );

    if (!nextStage) {
      const updated = this.updateProject(id, {
        ...scoreUpdates,
        currentStage: 'continuous-learning',
        status: 'completed',
      });

      this.recalculateOverallScore(id);

      this.appendEvent(
        id,
        'lifecycle-completed',
        'system',
        {
          completedStages:
            this.orderedStages.length,
        },
      );

      return updated;
    }

    this.updateStage(id, nextStage, {
      status: 'queued',
    });

    this.updateProject(id, {
      ...scoreUpdates,
      currentStage: nextStage,
      status: 'running',
    });

    this.recalculateOverallScore(id);

    this.appendEvent(
      id,
      'stage-completed',
      'system',
      {
        completedStage: stage,
        nextStage,
      },
    );

    return this.getProject(id);
  }

  submitStageForHumanReview(
    id: string,
    stage: LifecycleStage,
  ) {
    this.updateStage(id, stage, {
      status: 'human-review',
    });

    this.updateProject(id, {
      status: 'human-review',
      currentStage: stage,
    });

    this.appendEvent(
      id,
      'stage-submitted-for-human-review',
      'system',
      { stage },
    );

    return this.getProject(id);
  }

  approveStage(
    id: string,
    stage: LifecycleStage,
    approvedBy: string,
  ) {
    const project = this.getProject(id);

    this.updateStage(id, stage, {
      status: 'approved',
      humanApproved: true,
    });

    const decision: LifecycleDecision = {
      id: randomUUID(),
      stage,
      title: `Approve ${stage}`,
      recommendation:
        'Proceed to lifecycle execution',
      rationale:
        'Validated by Human Final Authority',
      confidence: 100,
      expectedImpact: 100,
      status: 'approved',
      humanApproved: true,
      decidedBy:
        approvedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
    };

    this.updateProject(id, {
      status: 'running',
      decisions: [
        ...project.decisions,
        decision,
      ],
    });

    this.appendEvent(
      id,
      'stage-approved-by-human',
      approvedBy || 'Human Final Authority',
      { stage },
    );

    return this.getProject(id);
  }

  rejectStage(
    id: string,
    stage: LifecycleStage,
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

    const decision: LifecycleDecision = {
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

  blockStage(
    id: string,
    stage: LifecycleStage,
    blocker: string,
  ) {
    const execution =
      this.getStageExecution(id, stage);

    this.updateStage(id, stage, {
      status: 'blocked',
      blockers: [
        ...new Set([
          ...execution.blockers,
          blocker?.trim() ||
            'Unknown blocker',
        ]),
      ],
    });

    return this.updateProject(id, {
      status: 'blocked',
      currentStage: stage,
    });
  }

  resumeStage(
    id: string,
    stage: LifecycleStage,
  ) {
    this.updateStage(id, stage, {
      status: 'running',
      blockers: [],
    });

    return this.updateProject(id, {
      status: 'running',
      currentStage: stage,
    });
  }

  runAutomaticTransition(id: string) {
    const project = this.getProject(id);

    if (!project.autonomousExecutionEnabled) {
      throw new BadRequestException(
        'Autonomous lifecycle execution is disabled',
      );
    }

    if (
      project.humanApprovalRequired &&
      !project.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before autonomous transition',
      );
    }

    const execution =
      this.getStageExecution(
        id,
        project.currentStage,
      );

    if (execution.status === 'completed') {
      const index = this.orderedStages.indexOf(
        project.currentStage,
      );

      const nextStage =
        this.orderedStages[index + 1];

      if (!nextStage) {
        return this.updateProject(id, {
          status: 'completed',
        });
      }

      this.updateStage(id, nextStage, {
        status: 'running',
        startedAt: new Date().toISOString(),
      });

      return this.updateProject(id, {
        currentStage: nextStage,
        status: 'running',
      });
    }

    if (
      execution.humanApprovalRequired &&
      !execution.humanApproved
    ) {
      return this.submitStageForHumanReview(
        id,
        execution.stage,
      );
    }

    this.updateStage(id, execution.stage, {
      status: 'running',
      startedAt:
        execution.startedAt ||
        new Date().toISOString(),
    });

    return this.getProject(id);
  }

  addLearning(
    id: string,
    lesson: string,
  ) {
    const project = this.getProject(id);
    const normalized = lesson?.trim();

    if (!normalized) {
      throw new BadRequestException(
        'Learning entry is required',
      );
    }

    return this.updateProject(id, {
      lessons: [
        ...new Set([
          ...project.lessons,
          normalized,
        ]),
      ],
    });
  }

  generateLifecycleReport(id: string) {
    const project = this.getProject(id);

    const completedStages =
      project.stageExecutions.filter(
        (stage) => stage.status === 'completed',
      ).length;

    return {
      project,
      lifecycleProgress: Number(
        (
          (completedStages /
            this.orderedStages.length) *
          100
        ).toFixed(2),
      ),
      completedStages,
      totalStages: this.orderedStages.length,
      currentStage: project.currentStage,
      financialPerformance: {
        budget: project.budget,
        revenue: project.revenue,
        cost: project.cost,
        profit: project.profit,
        returnOnInvestment:
          project.cost > 0
            ? Number(
                (
                  (project.profit /
                    project.cost) *
                  100
                ).toFixed(2),
              )
            : project.revenue > 0
              ? 100
              : 0,
      },
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateNextBestAction(id: string) {
    const project = this.getProject(id);

    const execution =
      this.getStageExecution(
        id,
        project.currentStage,
      );

    let action = 'continue-stage-execution';

    if (project.status === 'blocked') {
      action = 'resolve-stage-blockers';
    } else if (
      execution.humanApprovalRequired &&
      !execution.humanApproved
    ) {
      action = 'request-human-approval';
    } else if (
      execution.status === 'completed'
    ) {
      action = 'advance-to-next-stage';
    } else if (
      project.status === 'completed'
    ) {
      action =
        'reinvest-learnings-into-new-opportunities';
    }

    return {
      projectId: project.id,
      currentStage: project.currentStage,
      stageStatus: execution.status,
      nextBestAction: action,
      blockers: execution.blockers,
      recommendations:
        execution.recommendations,
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

  private getStageExecution(
    projectId: string,
    stage: LifecycleStage,
  ) {
    const project = this.getProject(projectId);

    const execution =
      project.stageExecutions.find(
        (item) => item.stage === stage,
      );

    if (!execution) {
      throw new NotFoundException(
        `Lifecycle stage '${stage}' was not found`,
      );
    }

    return execution;
  }

  private updateStage(
    projectId: string,
    stage: LifecycleStage,
    input: Partial<LifecycleStageExecution>,
  ) {
    const project = this.getProject(projectId);

    const stageExecutions =
      project.stageExecutions.map(
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
      );

    return this.updateProject(projectId, {
      stageExecutions,
    });
  }

  private appendEvent(
    projectId: string,
    type: string,
    actor: string,
    payload: Record<string, unknown>,
  ) {
    const project = this.getProject(projectId);

    const event: LifecycleEvent = {
      id: randomUUID(),
      type,
      stage: project.currentStage,
      actor,
      payload,
      occurredAt: new Date().toISOString(),
    };

    this.updateProject(projectId, {
      events: [...project.events, event],
    });

    return event;
  }

  private getProjectScoreUpdate(
    stage: LifecycleStage,
    score: number,
  ): Partial<MediaLifecycleProject> {
    const normalized = this.score(score);

    switch (stage) {
      case 'opportunity-discovery':
      case 'concept-development':
        return {
          opportunityScore: normalized,
        };

      case 'research-validation':
        return {
          researchScore: normalized,
        };

      case 'strategic-planning':
        return {
          strategyScore: normalized,
        };

      case 'content-creation':
        return {
          contentScore: normalized,
        };

      case 'production':
        return {
          productionScore: normalized,
        };

      case 'quality-assurance':
        return {
          qualityScore: normalized,
        };

      case 'governance-approval':
        return {
          complianceScore: normalized,
        };

      case 'publishing-distribution':
        return {
          distributionScore: normalized,
        };

      case 'growth-optimization':
        return {
          growthScore: normalized,
        };

      case 'monetization-ip-expansion':
        return {
          monetizationScore: normalized,
        };

      case 'continuous-learning':
        return {
          learningScore: normalized,
        };

      default:
        return {};
    }
  }

  private recalculateOverallScore(id: string) {
    const project = this.getProject(id);

    const overallScore =
      project.opportunityScore * 0.1 +
      project.researchScore * 0.08 +
      project.strategyScore * 0.1 +
      project.contentScore * 0.1 +
      project.productionScore * 0.1 +
      project.qualityScore * 0.1 +
      project.complianceScore * 0.1 +
      project.distributionScore * 0.08 +
      project.growthScore * 0.08 +
      project.monetizationScore * 0.1 +
      project.learningScore * 0.06;

    return this.updateProject(id, {
      overallScore: Number(
        overallScore.toFixed(2),
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
