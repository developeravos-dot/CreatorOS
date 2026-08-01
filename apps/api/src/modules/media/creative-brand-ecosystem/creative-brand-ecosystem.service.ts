import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';
import { CreativeProductionIntelligenceService } from './creative-production-intelligence.service';
import { MediaEcosystemService } from './media-ecosystem.service';
import { CreativeBrandProject, CreativeProjectInput } from './creative-brand-ecosystem.types';

@Injectable()
export class CreativeBrandEcosystemService {
  private readonly projects = new Map<string, CreativeBrandProject>();

  constructor(
    private readonly production: CreativeProductionIntelligenceService,
    private readonly brand: BrandIntelligencePlatformService,
    private readonly ecosystem: MediaEcosystemService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Creative Production, Brand Intelligence and Media Ecosystem',
      operational: true,
      systems: ['Creative Production Intelligence Engine', 'Media Ecosystem', 'Brand Identity Studio', 'Brand Identity & Creative Studio', 'Brand Intelligence Platform'],
      humanFinalAuthority: true,
    };
  }

  create(input: CreativeProjectInput): CreativeBrandProject {
    const now = new Date().toISOString();
    const project: CreativeBrandProject = {
      id: randomUUID(),
      status: 'awaiting-human-approval',
      createdAt: now,
      updatedAt: now,
      input,
      production: this.production.build(input),
      brand: this.brand.build(input),
      ecosystem: this.ecosystem.build(input),
      approvals: { approved: false },
      learning: [],
    };
    this.projects.set(project.id, project);
    return project;
  }

  list(): CreativeBrandProject[] { return [...this.projects.values()]; }

  get(id: string): CreativeBrandProject {
    const project = this.projects.get(id);
    if (!project) throw new NotFoundException(`Creative brand project not found: ${id}`);
    return project;
  }

  approve(id: string, approvedBy = 'Human Final Authority') {
    const project = this.get(id);
    const approvedAt = new Date().toISOString();
    project.status = 'approved';
    project.updatedAt = approvedAt;
    project.approvals = { approved: true, approvedBy, approvedAt };
    return project;
  }

  activate(id: string) {
    const project = this.get(id);
    if (!project.approvals.approved) return { activated: false, reason: 'human-approval-required', project };
    project.status = 'operational';
    project.updatedAt = new Date().toISOString();
    return { activated: true, project };
  }

  learn(id: string, signal: string, value: number) {
    const project = this.get(id);
    const result = this.production.learn(project.production, signal, value);
    project.learning.push({ at: new Date().toISOString(), ...result });
    project.brand = this.brand.evolve(project.brand, value);
    project.updatedAt = new Date().toISOString();
    return project;
  }

  dashboard() {
    const projects = this.list();
    return {
      total: projects.length,
      awaitingApproval: projects.filter((project) => project.status === 'awaiting-human-approval').length,
      operational: projects.filter((project) => project.status === 'operational').length,
      systems: this.capabilities().systems,
      humanFinalAuthority: true,
    };
  }
}