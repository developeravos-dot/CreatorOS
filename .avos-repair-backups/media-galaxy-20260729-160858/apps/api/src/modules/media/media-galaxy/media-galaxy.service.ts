import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGalaxyProjectInput, GalaxyDecision, GalaxyProject } from './media-galaxy.types';
import { ExecutiveCouncilService } from './executive-council.service';
import { OrganizationOsService } from './organization-os.service';
import { KnowledgeFabricService } from './knowledge-fabric.service';
import { WorldModelService } from './world-model.service';
import { DigitalDnaService } from './digital-dna.service';
import { ContentFactoryService } from './content-factory.service';
import { RevenuePlatformService } from './revenue-platform.service';
import { GlobalExpansionService } from './global-expansion.service';
import { SecurityGovernanceService } from './security-governance.service';

@Injectable()
export class MediaGalaxyService {
  private readonly projects = new Map<string, GalaxyProject>();
  private readonly decisions = new Map<string, GalaxyDecision>();

  constructor(
    private readonly council: ExecutiveCouncilService,
    private readonly organizationOs: OrganizationOsService,
    private readonly knowledgeFabric: KnowledgeFabricService,
    private readonly worldModel: WorldModelService,
    private readonly digitalDna: DigitalDnaService,
    private readonly contentFactory: ContentFactoryService,
    private readonly revenuePlatform: RevenuePlatformService,
    private readonly globalExpansion: GlobalExpansionService,
    private readonly securityGovernance: SecurityGovernanceService,
  ) {}

  capabilities() {
    return {
      system: 'AVOS Media Galaxy',
      operational: true,
      layers: ['Executive Council', 'Organization OS', 'Knowledge Fabric', 'Digital DNA', 'World Model', 'Content Factory', 'Revenue Platform', 'Global Expansion', 'Security & Governance'],
      humanFinalAuthority: true,
    };
  }

  dashboard() {
    const projects = [...this.projects.values()];
    return {
      ...this.capabilities(),
      projects: projects.length,
      awaitingHumanApproval: projects.filter((item) => item.status === 'awaiting-human-approval').length,
      operationalProjects: projects.filter((item) => item.status === 'operational').length,
      decisions: this.decisions.size,
      memories: this.knowledgeFabric.list().length,
    };
  }

  createProject(input: CreateGalaxyProjectInput) {
    this.validate(input);
    const now = new Date().toISOString();
    const id = `galaxy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const languages = this.clean(input.languages ?? ['Arabic', 'English']);
    const markets = this.clean(input.markets ?? ['UAE', 'GCC', 'Global']);
    const project: GalaxyProject = {
      id,
      status: 'awaiting-human-approval',
      createdAt: now,
      updatedAt: now,
      input: { ...input, platforms: this.clean(input.platforms), languages, markets, revenueGoals: this.clean(input.revenueGoals ?? ['sustainable diversified revenue']) },
      executiveCouncil: this.council.build(),
      organization: this.organizationOs.design(),
      knowledge: this.knowledgeFabric.architecture(),
      digitalDna: this.digitalDna.build(input.name, input.audience, input.platforms),
      worldModel: this.worldModel.build(markets, input.audience),
      contentFactory: this.contentFactory.build(input.platforms, languages),
      revenuePlatform: this.revenuePlatform.build(input.revenueGoals ?? []),
      globalExpansion: this.globalExpansion.build(markets, languages),
      intelligence: { predictiveAnalytics: true, forecasting: true, recommendationEngine: true, opportunityEngine: true, scenarioSimulator: true },
      security: this.securityGovernance.build(),
      governance: { humanFinalAuthority: true, approved: false },
    };
    this.projects.set(id, project);
    this.knowledgeFabric.remember(id, 'project-created', `Created AVOS Media Galaxy project ${input.name}`, { mission: input.mission });
    return project;
  }

  listProjects() { return [...this.projects.values()]; }

  getProject(id: string) {
    const project = this.projects.get(id);
    if (!project) throw new NotFoundException(`Media Galaxy project ${id} was not found`);
    return project;
  }

  approveProject(id: string, approvedBy = 'Human Final Authority') {
    const project = this.getProject(id);
    project.status = 'approved';
    project.updatedAt = new Date().toISOString();
    project.governance = { humanFinalAuthority: true, approved: true, approvedBy, approvedAt: project.updatedAt };
    this.knowledgeFabric.remember(id, 'human-approval', `Project approved by ${approvedBy}`);
    return project;
  }

  activateProject(id: string) {
    const project = this.getProject(id);
    if (!project.governance.approved) return { activated: false, reason: 'Human Final Authority approval is required', project };
    project.status = 'operational';
    project.updatedAt = new Date().toISOString();
    this.knowledgeFabric.remember(id, 'activation', 'Media Galaxy project activated');
    return { activated: true, project };
  }

  pauseProject(id: string) {
    const project = this.getProject(id);
    project.status = 'paused';
    project.updatedAt = new Date().toISOString();
    this.knowledgeFabric.remember(id, 'pause', 'Media Galaxy project paused');
    return project;
  }

  createDecision(projectId: string, subject: string, evidence: Record<string, unknown> = {}) {
    this.getProject(projectId);
    const recommendation = this.council.recommend(subject, evidence);
    const decision: GalaxyDecision = {
      id: `decision-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      ...recommendation,
      approved: false,
      createdAt: new Date().toISOString(),
    };
    this.decisions.set(decision.id, decision);
    this.knowledgeFabric.remember(projectId, 'executive-decision', recommendation.recommendation, { subject, evidence });
    return decision;
  }

  approveDecision(id: string) {
    const decision = this.decisions.get(id);
    if (!decision) throw new NotFoundException(`Decision ${id} was not found`);
    decision.approved = true;
    return decision;
  }

  listDecisions(projectId?: string) {
    const values = [...this.decisions.values()];
    return projectId ? values.filter((item) => item.projectId === projectId) : values;
  }

  getMemory(projectId: string) {
    this.getProject(projectId);
    return this.knowledgeFabric.list(projectId);
  }

  private validate(input: CreateGalaxyProjectInput) {
    if (!input?.name?.trim()) throw new Error('name is required');
    if (!input?.mission?.trim()) throw new Error('mission is required');
    if (!input?.audience?.trim()) throw new Error('audience is required');
    if (!Array.isArray(input.platforms) || input.platforms.length === 0) throw new Error('platforms must contain at least one platform');
  }

  private clean(values: string[]) { return [...new Set(values.map((value) => value.trim()).filter(Boolean))]; }
}
