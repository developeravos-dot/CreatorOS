import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type CreativeMediaStatus =
  | 'draft'
  | 'planned'
  | 'running'
  | 'human-review'
  | 'approved'
  | 'blocked'
  | 'completed'
  | 'rejected'
  | 'archived';

export type CreativeMediaStage =
  | 'content-intelligence'
  | 'audience-intelligence'
  | 'production-strategy'
  | 'creative-direction'
  | 'script-intelligence'
  | 'storyboard-intelligence'
  | 'visual-style-intelligence'
  | 'cinematography-intelligence'
  | 'lighting-intelligence'
  | 'character-intelligence'
  | 'voice-intelligence'
  | 'music-intelligence'
  | 'sound-design-intelligence'
  | 'editing-intelligence'
  | 'model-routing'
  | 'production-council'
  | 'creative-quality-assurance'
  | 'brand-strategy'
  | 'brand-naming'
  | 'brand-personality'
  | 'visual-dna'
  | 'logo-intelligence'
  | 'banner-intelligence'
  | 'thumbnail-intelligence'
  | 'brand-design-system'
  | 'brand-book'
  | 'creative-asset-library'
  | 'creative-template-engine'
  | 'multilingual-creative-adaptation'
  | 'multicultural-adaptation'
  | 'multiplatform-adaptation'
  | 'creative-experimentation'
  | 'creative-analytics'
  | 'creative-learning'
  | 'ecosystem-orchestration'
  | 'channel-network-intelligence'
  | 'cross-promotion-intelligence'
  | 'audience-sharing-intelligence'
  | 'global-media-orchestration'
  | 'human-final-authority';

export interface CreativeAgent {
  id: string;
  role: string;
  name: string;
  capabilities: string[];
  active: boolean;
}

export interface CreativeDecision {
  id: string;
  stage: CreativeMediaStage;
  title: string;
  recommendation: string;
  rationale: string;
  confidenceScore: number;
  expectedImpactScore: number;
  status: 'proposed' | 'human-review' | 'approved' | 'rejected' | 'executed';
  decidedBy: string;
  decidedAt: string;
  humanApproved: boolean;
}

export interface CreativeStageExecution {
  id: string;
  stage: CreativeMediaStage;
  sequence: number;
  status: CreativeMediaStatus;
  dependencies: CreativeMediaStage[];
  assignedAgentIds: string[];
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  qualityScore: number;
  confidenceScore: number;
  consistencyScore: number;
  originalityScore: number;
  marketFitScore: number;
  culturalFitScore: number;
  platformFitScore: number;
  risks: string[];
  blockers: string[];
  recommendations: string[];
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  startedAt: string;
  completedAt: string;
}

export interface BrandIdentity {
  name: string;
  tagline: string;
  personality: string[];
  toneOfVoice: string[];
  colors: string[];
  fonts: string[];
  iconStyle: string;
  visualStyle: string;
  logoPrompt: string;
  bannerPrompt: string;
  thumbnailSystem: string;
  audioIdentity: string;
  characterSystem: string;
  brandBook: Record<string, unknown>;
}

export interface ProductionBlueprint {
  format: string;
  productionStyle: 'realistic' | 'cinematic' | 'animation' | 'anime' | 'hybrid';
  aspectRatio: string;
  durationSeconds: number;
  frameRate: number;
  cameraLanguage: string[];
  lightingPlan: string[];
  colorDirection: string[];
  editingRhythm: string;
  voiceProfile: string;
  musicDirection: string;
  soundDirection: string;
  aiModels: string[];
  tools: string[];
}

export interface CreativeMediaProject {
  id: string;
  name: string;
  description: string;
  contentType: string;
  targetAudience: string[];
  ageGroups: string[];
  platforms: string[];
  languages: string[];
  cultures: string[];
  markets: string[];
  status: CreativeMediaStatus;
  currentStage: CreativeMediaStage;
  stages: CreativeStageExecution[];
  agents: CreativeAgent[];
  brandIdentity: BrandIdentity;
  productionBlueprint: ProductionBlueprint;
  assets: Record<string, unknown>[];
  templates: Record<string, unknown>[];
  experiments: Record<string, unknown>[];
  analytics: Record<string, unknown>;
  decisions: CreativeDecision[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  lessons: string[];
  autonomousExecutionEnabled: boolean;
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCreativeMediaProjectInput {
  name: string;
  description?: string;
  contentType: string;
  targetAudience?: string[];
  ageGroups?: string[];
  platforms?: string[];
  languages?: string[];
  cultures?: string[];
  markets?: string[];
  autonomousExecutionEnabled?: boolean;
  humanApprovalRequired?: boolean;
}

export abstract class CreativeMediaEcosystemEngineBase {
  private readonly projects = new Map<string, CreativeMediaProject>();

  private readonly orderedStages: CreativeMediaStage[] = [
    'content-intelligence',
    'audience-intelligence',
    'production-strategy',
    'creative-direction',
    'script-intelligence',
    'storyboard-intelligence',
    'visual-style-intelligence',
    'cinematography-intelligence',
    'lighting-intelligence',
    'character-intelligence',
    'voice-intelligence',
    'music-intelligence',
    'sound-design-intelligence',
    'editing-intelligence',
    'model-routing',
    'production-council',
    'creative-quality-assurance',
    'brand-strategy',
    'brand-naming',
    'brand-personality',
    'visual-dna',
    'logo-intelligence',
    'banner-intelligence',
    'thumbnail-intelligence',
    'brand-design-system',
    'brand-book',
    'creative-asset-library',
    'creative-template-engine',
    'multilingual-creative-adaptation',
    'multicultural-adaptation',
    'multiplatform-adaptation',
    'creative-experimentation',
    'creative-analytics',
    'creative-learning',
    'ecosystem-orchestration',
    'channel-network-intelligence',
    'cross-promotion-intelligence',
    'audience-sharing-intelligence',
    'global-media-orchestration',
    'human-final-authority',
  ];

  protected constructor(
    private readonly engineName: string,
    private readonly managedStage: CreativeMediaStage,
  ) {}

  getDashboard() {
    const projects = [...this.projects.values()];
    return {
      engine: this.engineName,
      version: '1.0.0',
      architecture: 'AVOS Creative Production Intelligence + Brand Intelligence + Media Ecosystem',
      managedStage: this.managedStage,
      totalStages: this.orderedStages.length,
      totalProjects: projects.length,
      runningProjects: projects.filter((x) => x.status === 'running').length,
      completedProjects: projects.filter((x) => x.status === 'completed').length,
      pendingHumanApproval: projects.filter((x) => x.humanApprovalRequired && !x.humanApproved).length,
      humanFinalAuthority: true,
      status: 'operational' as const,
      updatedAt: new Date().toISOString(),
    };
  }

  getBlueprint() {
    return {
      name: 'AVOS Creative Media Ecosystem Blueprint',
      version: '1.0.0',
      stages: this.orderedStages.map((stage, index) => ({
        sequence: index + 1,
        stage,
        previousStage: index === 0 ? null : this.orderedStages[index - 1],
        nextStage: index === this.orderedStages.length - 1 ? null : this.orderedStages[index + 1],
        humanApprovalGate: this.requiresHumanApproval(stage),
      })),
      councils: [
        'executive-producer',
        'director',
        'screenwriter',
        'art-director',
        'cinematographer',
        'editor',
        'sound-director',
        'music-supervisor',
        'brand-strategist',
        'cultural-adaptation-specialist',
        'quality-director',
      ],
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  createProject(input: CreateCreativeMediaProjectInput): CreativeMediaProject {
    if (!input.name?.trim()) throw new BadRequestException('Project name is required');
    if (!input.contentType?.trim()) throw new BadRequestException('Content type is required');

    const now = new Date().toISOString();
    const stages = this.orderedStages.map((stage, index): CreativeStageExecution => ({
      id: randomUUID(),
      stage,
      sequence: index + 1,
      status: index === 0 ? 'planned' : 'draft',
      dependencies: index === 0 ? [] : [this.orderedStages[index - 1]!],
      assignedAgentIds: [],
      inputs: {},
      outputs: {},
      qualityScore: 0,
      confidenceScore: 0,
      consistencyScore: 0,
      originalityScore: 0,
      marketFitScore: 0,
      culturalFitScore: 0,
      platformFitScore: 0,
      risks: [],
      blockers: [],
      recommendations: [],
      humanApprovalRequired: this.requiresHumanApproval(stage),
      humanApproved: false,
      startedAt: '',
      completedAt: '',
    }));

    const project: CreativeMediaProject = {
      id: randomUUID(),
      name: input.name.trim(),
      description: input.description?.trim() ?? '',
      contentType: input.contentType.trim(),
      targetAudience: this.normalize(input.targetAudience),
      ageGroups: this.normalize(input.ageGroups),
      platforms: this.normalize(input.platforms),
      languages: this.normalize(input.languages),
      cultures: this.normalize(input.cultures),
      markets: this.normalize(input.markets),
      status: 'draft',
      currentStage: 'content-intelligence',
      stages,
      agents: this.defaultAgents(),
      brandIdentity: {
        name: '', tagline: '', personality: [], toneOfVoice: [], colors: [], fonts: [],
        iconStyle: '', visualStyle: '', logoPrompt: '', bannerPrompt: '', thumbnailSystem: '',
        audioIdentity: '', characterSystem: '', brandBook: {},
      },
      productionBlueprint: {
        format: input.contentType.trim(), productionStyle: 'hybrid', aspectRatio: '16:9',
        durationSeconds: 60, frameRate: 24, cameraLanguage: [], lightingPlan: [],
        colorDirection: [], editingRhythm: '', voiceProfile: '', musicDirection: '',
        soundDirection: '', aiModels: [], tools: [],
      },
      assets: [], templates: [], experiments: [], analytics: {}, decisions: [],
      risks: [], opportunities: [], recommendations: [], lessons: [],
      autonomousExecutionEnabled: input.autonomousExecutionEnabled ?? false,
      humanApprovalRequired: input.humanApprovalRequired ?? true,
      humanApproved: false,
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);
    return project;
  }

  listProjects() { return [...this.projects.values()]; }

  getProject(id: string) {
    const project = this.projects.get(id);
    if (!project) throw new NotFoundException(`Creative media project '${id}' was not found`);
    return project;
  }

  updateProject(id: string, input: Partial<CreativeMediaProject>) {
    const current = this.getProject(id);
    const updated: CreativeMediaProject = {
      ...current,
      ...input,
      id: current.id,
      stages: input.stages ?? current.stages,
      agents: input.agents ?? current.agents,
      decisions: input.decisions ?? current.decisions,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  approveAutonomy(id: string, approvedBy: string) {
    const project = this.getProject(id);
    const decision: CreativeDecision = {
      id: randomUUID(), stage: project.currentStage, title: 'Approve controlled autonomy',
      recommendation: 'Enable controlled creative media execution',
      rationale: 'Approved by Human Final Authority', confidenceScore: 100,
      expectedImpactScore: 100, status: 'approved',
      decidedBy: approvedBy?.trim() || 'Human Final Authority',
      decidedAt: new Date().toISOString(), humanApproved: true,
    };
    return this.updateProject(id, { humanApproved: true, decisions: [...project.decisions, decision] });
  }

  startLifecycle(id: string) {
    const project = this.getProject(id);
    if (project.autonomousExecutionEnabled && project.humanApprovalRequired && !project.humanApproved) {
      throw new BadRequestException('Human approval is required before autonomous execution');
    }
    this.updateStage(id, 'content-intelligence', { status: 'running', startedAt: new Date().toISOString() });
    return this.updateProject(id, { status: 'running', currentStage: 'content-intelligence' });
  }

  executeManagedStage(id: string, input?: { assignedAgentIds?: string[]; inputs?: Record<string, unknown> }) {
    const project = this.getProject(id);
    if (project.currentStage !== this.managedStage) {
      throw new BadRequestException(`Current stage is '${project.currentStage}', not '${this.managedStage}'`);
    }
    const stage = this.getStage(id, this.managedStage);
    if (stage.humanApprovalRequired && !stage.humanApproved) {
      return this.submitHumanReview(id, this.managedStage);
    }
    this.updateStage(id, this.managedStage, {
      status: 'running',
      assignedAgentIds: [...new Set(input?.assignedAgentIds ?? [])],
      inputs: input?.inputs ?? {},
      startedAt: stage.startedAt || new Date().toISOString(),
    });
    return this.getProject(id);
  }

  completeManagedStage(id: string, input?: Partial<CreativeStageExecution>) {
    const project = this.getProject(id);
    const stage = this.getStage(id, this.managedStage);
    if (stage.humanApprovalRequired && !stage.humanApproved) {
      throw new BadRequestException(`Human approval is required before completing '${this.managedStage}'`);
    }

    this.updateStage(id, this.managedStage, {
      status: 'completed',
      outputs: input?.outputs ?? {},
      qualityScore: this.score(input?.qualityScore ?? 0),
      confidenceScore: this.score(input?.confidenceScore ?? 0),
      consistencyScore: this.score(input?.consistencyScore ?? 0),
      originalityScore: this.score(input?.originalityScore ?? 0),
      marketFitScore: this.score(input?.marketFitScore ?? 0),
      culturalFitScore: this.score(input?.culturalFitScore ?? 0),
      platformFitScore: this.score(input?.platformFitScore ?? 0),
      risks: input?.risks ?? [],
      recommendations: input?.recommendations ?? [],
      completedAt: new Date().toISOString(),
    });

    const index = this.orderedStages.indexOf(this.managedStage);
    const nextStage = this.orderedStages[index + 1];
    if (!nextStage) return this.updateProject(id, { status: 'completed' });
    this.updateStage(id, nextStage, { status: 'planned' });
    return this.updateProject(id, { status: 'running', currentStage: nextStage });
  }

  submitHumanReview(id: string, stage: CreativeMediaStage) {
    this.updateStage(id, stage, { status: 'human-review' });
    return this.updateProject(id, { status: 'human-review', currentStage: stage });
  }

  approveStage(id: string, stage: CreativeMediaStage, approvedBy: string) {
    const project = this.getProject(id);
    this.updateStage(id, stage, { status: 'approved', humanApproved: true });
    const decision: CreativeDecision = {
      id: randomUUID(), stage, title: `Approve ${stage}`,
      recommendation: 'Proceed with execution', rationale: 'Approved by Human Final Authority',
      confidenceScore: 100, expectedImpactScore: 100, status: 'approved',
      decidedBy: approvedBy?.trim() || 'Human Final Authority',
      decidedAt: new Date().toISOString(), humanApproved: true,
    };
    return this.updateProject(id, { status: 'running', decisions: [...project.decisions, decision] });
  }

  setBrandIdentity(id: string, input: Partial<BrandIdentity>) {
    const project = this.getProject(id);
    return this.updateProject(id, { brandIdentity: { ...project.brandIdentity, ...input } });
  }

  setProductionBlueprint(id: string, input: Partial<ProductionBlueprint>) {
    const project = this.getProject(id);
    return this.updateProject(id, { productionBlueprint: { ...project.productionBlueprint, ...input } });
  }

  addAsset(id: string, asset: Record<string, unknown>) {
    const project = this.getProject(id);
    return this.updateProject(id, { assets: [...project.assets, { id: randomUUID(), ...asset }] });
  }

  addTemplate(id: string, template: Record<string, unknown>) {
    const project = this.getProject(id);
    return this.updateProject(id, { templates: [...project.templates, { id: randomUUID(), ...template }] });
  }

  addExperiment(id: string, experiment: Record<string, unknown>) {
    const project = this.getProject(id);
    return this.updateProject(id, { experiments: [...project.experiments, { id: randomUUID(), ...experiment }] });
  }

  updateAnalytics(id: string, analytics: Record<string, unknown>) {
    const project = this.getProject(id);
    return this.updateProject(id, { analytics: { ...project.analytics, ...analytics } });
  }

  generateProductionPlan(id: string) {
    const project = this.getProject(id);
    return {
      projectId: project.id,
      contentType: project.contentType,
      audience: project.targetAudience,
      platforms: project.platforms,
      languages: project.languages,
      cultures: project.cultures,
      productionBlueprint: project.productionBlueprint,
      recommendedCouncil: project.agents.filter((x) => x.active),
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateBrandBook(id: string) {
    const project = this.getProject(id);
    return {
      projectId: project.id,
      identity: project.brandIdentity,
      usage: {
        logo: 'Use approved logo variants only',
        colors: project.brandIdentity.colors,
        fonts: project.brandIdentity.fonts,
        tone: project.brandIdentity.toneOfVoice,
        thumbnails: project.brandIdentity.thumbnailSystem,
      },
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateEcosystemReport(id: string) {
    const project = this.getProject(id);
    const completed = project.stages.filter((x) => x.status === 'completed').length;
    return {
      project,
      progressPercentage: Number(((completed / this.orderedStages.length) * 100).toFixed(2)),
      completedStages: completed,
      totalStages: this.orderedStages.length,
      activeAgents: project.agents.filter((x) => x.active).length,
      assetCount: project.assets.length,
      templateCount: project.templates.length,
      experimentCount: project.experiments.length,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  removeProject(id: string) {
    this.getProject(id);
    this.projects.delete(id);
    return { success: true as const, id };
  }

  private getStage(id: string, stage: CreativeMediaStage) {
    const execution = this.getProject(id).stages.find((x) => x.stage === stage);
    if (!execution) throw new NotFoundException(`Stage '${stage}' was not found`);
    return execution;
  }

  private updateStage(id: string, stage: CreativeMediaStage, input: Partial<CreativeStageExecution>) {
    const project = this.getProject(id);
    return this.updateProject(id, {
      stages: project.stages.map((x) => x.stage === stage ? { ...x, ...input, id: x.id, stage: x.stage, sequence: x.sequence } : x),
    });
  }

  private requiresHumanApproval(stage: CreativeMediaStage) {
    return [
      'production-strategy', 'creative-direction', 'production-council',
      'creative-quality-assurance', 'brand-strategy', 'brand-naming',
      'visual-dna', 'brand-book', 'ecosystem-orchestration',
      'global-media-orchestration', 'human-final-authority',
    ].includes(stage);
  }

  private score(value: number) {
    if (!Number.isFinite(value)) throw new BadRequestException('Score must be a valid number');
    return Number(Math.max(0, Math.min(100, value)).toFixed(2));
  }

  private normalize(values?: string[]) {
    return [...new Set((values ?? []).map((x) => x.trim().toLowerCase()).filter(Boolean))];
  }

  private defaultAgents(): CreativeAgent[] {
    const roles = [
      'executive-producer', 'director', 'screenwriter', 'art-director',
      'cinematographer', 'lighting-director', 'editor', 'voice-director',
      'music-supervisor', 'sound-designer', 'brand-strategist',
      'cultural-adaptation-specialist', 'platform-specialist', 'quality-director',
    ];
    return roles.map((role) => ({ id: randomUUID(), role, name: `AVOS ${role}`, capabilities: [role], active: true }));
  }
}
