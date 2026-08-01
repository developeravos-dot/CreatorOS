import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BrandEvolutionIntelligenceService } from './brand/brand-evolution-intelligence.service';
import { FranchiseIntelligenceService } from './franchise/franchise-intelligence.service';
import { GrowthIntelligenceService } from './growth/growth-intelligence.service';
import {
  IpBrandGrowthProgram,
  IpGrowthBrief,
} from './ip-brand-growth.types';
import { IpIntelligenceService } from './ip/ip-intelligence.service';
import { LicensingIntelligenceService } from './licensing/licensing-intelligence.service';
import { MarketingIntelligenceService } from './marketing/marketing-intelligence.service';
import { MonetizationIntelligenceService } from './monetization/monetization-intelligence.service';
import { PartnershipIntelligenceService } from './partnership/partnership-intelligence.service';
import { IpBrandGrowthQualityService } from './quality/ip-brand-growth-quality.service';

@Injectable()
export class IpBrandGrowthOrchestratorService {
  private readonly programs = new Map<string, IpBrandGrowthProgram>();

  constructor(
    private readonly ip: IpIntelligenceService,
    private readonly franchise: FranchiseIntelligenceService,
    private readonly brand: BrandEvolutionIntelligenceService,
    private readonly marketing: MarketingIntelligenceService,
    private readonly growth: GrowthIntelligenceService,
    private readonly monetization: MonetizationIntelligenceService,
    private readonly partnerships: PartnershipIntelligenceService,
    private readonly licensing: LicensingIntelligenceService,
    private readonly quality: IpBrandGrowthQualityService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS IP & Brand Growth Mega Pack',
      version: 'IPBG-MEGA-1.0.0',
      systems: [
        'IP Intelligence Engine',
        'Franchise Intelligence Engine',
        'Brand Evolution Engine',
        'Marketing Intelligence Engine',
        'Growth Intelligence Engine',
        'Monetization Intelligence Engine',
        'Partnership Intelligence Engine',
        'Licensing Intelligence Engine',
      ],
      governance: [
        'human-final-authority',
        'ip-ownership-protection',
        'quality-gates',
        'commercial-approval-gates',
        'audit-trail',
      ],
    };
  }

  create(brief: IpGrowthBrief) {
    const now = new Date().toISOString();

    const program: IpBrandGrowthProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      ipAssets: this.ip.build(brief),
      franchise: this.franchise.build(brief),
      brandEvolution: this.brand.build(brief),
      marketing: this.marketing.build(brief),
      growth: this.growth.build(brief),
      monetization: this.monetization.build(brief),
      partnerships: this.partnerships.build(brief),
      licensing: this.licensing.build(brief),
      quality: {
        scores: {},
        failures: [],
        approved: false,
      },
      governance: {
        humanApproved: false,
        auditTrail: [
          {
            at: now,
            actor: 'IP Brand Growth Orchestrator',
            action: 'ip-brand-growth-program-created',
          },
        ],
      },
    };

    program.quality = this.quality.evaluate(program);
    this.programs.set(program.id, program);
    return program;
  }

  list() {
    return [...this.programs.values()];
  }

  get(id: string) {
    const program = this.programs.get(id);

    if (!program) {
      throw new NotFoundException(`IP Brand Growth program not found: ${id}`);
    }

    return program;
  }

  approve(id: string, approvedBy: string) {
    const program = this.get(id);
    const now = new Date().toISOString();

    program.status = 'approved';
    program.updatedAt = now;
    program.governance.humanApproved = true;
    program.governance.approvedBy = approvedBy;
    program.governance.approvedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor: approvedBy,
      action: 'human-approved',
    });

    program.quality = this.quality.evaluate(program);
    return program;
  }

  activate(id: string, actor: string) {
    const program = this.get(id);

    if (!program.governance.humanApproved || !program.quality.approved) {
      throw new Error('Human approval and all quality gates are required.');
    }

    const now = new Date().toISOString();
    program.status = 'active';
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'ip-brand-growth-activated',
    });

    return program;
  }

  complete(id: string, actor: string) {
    const program = this.get(id);

    if (program.status !== 'active') {
      throw new Error('Program must be active before completion.');
    }

    const now = new Date().toISOString();
    program.status = 'completed';
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'ip-brand-growth-completed',
    });

    return program;
  }

  dashboard() {
    const items = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        programs: items.length,
        approved: items.filter((item) => item.governance.humanApproved).length,
        active: items.filter((item) => item.status === 'active').length,
        completed: items.filter((item) => item.status === 'completed').length,
        ipAssets: items.reduce((sum, item) => sum + item.ipAssets.length, 0),
        franchisePaths: items.reduce(
          (sum, item) => sum + item.franchise.expansionPaths.length,
          0,
        ),
        revenueStreams: items.reduce(
          (sum, item) => sum + item.monetization.revenueStreams.length,
          0,
        ),
        licensingPackages: items.reduce(
          (sum, item) => sum + item.licensing.packages.length,
          0,
        ),
      },
      programs: items.map((item) => ({
        id: item.id,
        title: item.brief.title,
        brandName: item.brief.brandName,
        status: item.status,
        ipAssets: item.ipAssets.length,
        franchisePaths: item.franchise.expansionPaths.length,
        revenueStreams: item.monetization.revenueStreams.length,
        licensingPackages: item.licensing.packages.length,
        qualityApproved: item.quality.approved,
      })),
    };
  }
}