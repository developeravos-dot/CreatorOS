import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AutonomousMediaProject,
  CreateAutonomousMediaProjectInput,
} from './autonomous-media-operations.types';
import { MediaExperimentService } from './media-experiment.service';
import { MediaMemoryService } from './media-memory.service';

@Injectable()
export class AutonomousMediaOperationsService {
  private readonly projects = new Map<string, AutonomousMediaProject>();

  constructor(
    private readonly memory: MediaMemoryService,
    private readonly experiments: MediaExperimentService,
  ) {}

  getDashboard() {
    const projects = [...this.projects.values()];
    return {
      system: 'AVOS Autonomous Media Operations',
      operational: true,
      projects: projects.length,
      awaitingHumanApproval: projects.filter((item) => item.status === 'awaiting-human-approval').length,
      scheduled: projects.filter((item) => item.status === 'scheduled').length,
      running: projects.filter((item) => item.status === 'running').length,
      completed: projects.filter((item) => item.status === 'completed').length,
      memoryEntries: this.memory.list().length,
      experiments: this.experiments.list().length,
      capabilities: [
        'Persistent Media Memory',
        'Autonomous Operations Planner',
        'Publishing Scheduler',
        'Analytics and Learning Engine',
        'Experimentation Engine',
        'Opportunity Radar',
        'Global Localization Engine',
        'Licensing and Partnership Engine',
        'Human Final Authority',
      ],
    };
  }

  createProject(input: CreateAutonomousMediaProjectInput) {
    this.validateInput(input);
    const now = new Date().toISOString();
    const id = `amo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const platforms = this.clean(input.platforms);
    const languages = this.clean(input.languages ?? ['Arabic', 'English']);
    const markets = this.clean(input.markets ?? ['UAE', 'GCC', 'Global']);
    const cadence = input.publishingCadence?.trim() || 'weekly';

    const project: AutonomousMediaProject = {
      id,
      status: 'awaiting-human-approval',
      createdAt: now,
      updatedAt: now,
      input: {
        ...input,
        name: input.name.trim(),
        brandName: input.brandName.trim(),
        contentType: input.contentType.trim(),
        audience: input.audience.trim(),
        platforms,
        languages,
        markets,
        objectives: this.clean(input.objectives ?? ['audience growth', 'brand equity', 'IP creation', 'revenue']),
        publishingCadence: cadence,
      },
      governance: { humanFinalAuthority: true, approved: false },
      strategy: {
        contentPillars: [
          'original flagship formats',
          'repeatable series',
          'short-form discovery',
          'community participation',
          'IP expansion',
        ],
        decisionPolicy: 'AI proposes and executes reversible operations; strategic changes require human approval',
        portfolioModel: ['core brand', 'channels', 'formats', 'characters', 'series', 'licensed assets'],
      },
      operations: {
        workflow: [
          'research',
          'opportunity scoring',
          'concept design',
          'script',
          'production',
          'quality assurance',
          'human approval',
          'publishing',
          'distribution',
          'analytics',
          'learning',
        ],
        autonomousAgents: [
          'Research Agent',
          'Opportunity Agent',
          'Creative Director Agent',
          'Production Agent',
          'Publishing Agent',
          'Growth Agent',
          'Revenue Agent',
          'IP Agent',
          'Learning Agent',
        ],
        safetyGates: ['originality', 'copyright', 'brand', 'cultural', 'platform', 'human final approval'],
      },
      localization: {
        languages,
        markets,
        adaptationLayers: ['translation', 'cultural context', 'voice casting', 'visual adaptation', 'platform packaging'],
      },
      analytics: {
        northStar: 'qualified audience value',
        metrics: ['retention', 'completion', 'engagement', 'conversion', 'brand recall', 'revenue', 'IP value'],
        learningLoop: ['collect', 'normalize', 'explain', 'recommend', 'approve', 'apply', 'measure'],
      },
      opportunities: {
        radar: ['trends', 'underserved audiences', 'format gaps', 'brand partnerships', 'licensing demand'],
        scoring: ['strategic fit', 'originality', 'market size', 'speed', 'cost', 'risk', 'IP potential'],
      },
      licensing: {
        assets: ['characters', 'formats', 'series', 'music', 'visual identity', 'educational products'],
        channels: ['direct licensing', 'co-production', 'distribution partnership', 'franchise', 'merchandising'],
      },
      schedule: { cadence, active: false },
      metrics: {
        readiness: 70,
        productionScore: 65,
        distributionScore: 60,
        monetizationScore: 55,
        learningScore: 60,
      },
    };

    this.projects.set(id, project);
    this.memory.remember(id, 'project-created', `Created autonomous media project ${project.input.name}`, {
      platforms,
      languages,
      markets,
    });
    return project;
  }

  listProjects() {
    return [...this.projects.values()];
  }

  getProject(id: string) {
    const project = this.projects.get(id);
    if (!project) throw new NotFoundException(`Autonomous media project ${id} was not found`);
    return project;
  }

  approveProject(id: string, approvedBy = 'Human Final Authority') {
    const project = this.getProject(id);
    project.governance = {
      humanFinalAuthority: true,
      approved: true,
      approvedBy,
      approvedAt: new Date().toISOString(),
    };
    project.status = 'approved';
    project.updatedAt = new Date().toISOString();
    project.metrics.readiness = Math.max(project.metrics.readiness, 85);
    this.memory.remember(id, 'human-approval', `Project approved by ${approvedBy}`);
    return project;
  }

  scheduleProject(id: string, nextRunAt?: string) {
    const project = this.getProject(id);
    if (!project.governance.approved) {
      return { scheduled: false, reason: 'Human Final Authority approval is required', project };
    }
    const parsed = nextRunAt ? new Date(nextRunAt) : new Date(Date.now() + 60 * 60 * 1000);
    if (Number.isNaN(parsed.getTime())) throw new Error('nextRunAt must be a valid date');
    project.schedule = {
      cadence: project.schedule.cadence,
      nextRunAt: parsed.toISOString(),
      active: true,
    };
    project.status = 'scheduled';
    project.updatedAt = new Date().toISOString();
    this.memory.remember(id, 'scheduled', `Next autonomous run scheduled for ${project.schedule.nextRunAt}`);
    return { scheduled: true, project };
  }

  runCycle(id: string) {
    const project = this.getProject(id);
    if (!project.governance.approved) {
      return { executed: false, reason: 'Human Final Authority approval is required', project };
    }
    project.status = 'running';
    project.updatedAt = new Date().toISOString();

    const recommendations = [
      'Produce one flagship episode',
      'Generate three platform-specific cutdowns',
      'Run title and thumbnail experiment',
      'Localize the strongest asset for priority markets',
      'Evaluate licensing potential after performance review',
    ];

    project.metrics.productionScore = Math.min(100, project.metrics.productionScore + 8);
    project.metrics.distributionScore = Math.min(100, project.metrics.distributionScore + 7);
    project.metrics.learningScore = Math.min(100, project.metrics.learningScore + 10);
    project.metrics.readiness = Math.round(
      (project.metrics.productionScore +
        project.metrics.distributionScore +
        project.metrics.monetizationScore +
        project.metrics.learningScore) /
        4,
    );

    this.memory.remember(id, 'autonomous-cycle', 'Completed one autonomous planning and learning cycle', {
      recommendations,
      metrics: project.metrics,
    });
    return { executed: true, recommendations, project };
  }

  recordPerformance(id: string, metrics: Record<string, number>) {
    const project = this.getProject(id);
    const safeMetrics = Object.fromEntries(
      Object.entries(metrics ?? {}).filter(([, value]) => Number.isFinite(value)),
    );
    this.memory.remember(id, 'performance', 'Recorded normalized performance signals', safeMetrics);
    project.analytics = {
      ...project.analytics,
      latestPerformance: safeMetrics,
      lastAnalyzedAt: new Date().toISOString(),
    };
    project.metrics.learningScore = Math.min(100, project.metrics.learningScore + 5);
    project.updatedAt = new Date().toISOString();
    return project;
  }

  createExperiment(id: string, hypothesis: string, variants: string[], metric: string) {
    this.getProject(id);
    const experiment = this.experiments.create(id, hypothesis, variants, metric);
    this.memory.remember(id, 'experiment-created', `Created experiment ${experiment.id}`, { metric, variants });
    return experiment;
  }

  getProjectMemory(id: string) {
    this.getProject(id);
    return this.memory.latest(id, 50);
  }

  pauseProject(id: string) {
    const project = this.getProject(id);
    project.status = 'paused';
    project.schedule.active = false;
    project.updatedAt = new Date().toISOString();
    this.memory.remember(id, 'paused', 'Autonomous operations paused');
    return project;
  }

  completeProject(id: string) {
    const project = this.getProject(id);
    project.status = 'completed';
    project.schedule.active = false;
    project.updatedAt = new Date().toISOString();
    this.memory.remember(id, 'completed', 'Project cycle completed');
    return project;
  }

  private validateInput(input: CreateAutonomousMediaProjectInput) {
    if (!input?.name?.trim()) throw new Error('name is required');
    if (!input?.brandName?.trim()) throw new Error('brandName is required');
    if (!input?.contentType?.trim()) throw new Error('contentType is required');
    if (!input?.audience?.trim()) throw new Error('audience is required');
    if (!Array.isArray(input.platforms) || input.platforms.length === 0) {
      throw new Error('platforms must contain at least one platform');
    }
  }

  private clean(values: string[]) {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  }
}
