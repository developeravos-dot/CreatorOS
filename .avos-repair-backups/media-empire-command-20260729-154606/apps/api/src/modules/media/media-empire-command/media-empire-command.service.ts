import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BrandBlueprint,
  CreateMediaEmpireProjectInput,
  EcosystemBlueprint,
  MediaEmpireProject,
  ProductionBlueprint,
  ProductionStyle,
} from './media-empire-command.types';

@Injectable()
export class MediaEmpireCommandService {
  private readonly projects = new Map<string, MediaEmpireProject>();

  getDashboard() {
    const projects = [...this.projects.values()];
    return {
      system: 'AVOS Media Empire Command',
      operational: true,
      projects: projects.length,
      awaitingHumanApproval: projects.filter((item) => item.status === 'awaiting-human-approval').length,
      active: projects.filter((item) => item.status === 'active').length,
      capabilities: [
        'Brand Intelligence Platform',
        'Brand Identity & Creative Studio',
        'Creative Production Intelligence Engine',
        'AVOS Media Ecosystem',
        'Human Final Authority',
      ],
    };
  }

  listProjects() {
    return [...this.projects.values()];
  }

  getProject(id: string) {
    const project = this.projects.get(id);
    if (!project) throw new NotFoundException(`Media project ${id} was not found`);
    return project;
  }

  createProject(input: CreateMediaEmpireProjectInput) {
    this.validateInput(input);
    const now = new Date().toISOString();
    const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const style = this.selectStyle(input);

    const project: MediaEmpireProject = {
      id,
      status: 'awaiting-human-approval',
      createdAt: now,
      updatedAt: now,
      input: {
        ...input,
        platforms: this.clean(input.platforms),
        languages: this.clean(input.languages ?? ['Arabic', 'English']),
        cultures: this.clean(input.cultures ?? []),
        objectives: this.clean(input.objectives ?? ['audience growth', 'brand equity', 'IP creation']),
      },
      brand: this.buildBrandBlueprint(input),
      production: this.buildProductionBlueprint(input, style),
      ecosystem: this.buildEcosystemBlueprint(input),
      humanApproval: { required: true, approved: false },
    };

    this.projects.set(id, project);
    return project;
  }

  approveProject(id: string, approvedBy = 'Human Final Authority') {
    const project = this.getProject(id);
    project.status = 'approved';
    project.updatedAt = new Date().toISOString();
    project.humanApproval = {
      required: true,
      approved: true,
      approvedBy,
      approvedAt: project.updatedAt,
    };
    return project;
  }

  activateProject(id: string) {
    const project = this.getProject(id);
    if (!project.humanApproval.approved) {
      return {
        activated: false,
        reason: 'Human Final Authority approval is required',
        project,
      };
    }
    project.status = 'active';
    project.updatedAt = new Date().toISOString();
    return { activated: true, project };
  }

  pauseProject(id: string) {
    const project = this.getProject(id);
    project.status = 'paused';
    project.updatedAt = new Date().toISOString();
    return project;
  }

  private validateInput(input: CreateMediaEmpireProjectInput) {
    if (!input?.name?.trim()) throw new Error('name is required');
    if (!input?.contentType?.trim()) throw new Error('contentType is required');
    if (!input?.audience?.trim()) throw new Error('audience is required');
    if (!Array.isArray(input.platforms) || input.platforms.length === 0) {
      throw new Error('platforms must contain at least one platform');
    }
  }

  private selectStyle(input: CreateMediaEmpireProjectInput): ProductionStyle {
    if (input.preferredStyle) return input.preferredStyle;
    const value = `${input.contentType} ${input.audience} ${input.ageGroup ?? ''}`.toLowerCase();
    if (/child|kid|طفل|أطفال/.test(value)) return 'animation';
    if (/anime|أنمي/.test(value)) return 'anime';
    if (/documentary|history|cinema|وثائقي|تاريخ|سينمائي/.test(value)) return 'cinematic';
    if (/news|interview|tutorial|مقابلة|تعليمي|أخبار/.test(value)) return 'realistic';
    return 'hybrid';
  }

  private buildBrandBlueprint(input: CreateMediaEmpireProjectInput): BrandBlueprint {
    const youth = /child|kid|teen|طفل|أطفال|مراهق/.test(`${input.audience} ${input.ageGroup ?? ''}`.toLowerCase());
    return {
      name: input.name.trim(),
      promise: `Deliver distinctive ${input.contentType} experiences for ${input.audience}`,
      personality: youth ? ['bold', 'friendly', 'memorable'] : ['premium', 'intelligent', 'trustworthy'],
      voice: ['clear', 'confident', 'culturally adaptable'],
      colors: youth ? ['electric blue', 'sun yellow', 'deep violet'] : ['midnight navy', 'royal gold', 'clean white'],
      typography: ['Arabic display family', 'Latin geometric sans'],
      logoDirection: 'Scalable signature mark with channel-specific sub-brand architecture',
      thumbnailSystem: 'Recognizable grid, controlled typography, focal subject, multilingual variants',
      brandBookSections: [
        'strategy', 'name', 'logo', 'colors', 'typography', 'imagery', 'characters',
        'voice', 'thumbnails', 'social assets', 'seasonal campaigns', 'localization rules',
      ],
    };
  }

  private buildProductionBlueprint(input: CreateMediaEmpireProjectInput, style: ProductionStyle): ProductionBlueprint {
    return {
      style,
      council: [
        'Executive Producer Agent', 'Director Agent', 'Screenwriter Agent',
        'Art Director Agent', 'Cinematography Agent', 'Voice & Sound Agent',
        'Editing Agent', 'Quality Assurance Agent', 'Cultural Localization Agent',
      ],
      modelRouting: {
        research: 'best factual research model available',
        script: 'best long-context writing model available',
        image: `best ${style} image model available`,
        video: `best ${style} video generation model available`,
        voice: 'best multilingual expressive voice model available',
        music: 'best licensed-or-original music generation model available',
      },
      cinematography: ['shot grammar', 'camera movement plan', 'lens language', 'continuity map'],
      lighting: ['key mood', 'contrast policy', 'skin/character consistency', 'scene continuity'],
      audio: ['voice casting', 'sound design', 'music direction', 'mastering targets'],
      editing: ['pacing map', 'retention beats', 'platform cutdowns', 'caption and localization masters'],
      qualityGates: [
        'originality', 'brand consistency', 'visual continuity', 'audio continuity',
        'cultural safety', 'copyright safety', 'platform compliance', 'human final approval',
      ],
    };
  }

  private buildEcosystemBlueprint(input: CreateMediaEmpireProjectInput): EcosystemBlueprint {
    return {
      teams: [
        'Research Team', 'Idea Invention Team', 'Production Council', 'Publishing Team',
        'Growth Team', 'Revenue Team', 'IP Team', 'Global Expansion Team', 'Analytics & Learning Team',
      ],
      lifecycle: [
        'research', 'opportunity detection', 'concept invention', 'brand creation', 'production',
        'quality approval', 'publishing', 'distribution', 'growth', 'monetization', 'IP expansion', 'learning',
      ],
      growthLoops: [
        'cross-channel audience exchange', 'multilingual adaptation', 'season generation',
        'thumbnail/title experimentation', 'community feedback reinvestment',
      ],
      ipExpansion: [
        'characters', 'formats', 'series', 'books', 'courses', 'merchandise',
        'licensing', 'franchising', 'partnerships', 'regional adaptations',
      ],
      learningSignals: [
        ...this.clean(input.platforms).map((platform) => `${platform} performance`),
        'retention', 'engagement', 'conversion', 'brand recall', 'revenue', 'cultural response',
      ],
    };
  }

  private clean(values: string[]) {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  }
}
