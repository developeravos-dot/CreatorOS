import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EcosystemProjectInput, MediaEcosystem } from './media-creative.types';

@Injectable()
export class MediaEcosystemService {
  private readonly ecosystems = new Map<string, MediaEcosystem>();

  capabilities() {
    return {
      name: 'AVOS Media Ecosystem',
      version: 'AME-1.0.0',
      capabilities: [
        'research',
        'idea-invention',
        'production',
        'direction',
        'publishing',
        'marketing',
        'global-expansion',
        'analytics',
        'investment',
        'brand-building',
        'channel-networking',
        'audience-exchange',
        'data-exchange',
        'opportunity-exchange',
        'trend-detection',
        'season-generation',
        'channel-generation',
        'language-expansion',
        'campaign-generation',
        'product-generation',
        'partnership-generation',
        'licensing',
        'IP-portfolio-growth',
        'autonomous-operation',
        'human-final-authority',
      ],
    };
  }

  create(input: EcosystemProjectInput): MediaEcosystem {
    const now = new Date().toISOString();
    const budget = Math.max(0, input.budget ?? 1000000);

    const ecosystem: MediaEcosystem = {
      id: randomUUID(),
      createdAt: now,
      status: 'awaiting-human-approval',
      input,
      organization: {
        teams: [
          { name: 'Research Team', agents: ['Trend Agent', 'Audience Agent', 'Market Agent'], mission: 'discover validated opportunities' },
          { name: 'Innovation Team', agents: ['Idea Agent', 'Format Agent', 'IP Agent'], mission: 'invent original scalable concepts' },
          { name: 'Production Team', agents: ['Producer Agent', 'Director Agent', 'Editor Agent'], mission: 'produce premium original media' },
          { name: 'Publishing Team', agents: ['Platform Agent', 'Scheduling Agent', 'Localization Agent'], mission: 'publish globally' },
          { name: 'Growth Team', agents: ['Marketing Agent', 'Partnership Agent', 'Campaign Agent'], mission: 'grow audiences and brands' },
          { name: 'Investment Team', agents: ['Portfolio Agent', 'Finance Agent', 'Risk Agent'], mission: 'allocate capital intelligently' },
          { name: 'Brand Team', agents: ['Brand Strategist Agent', 'Identity Agent', 'Asset Agent'], mission: 'build recognizable global brands' },
          { name: 'Analytics Team', agents: ['Performance Agent', 'Attribution Agent', 'Learning Agent'], mission: 'measure, learn and optimize' },
        ],
        council: [
          'AI Media Executive Council',
          'Creative Council',
          'Investment Council',
          'Brand Council',
          'Risk Council',
          'Human Final Authority Council',
        ],
      },
      lifecycle: {
        stages: [
          'research',
          'opportunity-validation',
          'idea-invention',
          'IP-design',
          'brand-design',
          'production',
          'quality-approval',
          'publishing',
          'marketing',
          'analytics',
          'learning',
          'expansion',
          'licensing',
          'portfolio-evolution',
        ],
        currentStage: 'research',
        nextActions: ['collect-signals', 'rank-opportunities', 'prepare-human-decision'],
      },
      network: {
        channels: input.channels ?? [],
        projects: input.projects ?? [],
        audienceFlows: ['cross-channel-discovery', 'series-to-brand', 'brand-to-product'],
        dataFlows: ['performance-to-strategy', 'audience-to-production', 'market-to-expansion'],
        opportunityFlows: ['trend-to-format', 'format-to-channel', 'channel-to-IP', 'IP-to-license'],
      },
      intelligence: {
        trendSignals: [
          'emerging-format',
          'audience-behavior-change',
          'platform-opportunity',
          'language-opportunity',
          'licensing-demand',
        ],
        expansionRecommendations: [
          'new-season',
          'new-language',
          'new-channel',
          'new-market',
          'new-product',
          'new-partner',
          'new-license',
        ],
        riskSignals: [
          'platform-dependency',
          'audience-fatigue',
          'brand-dilution',
          'rights-risk',
          'production-capacity-risk',
        ],
      },
      growth: {
        newChannels: input.projects?.map((project) => `${project} Channel`) ?? [],
        newLanguages: input.languages ?? [],
        newMarkets: input.markets ?? [],
        campaigns: ['launch-campaign', 'cross-channel-campaign', 'IP-growth-campaign'],
        products: ['digital-product', 'education-product', 'licensed-merchandise-concept'],
        partnerships: ['distribution-partner', 'creator-partner', 'technology-partner'],
        licenses: ['format-license', 'language-license', 'territory-license', 'platform-license'],
      },
      ipPortfolio: [
        {
          title: `${input.name} Core IP`,
          stage: 'concept',
          valueScore: 0.78,
          expansionPaths: ['series', 'book', 'course', 'game', 'license', 'brand'],
        },
      ],
      investment: {
        allocation: {
          research: Math.round(budget * 0.1),
          production: Math.round(budget * 0.35),
          brand: Math.round(budget * 0.15),
          growth: Math.round(budget * 0.2),
          technology: Math.round(budget * 0.1),
          reserve: Math.round(budget * 0.1),
        },
        priorityQueue: [
          'validate-core-IP',
          'build-brand-system',
          'launch-pilot-channel',
          'measure-retention',
          'scale-winning-format',
        ],
      },
      analytics: {
        metrics: {
          channels: input.channels?.length ?? 0,
          projects: input.projects?.length ?? 0,
          audienceGrowth: 0,
          revenue: 0,
          IPValue: 0,
          brandStrength: 0,
          productionQuality: 0,
          globalizationProgress: 0,
          riskExposure: input.risk ?? 0.3,
        },
        alerts: [],
      },
      governance: {
        humanApproved: false,
        auditTrail: [`${now}:ecosystem-created`],
      },
    };

    this.ecosystems.set(ecosystem.id, ecosystem);
    return ecosystem;
  }

  list() {
    return [...this.ecosystems.values()];
  }

  get(id: string) {
    const ecosystem = this.ecosystems.get(id);
    if (!ecosystem) throw new NotFoundException(`Media ecosystem not found: ${id}`);
    return ecosystem;
  }

  approve(id: string, approvedBy: string) {
    const ecosystem = this.get(id);
    ecosystem.status = 'approved';
    ecosystem.governance.humanApproved = true;
    ecosystem.governance.approvedBy = approvedBy;
    ecosystem.governance.auditTrail.push(`${new Date().toISOString()}:approved:${approvedBy}`);
    return ecosystem;
  }

  activate(id: string, actor: string) {
    const ecosystem = this.get(id);
    if (!ecosystem.governance.humanApproved) {
      throw new Error('Human approval is required before autonomous operation.');
    }
    ecosystem.status = 'active';
    ecosystem.lifecycle.currentStage = 'opportunity-validation';
    ecosystem.lifecycle.nextActions = [
      'activate-specialist-teams',
      'launch-core-IP-pilot',
      'connect-channel-data',
    ];
    ecosystem.governance.auditTrail.push(`${new Date().toISOString()}:activated:${actor}`);
    return ecosystem;
  }

  updateMetric(id: string, metric: string, value: number, actor: string) {
    const ecosystem = this.get(id);
    ecosystem.analytics.metrics[metric] = value;
    ecosystem.governance.auditTrail.push(
      `${new Date().toISOString()}:metric:${metric}:${value}:${actor}`,
    );

    if (metric === 'riskExposure' && value > 0.75) {
      ecosystem.status = 'paused';
      ecosystem.analytics.alerts.push('risk-exposure-critical');
    }

    return ecosystem;
  }

  addIp(id: string, title: string, actor: string) {
    const ecosystem = this.get(id);
    ecosystem.ipPortfolio.push({
      title,
      stage: 'concept',
      valueScore: 0.5,
      expansionPaths: ['series', 'product', 'license', 'brand'],
    });
    ecosystem.governance.auditTrail.push(`${new Date().toISOString()}:ip-added:${title}:${actor}`);
    return ecosystem;
  }

  dashboard() {
    const ecosystems = this.list();
    return {
      capabilities: this.capabilities(),
      totals: {
        ecosystems: ecosystems.length,
        active: ecosystems.filter((item) => item.status === 'active').length,
        approved: ecosystems.filter((item) => item.governance.humanApproved).length,
        channels: ecosystems.reduce((sum, item) => sum + item.network.channels.length, 0),
        projects: ecosystems.reduce((sum, item) => sum + item.network.projects.length, 0),
        ipAssets: ecosystems.reduce((sum, item) => sum + item.ipPortfolio.length, 0),
        alerts: ecosystems.reduce((sum, item) => sum + item.analytics.alerts.length, 0),
      },
      portfolio: ecosystems.map((item) => ({
        id: item.id,
        name: item.input.name,
        status: item.status,
        channels: item.network.channels.length,
        projects: item.network.projects.length,
        ipAssets: item.ipPortfolio.length,
        riskExposure: item.analytics.metrics.riskExposure,
      })),
    };
  }
}