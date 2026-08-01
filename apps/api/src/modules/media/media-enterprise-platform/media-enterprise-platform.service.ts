import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateEnterpriseMediaProjectInput,
  EnterpriseMediaProject,
  EnterpriseProjectStatus,
} from './media-enterprise.types';
import { MediaEventBusService } from './media-event-bus.service';
import { BrandOperatingSystemService } from './brand-operating-system.service';
import { ProductionOperatingSystemService } from './production-operating-system.service';
import { PublishingGrowthService } from './publishing-growth.service';
import { IpRevenueService } from './ip-revenue.service';

@Injectable()
export class MediaEnterprisePlatformService {
  private readonly projects = new Map<string, EnterpriseMediaProject>();

  constructor(
    private readonly events: MediaEventBusService,
    private readonly brand: BrandOperatingSystemService,
    private readonly production: ProductionOperatingSystemService,
    private readonly publishingGrowth: PublishingGrowthService,
    private readonly ipRevenue: IpRevenueService,
  ) {}

  getDashboard() {
    const projects = [...this.projects.values()];
    const byStatus = projects.reduce<Record<string, number>>((acc, project) => {
      acc[project.status] = (acc[project.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      system: 'AVOS Media Enterprise Platform',
      operational: true,
      projects: projects.length,
      byStatus,
      awaitingHumanApproval: projects.filter((p) => p.status === 'awaiting-human-approval').length,
      eventCount: this.events.list().length,
      capabilities: [
        'Brand Operating System',
        'Production Operating System',
        'Publishing Network',
        'Growth Engine',
        'IP Lifecycle Engine',
        'Revenue Engine',
        'Event Bus',
        'Audit Trail',
        'Human Final Authority',
      ],
    };
  }

  listProjects() {
    return [...this.projects.values()];
  }

  getProject(id: string) {
    const project = this.projects.get(id);
    if (!project) throw new NotFoundException(`Enterprise media project ${id} was not found`);
    return project;
  }

  createProject(input: CreateEnterpriseMediaProjectInput) {
    this.validate(input);
    const now = new Date().toISOString();
    const id = `mep-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const distribution = this.publishingGrowth.build(input);
    const commercial = this.ipRevenue.build(input);
    const project: EnterpriseMediaProject = {
      id,
      status: 'awaiting-human-approval',
      createdAt: now,
      updatedAt: now,
      input: {
        ...input,
        platforms: this.clean(input.platforms),
        languages: this.clean(input.languages ?? ['Arabic', 'English']),
        markets: this.clean(input.markets ?? ['UAE', 'GCC', 'Global']),
        objectives: this.clean(input.objectives ?? ['audience growth', 'brand equity', 'IP creation', 'revenue']),
      },
      brand: this.brand.build(input),
      production: this.production.build(input),
      publishing: distribution.publishing,
      growth: distribution.growth,
      intellectualProperty: commercial.intellectualProperty,
      revenue: commercial.revenue,
      governance: { humanFinalAuthority: true, approved: false },
      metrics: {
        productionProgress: 0,
        publishingReadiness: 20,
        growthReadiness: 20,
        revenueReadiness: 15,
      },
    };
    this.projects.set(id, project);
    this.events.publish(id, 'media.enterprise.project.created', { status: project.status });
    return project;
  }

  approveProject(id: string, approvedBy = 'Human Final Authority') {
    const project = this.getProject(id);
    const now = new Date().toISOString();
    project.status = 'approved';
    project.updatedAt = now;
    project.governance = {
      humanFinalAuthority: true,
      approved: true,
      approvedBy,
      approvedAt: now,
    };
    this.events.publish(id, 'media.enterprise.project.approved', { approvedBy });
    return project;
  }

  startProduction(id: string) {
    const project = this.getProject(id);
    if (!project.governance.approved) {
      return { started: false, reason: 'Human Final Authority approval is required', project };
    }
    this.transition(project, 'in-production', 'media.enterprise.production.started');
    project.metrics.productionProgress = 10;
    return { started: true, project };
  }

  updateProgress(id: string, productionProgress: number) {
    const project = this.getProject(id);
    const progress = Math.max(0, Math.min(100, Math.round(productionProgress)));
    project.metrics.productionProgress = progress;
    project.metrics.publishingReadiness = Math.min(100, 20 + Math.round(progress * 0.8));
    project.metrics.growthReadiness = Math.min(100, 20 + Math.round(progress * 0.65));
    project.metrics.revenueReadiness = Math.min(100, 15 + Math.round(progress * 0.6));
    project.updatedAt = new Date().toISOString();
    if (progress === 100) project.status = 'ready-to-publish';
    this.events.publish(id, 'media.enterprise.production.progressed', { progress });
    return project;
  }

  publishProject(id: string) {
    const project = this.getProject(id);
    if (!project.governance.approved) {
      return { published: false, reason: 'Human Final Authority approval is required', project };
    }
    if (project.metrics.productionProgress < 100) {
      return { published: false, reason: 'Production must reach 100%', project };
    }
    this.transition(project, 'published', 'media.enterprise.project.published');
    return { published: true, project };
  }

  pauseProject(id: string) {
    const project = this.getProject(id);
    this.transition(project, 'paused', 'media.enterprise.project.paused');
    return project;
  }

  archiveProject(id: string) {
    const project = this.getProject(id);
    this.transition(project, 'archived', 'media.enterprise.project.archived');
    return project;
  }

  getAuditTrail(id: string) {
    this.getProject(id);
    return this.events.list(id);
  }

  private transition(project: EnterpriseMediaProject, status: EnterpriseProjectStatus, eventType: string) {
    project.status = status;
    project.updatedAt = new Date().toISOString();
    this.events.publish(project.id, eventType, { status });
  }

  private validate(input: CreateEnterpriseMediaProjectInput) {
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
