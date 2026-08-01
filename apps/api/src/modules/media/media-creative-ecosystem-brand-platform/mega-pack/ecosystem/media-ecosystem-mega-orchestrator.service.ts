import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  EcosystemBrief,
  MediaEcosystemProgram,
} from '../media-mega.types';
import { EcosystemIntelligenceEngineService } from './ecosystem-intelligence-engine.service';
import { EcosystemInvestmentEngineService } from './ecosystem-investment-engine.service';
import { EcosystemOrganizationEngineService } from './ecosystem-organization-engine.service';
import { EcosystemPortfolioEngineService } from './ecosystem-portfolio-engine.service';

@Injectable()
export class MediaEcosystemMegaOrchestratorService {
  private readonly ecosystems = new Map<string, MediaEcosystemProgram>();

  constructor(
    private readonly organizationEngine: EcosystemOrganizationEngineService,
    private readonly intelligenceEngine: EcosystemIntelligenceEngineService,
    private readonly portfolioEngine: EcosystemPortfolioEngineService,
    private readonly investmentEngine: EcosystemInvestmentEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Ecosystem Mega',
      version: 'AME-MEGA-2.0.0',
      phases: 36,
      capabilities: [
        'research',
        'trend-intelligence',
        'idea-invention',
        'format-invention',
        'production-orchestration',
        'publishing',
        'distribution',
        'marketing',
        'community-growth',
        'analytics',
        'learning',
        'investment',
        'brand-building',
        'monetization',
        'product-creation',
        'partnerships',
        'licensing',
        'IP-portfolio',
        'channel-network',
        'audience-exchange',
        'data-exchange',
        'opportunity-exchange',
        'global-expansion',
        'autonomous-operation',
        'human-final-authority',
      ],
    };
  }

  create(brief: EcosystemBrief) {
    const now = new Date().toISOString();
    const intelligence = this.intelligenceEngine.analyze(brief);
    const channels = brief.channels ?? [];
    const projects = brief.projects ?? [];

    const program: MediaEcosystemProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      constitution: {
        principles: [
          'originality-first',
          'quality-first',
          'IP-lifecycle-first',
          'global-local-design',
          'data-informed-decisions',
          'human-final-authority',
        ],
        strategicRules: [
          'no-scale-before-validation',
          'no-brand-dilution',
          'no-unverified-rights',
          'diversify-platforms',
          'diversify-revenue',
          'retain-learning-across-projects',
        ],
        prohibitedActions: [
          'unauthorized-IP-sale',
          'unapproved-high-risk-investment',
          'unlicensed-content-reuse',
          'human-authority-bypass',
        ],
      },
      organization: this.organizationEngine.build(),
      lifecycle: {
        stages: [
          'research',
          'opportunity-validation',
          'idea-invention',
          'format-design',
          'IP-design',
          'brand-design',
          'production-planning',
          'production',
          'quality-approval',
          'localization',
          'publishing',
          'distribution',
          'marketing',
          'community-growth',
          'analytics',
          'learning',
          'new-season',
          'new-channel',
          'new-language',
          'new-market',
          'product-expansion',
          'partnership-expansion',
          'licensing',
          'portfolio-evolution',
        ],
        currentStage: 'research',
        progress: 0,
        nextActions: [
          'collect-market-signals',
          'rank-opportunities',
          'prepare-human-strategic-decision',
        ],
      },
      network: {
        channels: channels.map((name) => ({
          name,
          status: 'planned',
          audienceRole: 'audience-entry-and-retention',
          strategicRole: 'portfolio-distribution-node',
        })),
        projects: projects.map((name) => ({
          name,
          status: 'planned',
          ipPotential: 0.7,
        })),
        audienceFlows: [
          'channel-to-channel-discovery',
          'series-to-brand',
          'brand-to-community',
          'community-to-product',
        ],
        dataFlows: [
          'performance-to-strategy',
          'audience-to-production',
          'market-to-expansion',
          'campaign-to-attribution',
          'portfolio-to-investment',
        ],
        opportunityFlows: [
          'trend-to-format',
          'format-to-channel',
          'channel-to-IP',
          'IP-to-product',
          'IP-to-license',
        ],
      },
      intelligence,
      publishing: {
        platforms: ['YouTube', 'TikTok', 'Instagram', 'Web', 'OTT-ready'],
        schedules: {
          research: 'continuous',
          pilot: 'controlled-release',
          scale: 'performance-driven',
        },
        localizationQueue: brief.languages ?? ['Arabic', 'English'],
        distributionRules: [
          'platform-native-format',
          'brand-consistent-assets',
          'localized-metadata',
          'rights-verified',
          'human-approved-release',
        ],
      },
      marketing: {
        campaigns: [
          'launch-campaign',
          'cross-channel-campaign',
          'season-campaign',
          'IP-growth-campaign',
        ],
        audienceSegments: [
          'new-audience',
          'returning-audience',
          'high-value-community',
          'language-market-segment',
        ],
        crossPromotionRules: [
          'relevance-first',
          'no-audience-spam',
          'shared-brand-logic',
          'measured-attribution',
        ],
        growthExperiments: [
          'hook-test',
          'thumbnail-test',
          'language-test',
          'publishing-time-test',
          'cross-channel-test',
        ],
      },
      monetization: {
        revenueStreams: [
          'platform-revenue',
          'sponsorship',
          'affiliate-commerce',
          'premium-content',
          'digital-products',
          'content-licensing',
          'production-services',
          'creator-partnerships',
        ],
        products: [
          'digital-book',
          'course',
          'membership',
          'licensed-merchandise-concept',
          'interactive-experience',
        ],
        partnerships: [
          'distribution-partner',
          'creator-partner',
          'brand-partner',
          'technology-partner',
          'education-partner',
        ],
        licenses: [
          'format-license',
          'language-license',
          'territory-license',
          'platform-license',
          'character-license',
        ],
        projections: {
          yearOne: 0,
          yearTwo: 0,
          yearThree: 0,
        },
      },
      portfolio: this.portfolioEngine.build(brief),
      investment: this.investmentEngine.allocate(brief.budget ?? 1000000),
      analytics: {
        metrics: {
          channels: channels.length,
          projects: projects.length,
          audienceGrowth: 0,
          retention: 0,
          revenue: 0,
          IPValue: 0,
          brandStrength: 0,
          productionQuality: 0,
          globalizationProgress: 0,
          riskExposure: brief.riskTolerance ?? 0.3,
        },
        alerts: [],
        learnings: [],
      },
      governance: {
        humanApproved: false,
        auditTrail: [
          {
            at: now,
            actor: 'AVOS Media Ecosystem',
            action: 'ecosystem-created',
          },
        ],
      },
    };

    this.ecosystems.set(program.id, program);
    return program;
  }

  list() {
    return [...this.ecosystems.values()];
  }

  get(id: string) {
    const program = this.ecosystems.get(id);
    if (!program) throw new NotFoundException(`Media ecosystem not found: ${id}`);
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
      action: 'ecosystem-human-approved',
    });
    return program;
  }

  activate(id: string, actor: string) {
    const program = this.get(id);
    if (!program.governance.humanApproved) {
      throw new Error('Human approval is required before autonomous operation.');
    }

    const now = new Date().toISOString();
    program.status = 'active';
    program.updatedAt = now;
    program.lifecycle.currentStage = 'opportunity-validation';
    program.lifecycle.progress = 5;
    program.lifecycle.nextActions = [
      'activate-specialist-teams',
      'validate-core-IP',
      'launch-controlled-pilot',
    ];
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'ecosystem-activated',
    });
    return program;
  }

  updateMetric(id: string, metric: string, value: number, actor: string) {
    const program = this.get(id);
    const now = new Date().toISOString();
    program.analytics.metrics[metric] = value;
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'metric-updated',
      details: { metric, value },
    });

    if (metric === 'riskExposure' && value > 0.75) {
      program.status = 'paused';
      program.analytics.alerts.push('critical-risk-exposure');
    }

    return program;
  }

  addPortfolioAsset(id: string, title: string, actor: string) {
    const program = this.get(id);
    const now = new Date().toISOString();
    program.portfolio.push({
      id: randomUUID(),
      title,
      stage: 'concept',
      valueScore: 0.5,
      riskScore: 0.35,
      expansionPaths: ['series', 'product', 'license', 'brand'],
    });
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'portfolio-asset-added',
      details: { title },
    });
    return program;
  }

  retainLearning(id: string, learning: string, actor: string) {
    const program = this.get(id);
    const now = new Date().toISOString();
    program.analytics.learnings.push(learning);
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'ecosystem-learning-retained',
      details: { learning },
    });
    return program;
  }

  dashboard() {
    const items = this.list();
    return {
      capabilities: this.capabilities(),
      totals: {
        ecosystems: items.length,
        active: items.filter((item) => item.status === 'active').length,
        approved: items.filter((item) => item.governance.humanApproved).length,
        channels: items.reduce((sum, item) => sum + item.network.channels.length, 0),
        projects: items.reduce((sum, item) => sum + item.network.projects.length, 0),
        portfolioAssets: items.reduce((sum, item) => sum + item.portfolio.length, 0),
        alerts: items.reduce((sum, item) => sum + item.analytics.alerts.length, 0),
      },
      ecosystems: items.map((item) => ({
        id: item.id,
        name: item.brief.name,
        status: item.status,
        stage: item.lifecycle.currentStage,
        progress: item.lifecycle.progress,
        channels: item.network.channels.length,
        projects: item.network.projects.length,
        portfolioAssets: item.portfolio.length,
        riskExposure: item.analytics.metrics.riskExposure,
      })),
    };
  }
}