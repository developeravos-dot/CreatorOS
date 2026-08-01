import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type MediaBusinessStatus =
  | 'draft'
  | 'planned'
  | 'running'
  | 'human-review'
  | 'approved'
  | 'blocked'
  | 'completed'
  | 'rejected'
  | 'archived';

export type MediaBusinessStage =
  | 'business-model-intelligence'
  | 'audience-economic-intelligence'
  | 'market-demand-intelligence'
  | 'offer-architecture'
  | 'pricing-intelligence'
  | 'revenue-stream-design'
  | 'advertising-revenue-intelligence'
  | 'sponsorship-intelligence'
  | 'affiliate-commerce-intelligence'
  | 'digital-product-intelligence'
  | 'subscription-membership-intelligence'
  | 'premium-content-intelligence'
  | 'licensing-revenue-intelligence'
  | 'franchise-revenue-intelligence'
  | 'merchandise-commerce-intelligence'
  | 'creator-service-business'
  | 'business-client-solutions'
  | 'marketplace-intelligence'
  | 'sales-funnel-intelligence'
  | 'conversion-optimization'
  | 'customer-lifetime-value'
  | 'revenue-attribution'
  | 'royalty-accounting'
  | 'payment-collection-intelligence'
  | 'financial-planning'
  | 'budget-allocation'
  | 'cash-flow-intelligence'
  | 'profitability-intelligence'
  | 'unit-economics-intelligence'
  | 'investment-opportunity-intelligence'
  | 'content-investment-engine'
  | 'portfolio-capital-allocation'
  | 'risk-return-intelligence'
  | 'profit-reinvestment'
  | 'autonomous-growth'
  | 'human-final-authority';

export interface RevenueStream {
  id: string;
  name: string;
  type:
    | 'advertising'
    | 'sponsorship'
    | 'affiliate'
    | 'digital-product'
    | 'subscription'
    | 'premium-content'
    | 'license'
    | 'franchise'
    | 'merchandise'
    | 'service'
    | 'marketplace'
    | 'other';
  platform: string;
  market: string;
  currency: string;
  expectedMonthlyRevenue: number;
  actualMonthlyRevenue: number;
  directCost: number;
  grossProfit: number;
  marginPercentage: number;
  active: boolean;
  humanApproved: boolean;
}

export interface BusinessOffer {
  id: string;
  name: string;
  description: string;
  audience: string[];
  markets: string[];
  channels: string[];
  price: number;
  currency: string;
  productionCost: number;
  fulfillmentCost: number;
  expectedConversionRate: number;
  actualConversionRate: number;
  status: 'draft' | 'validation' | 'approved' | 'active' | 'paused' | 'retired';
  humanApproved: boolean;
}

export interface SponsorshipDeal {
  id: string;
  sponsorName: string;
  campaignName: string;
  channel: string;
  market: string;
  value: number;
  currency: string;
  deliverables: string[];
  startDate: string;
  endDate: string;
  status: 'lead' | 'proposal' | 'negotiation' | 'human-review' | 'active' | 'completed' | 'lost';
  humanApproved: boolean;
}

export interface InvestmentPosition {
  id: string;
  name: string;
  category: 'channel' | 'content' | 'brand' | 'ip' | 'product' | 'campaign' | 'market' | 'technology';
  investedAmount: number;
  currentValue: number;
  expectedReturn: number;
  actualReturn: number;
  riskScore: number;
  strategicScore: number;
  status: 'candidate' | 'analysis' | 'human-review' | 'approved' | 'active' | 'exited' | 'rejected';
  humanApproved: boolean;
}

export interface BusinessDecision {
  id: string;
  stage: MediaBusinessStage;
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

export interface BusinessStageExecution {
  id: string;
  stage: MediaBusinessStage;
  sequence: number;
  status: MediaBusinessStatus;
  dependencies: MediaBusinessStage[];
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  assignedAgentIds: string[];
  qualityScore: number;
  confidenceScore: number;
  revenueImpactScore: number;
  profitabilityScore: number;
  riskScore: number;
  expectedRevenue: number;
  actualRevenue: number;
  cost: number;
  profit: number;
  risks: string[];
  blockers: string[];
  recommendations: string[];
  humanApprovalRequired: boolean;
  humanApproved: boolean;
  startedAt: string;
  completedAt: string;
}

export interface MediaBusinessPortfolio {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: MediaBusinessStatus;
  currentStage: MediaBusinessStage;
  stages: BusinessStageExecution[];
  revenueStreams: RevenueStream[];
  offers: BusinessOffer[];
  sponsorshipDeals: SponsorshipDeal[];
  investments: InvestmentPosition[];
  decisions: BusinessDecision[];
  targetMarkets: string[];
  targetPlatforms: string[];
  targetAudiences: string[];
  targetCurrencies: string[];
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  grossMarginPercentage: number;
  reinvestmentAmount: number;
  reserveAmount: number;
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

export interface CreateMediaBusinessPortfolioInput {
  name: string;
  description?: string;
  owner: string;
  targetMarkets?: string[];
  targetPlatforms?: string[];
  targetAudiences?: string[];
  targetCurrencies?: string[];
  autonomousExecutionEnabled?: boolean;
  humanApprovalRequired?: boolean;
}

export abstract class MediaBusinessRevenueEngineBase {
  private readonly portfolios = new Map<string, MediaBusinessPortfolio>();

  private readonly orderedStages: MediaBusinessStage[] = [
    'business-model-intelligence',
    'audience-economic-intelligence',
    'market-demand-intelligence',
    'offer-architecture',
    'pricing-intelligence',
    'revenue-stream-design',
    'advertising-revenue-intelligence',
    'sponsorship-intelligence',
    'affiliate-commerce-intelligence',
    'digital-product-intelligence',
    'subscription-membership-intelligence',
    'premium-content-intelligence',
    'licensing-revenue-intelligence',
    'franchise-revenue-intelligence',
    'merchandise-commerce-intelligence',
    'creator-service-business',
    'business-client-solutions',
    'marketplace-intelligence',
    'sales-funnel-intelligence',
    'conversion-optimization',
    'customer-lifetime-value',
    'revenue-attribution',
    'royalty-accounting',
    'payment-collection-intelligence',
    'financial-planning',
    'budget-allocation',
    'cash-flow-intelligence',
    'profitability-intelligence',
    'unit-economics-intelligence',
    'investment-opportunity-intelligence',
    'content-investment-engine',
    'portfolio-capital-allocation',
    'risk-return-intelligence',
    'profit-reinvestment',
    'autonomous-growth',
    'human-final-authority',
  ];

  protected constructor(
    private readonly engineName: string,
    private readonly managedStage: MediaBusinessStage,
  ) {}

  getDashboard() {
    const portfolios = [...this.portfolios.values()];
    return {
      engine: this.engineName,
      version: '1.0.0',
      architecture: 'AVOS Media Autonomous Business Revenue Investment Ecosystem',
      managedStage: this.managedStage,
      totalStages: this.orderedStages.length,
      totalPortfolios: portfolios.length,
      runningPortfolios: portfolios.filter((item) => item.status === 'running').length,
      completedPortfolios: portfolios.filter((item) => item.status === 'completed').length,
      pendingHumanApproval: portfolios.filter((item) => item.humanApprovalRequired && !item.humanApproved).length,
      totalRevenue: this.money(portfolios.reduce((sum, item) => sum + item.totalRevenue, 0)),
      totalCost: this.money(portfolios.reduce((sum, item) => sum + item.totalCost, 0)),
      totalProfit: this.money(portfolios.reduce((sum, item) => sum + item.totalProfit, 0)),
      activeRevenueStreams: portfolios.reduce((sum, item) => sum + item.revenueStreams.filter((stream) => stream.active).length, 0),
      activeOffers: portfolios.reduce((sum, item) => sum + item.offers.filter((offer) => offer.status === 'active').length, 0),
      activeSponsorshipDeals: portfolios.reduce((sum, item) => sum + item.sponsorshipDeals.filter((deal) => deal.status === 'active').length, 0),
      activeInvestments: portfolios.reduce((sum, item) => sum + item.investments.filter((investment) => investment.status === 'active').length, 0),
      humanFinalAuthority: true,
      status: 'operational' as const,
      updatedAt: new Date().toISOString(),
    };
  }

  getBlueprint() {
    return {
      name: 'AVOS Media Autonomous Business Revenue Investment Blueprint',
      version: '1.0.0',
      stages: this.orderedStages.map((stage, index) => ({
        sequence: index + 1,
        stage,
        previousStage: index === 0 ? null : this.orderedStages[index - 1],
        nextStage: index === this.orderedStages.length - 1 ? null : this.orderedStages[index + 1],
        humanApprovalGate: this.requiresHumanApproval(stage),
      })),
      systems: [
        'revenue-stream-engine',
        'offer-engine',
        'pricing-engine',
        'sponsorship-engine',
        'affiliate-engine',
        'commerce-engine',
        'subscription-engine',
        'licensing-engine',
        'royalty-engine',
        'financial-planning-engine',
        'investment-engine',
        'capital-allocation-engine',
        'profit-reinvestment-engine',
        'autonomous-growth-engine',
      ],
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  createPortfolio(input: CreateMediaBusinessPortfolioInput) {
    if (!input.name?.trim()) throw new BadRequestException('Portfolio name is required');
    if (!input.owner?.trim()) throw new BadRequestException('Portfolio owner is required');

    const now = new Date().toISOString();
    const stages: BusinessStageExecution[] = this.orderedStages.map((stage, index) => ({
      id: randomUUID(),
      stage,
      sequence: index + 1,
      status: index === 0 ? 'planned' : 'draft',
      dependencies: index === 0 ? [] : [this.orderedStages[index - 1]!],
      inputs: {},
      outputs: {},
      assignedAgentIds: [],
      qualityScore: 0,
      confidenceScore: 0,
      revenueImpactScore: 0,
      profitabilityScore: 0,
      riskScore: 0,
      expectedRevenue: 0,
      actualRevenue: 0,
      cost: 0,
      profit: 0,
      risks: [],
      blockers: [],
      recommendations: [],
      humanApprovalRequired: this.requiresHumanApproval(stage),
      humanApproved: false,
      startedAt: '',
      completedAt: '',
    }));

    const portfolio: MediaBusinessPortfolio = {
      id: randomUUID(),
      name: input.name.trim(),
      description: input.description?.trim() ?? '',
      owner: input.owner.trim(),
      status: 'draft',
      currentStage: 'business-model-intelligence',
      stages,
      revenueStreams: [],
      offers: [],
      sponsorshipDeals: [],
      investments: [],
      decisions: [],
      targetMarkets: this.normalizeList(input.targetMarkets),
      targetPlatforms: this.normalizeList(input.targetPlatforms),
      targetAudiences: this.normalizeList(input.targetAudiences, false),
      targetCurrencies: this.normalizeList(input.targetCurrencies),
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      grossMarginPercentage: 0,
      reinvestmentAmount: 0,
      reserveAmount: 0,
      risks: [],
      opportunities: [],
      recommendations: [],
      lessons: [],
      autonomousExecutionEnabled: input.autonomousExecutionEnabled ?? false,
      humanApprovalRequired: input.humanApprovalRequired ?? true,
      humanApproved: false,
      createdAt: now,
      updatedAt: now,
    };

    this.portfolios.set(portfolio.id, portfolio);
    return portfolio;
  }

  listPortfolios() {
    return [...this.portfolios.values()].sort((a, b) => b.totalProfit - a.totalProfit);
  }

  getPortfolio(id: string) {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) throw new NotFoundException(`Media business portfolio '${id}' was not found`);
    return portfolio;
  }

  updatePortfolio(id: string, input: Partial<MediaBusinessPortfolio>) {
    const current = this.getPortfolio(id);
    const totalRevenue = input.totalRevenue ?? current.totalRevenue;
    const totalCost = input.totalCost ?? current.totalCost;
    const totalProfit = this.money(totalRevenue - totalCost);
    const grossMarginPercentage = totalRevenue > 0 ? this.score((totalProfit / totalRevenue) * 100) : 0;

    const updated: MediaBusinessPortfolio = {
      ...current,
      ...input,
      id: current.id,
      totalRevenue: this.nonNegative(totalRevenue, 'totalRevenue'),
      totalCost: this.nonNegative(totalCost, 'totalCost'),
      totalProfit,
      grossMarginPercentage,
      updatedAt: new Date().toISOString(),
    };

    this.portfolios.set(id, updated);
    return updated;
  }

  approveAutonomousExecution(id: string, approvedBy: string) {
    const portfolio = this.getPortfolio(id);
    const decision: BusinessDecision = {
      id: randomUUID(),
      stage: portfolio.currentStage,
      title: 'Approve autonomous media business execution',
      recommendation: 'Enable controlled business and revenue orchestration',
      rationale: 'Approved by Human Final Authority',
      confidenceScore: 100,
      expectedImpactScore: 100,
      status: 'approved',
      decidedBy: approvedBy?.trim() || 'Human Final Authority',
      decidedAt: new Date().toISOString(),
      humanApproved: true,
    };
    return this.updatePortfolio(id, { humanApproved: true, decisions: [...portfolio.decisions, decision] });
  }

  startLifecycle(id: string) {
    const portfolio = this.getPortfolio(id);
    if (portfolio.autonomousExecutionEnabled && portfolio.humanApprovalRequired && !portfolio.humanApproved) {
      throw new BadRequestException('Human approval is required before autonomous business execution');
    }
    this.updateStage(id, 'business-model-intelligence', { status: 'running', startedAt: new Date().toISOString() });
    return this.updatePortfolio(id, { status: 'running', currentStage: 'business-model-intelligence' });
  }

  executeManagedStage(id: string, input?: { assignedAgentIds?: string[]; inputs?: Record<string, unknown> }) {
    const portfolio = this.getPortfolio(id);
    if (portfolio.currentStage !== this.managedStage) {
      throw new BadRequestException(`Current stage is '${portfolio.currentStage}', not '${this.managedStage}'`);
    }
    const stage = this.getStage(id, this.managedStage);
    if (stage.humanApprovalRequired && !stage.humanApproved) {
      return this.submitStageForHumanReview(id, this.managedStage);
    }
    this.updateStage(id, this.managedStage, {
      status: 'running',
      inputs: input?.inputs ?? {},
      assignedAgentIds: [...new Set(input?.assignedAgentIds ?? [])],
      startedAt: stage.startedAt || new Date().toISOString(),
    });
    return this.getPortfolio(id);
  }

  completeManagedStage(id: string, input?: Record<string, unknown>) {
    const actualRevenue = this.nonNegative(Number(input?.actualRevenue ?? 0), 'actualRevenue');
    const cost = this.nonNegative(Number(input?.cost ?? 0), 'cost');
    const portfolio = this.getPortfolio(id);
    const stage = this.getStage(id, this.managedStage);
    if (stage.humanApprovalRequired && !stage.humanApproved) {
      throw new BadRequestException(`Human approval is required before completing '${this.managedStage}'`);
    }

    this.updateStage(id, this.managedStage, {
      status: 'completed',
      outputs: (input?.outputs as Record<string, unknown>) ?? {},
      qualityScore: this.score(Number(input?.qualityScore ?? 0)),
      confidenceScore: this.score(Number(input?.confidenceScore ?? 0)),
      revenueImpactScore: this.score(Number(input?.revenueImpactScore ?? 0)),
      profitabilityScore: this.score(Number(input?.profitabilityScore ?? 0)),
      riskScore: this.score(Number(input?.riskScore ?? 0)),
      expectedRevenue: this.nonNegative(Number(input?.expectedRevenue ?? 0), 'expectedRevenue'),
      actualRevenue,
      cost,
      profit: this.money(actualRevenue - cost),
      completedAt: new Date().toISOString(),
    });

    const index = this.orderedStages.indexOf(this.managedStage);
    const nextStage = this.orderedStages[index + 1];
    const updated = this.updatePortfolio(id, {
      totalRevenue: portfolio.totalRevenue + actualRevenue,
      totalCost: portfolio.totalCost + cost,
    });

    if (!nextStage) return this.updatePortfolio(id, { status: 'completed' });
    this.updateStage(id, nextStage, { status: 'planned' });
    return this.updatePortfolio(id, { status: 'running', currentStage: nextStage, totalRevenue: updated.totalRevenue, totalCost: updated.totalCost });
  }

  submitStageForHumanReview(id: string, stage: MediaBusinessStage) {
    this.updateStage(id, stage, { status: 'human-review' });
    return this.updatePortfolio(id, { status: 'human-review', currentStage: stage });
  }

  approveStage(id: string, stage: MediaBusinessStage, approvedBy: string) {
    const portfolio = this.getPortfolio(id);
    this.updateStage(id, stage, { status: 'approved', humanApproved: true });
    const decision: BusinessDecision = {
      id: randomUUID(), stage, title: `Approve ${stage}`, recommendation: 'Proceed',
      rationale: 'Approved by Human Final Authority', confidenceScore: 100,
      expectedImpactScore: 100, status: 'approved',
      decidedBy: approvedBy?.trim() || 'Human Final Authority',
      decidedAt: new Date().toISOString(), humanApproved: true,
    };
    return this.updatePortfolio(id, { status: 'running', decisions: [...portfolio.decisions, decision] });
  }

  addRevenueStream(id: string, input: Partial<RevenueStream>) {
    const portfolio = this.getPortfolio(id);
    if (!input.name?.trim()) throw new BadRequestException('Revenue stream name is required');
    const actual = this.nonNegative(input.actualMonthlyRevenue ?? 0, 'actualMonthlyRevenue');
    const cost = this.nonNegative(input.directCost ?? 0, 'directCost');
    const profit = this.money(actual - cost);
    const stream: RevenueStream = {
      id: randomUUID(),
      name: input.name.trim(),
      type: input.type ?? 'other',
      platform: input.platform?.trim() ?? '',
      market: input.market?.trim() ?? '',
      currency: input.currency?.trim() || 'USD',
      expectedMonthlyRevenue: this.nonNegative(input.expectedMonthlyRevenue ?? 0, 'expectedMonthlyRevenue'),
      actualMonthlyRevenue: actual,
      directCost: cost,
      grossProfit: profit,
      marginPercentage: actual > 0 ? this.score((profit / actual) * 100) : 0,
      active: input.active ?? false,
      humanApproved: input.humanApproved ?? false,
    };
    return this.updatePortfolio(id, {
      revenueStreams: [...portfolio.revenueStreams, stream],
      totalRevenue: portfolio.totalRevenue + actual,
      totalCost: portfolio.totalCost + cost,
    });
  }

  addOffer(id: string, input: Partial<BusinessOffer>) {
    const portfolio = this.getPortfolio(id);
    if (!input.name?.trim()) throw new BadRequestException('Offer name is required');
    const offer: BusinessOffer = {
      id: randomUUID(),
      name: input.name.trim(),
      description: input.description?.trim() ?? '',
      audience: this.normalizeList(input.audience, false),
      markets: this.normalizeList(input.markets),
      channels: this.normalizeList(input.channels),
      price: this.nonNegative(input.price ?? 0, 'price'),
      currency: input.currency?.trim() || 'USD',
      productionCost: this.nonNegative(input.productionCost ?? 0, 'productionCost'),
      fulfillmentCost: this.nonNegative(input.fulfillmentCost ?? 0, 'fulfillmentCost'),
      expectedConversionRate: this.score(input.expectedConversionRate ?? 0),
      actualConversionRate: this.score(input.actualConversionRate ?? 0),
      status: input.status ?? 'draft',
      humanApproved: input.humanApproved ?? false,
    };
    return this.updatePortfolio(id, { offers: [...portfolio.offers, offer] });
  }

  addSponsorshipDeal(id: string, input: Partial<SponsorshipDeal>) {
    const portfolio = this.getPortfolio(id);
    if (!input.sponsorName?.trim()) throw new BadRequestException('Sponsor name is required');
    const deal: SponsorshipDeal = {
      id: randomUUID(),
      sponsorName: input.sponsorName.trim(),
      campaignName: input.campaignName?.trim() ?? '',
      channel: input.channel?.trim() ?? '',
      market: input.market?.trim() ?? '',
      value: this.nonNegative(input.value ?? 0, 'value'),
      currency: input.currency?.trim() || 'USD',
      deliverables: this.normalizeList(input.deliverables, false),
      startDate: input.startDate ?? '',
      endDate: input.endDate ?? '',
      status: input.status ?? 'lead',
      humanApproved: input.humanApproved ?? false,
    };
    return this.updatePortfolio(id, { sponsorshipDeals: [...portfolio.sponsorshipDeals, deal] });
  }

  addInvestment(id: string, input: Partial<InvestmentPosition>) {
    const portfolio = this.getPortfolio(id);
    if (!input.name?.trim()) throw new BadRequestException('Investment name is required');
    const investment: InvestmentPosition = {
      id: randomUUID(),
      name: input.name.trim(),
      category: input.category ?? 'content',
      investedAmount: this.nonNegative(input.investedAmount ?? 0, 'investedAmount'),
      currentValue: this.nonNegative(input.currentValue ?? 0, 'currentValue'),
      expectedReturn: this.nonNegative(input.expectedReturn ?? 0, 'expectedReturn'),
      actualReturn: this.nonNegative(input.actualReturn ?? 0, 'actualReturn'),
      riskScore: this.score(input.riskScore ?? 0),
      strategicScore: this.score(input.strategicScore ?? 0),
      status: input.status ?? 'candidate',
      humanApproved: input.humanApproved ?? false,
    };
    return this.updatePortfolio(id, { investments: [...portfolio.investments, investment] });
  }

  allocateProfit(id: string, reinvestmentPercentage: number, reservePercentage: number) {
    const portfolio = this.getPortfolio(id);
    if (reinvestmentPercentage < 0 || reservePercentage < 0 || reinvestmentPercentage + reservePercentage > 100) {
      throw new BadRequestException('Allocation percentages are invalid');
    }
    const distributableProfit = Math.max(0, portfolio.totalProfit);
    return this.updatePortfolio(id, {
      reinvestmentAmount: this.money(distributableProfit * reinvestmentPercentage / 100),
      reserveAmount: this.money(distributableProfit * reservePercentage / 100),
    });
  }

  generateFinancialReport(id: string) {
    const portfolio = this.getPortfolio(id);
    return {
      portfolioId: portfolio.id,
      portfolioName: portfolio.name,
      revenue: portfolio.totalRevenue,
      cost: portfolio.totalCost,
      profit: portfolio.totalProfit,
      grossMarginPercentage: portfolio.grossMarginPercentage,
      reinvestmentAmount: portfolio.reinvestmentAmount,
      reserveAmount: portfolio.reserveAmount,
      revenueStreams: portfolio.revenueStreams,
      offers: portfolio.offers,
      sponsorshipDeals: portfolio.sponsorshipDeals,
      investments: portfolio.investments,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateGrowthPlan(id: string) {
    const portfolio = this.getPortfolio(id);
    return {
      portfolioId: portfolio.id,
      recommendedActions: [
        'scale-high-margin-revenue-streams',
        'launch-recurring-revenue-products',
        'expand-sponsorship-pipeline',
        'increase-content-ip-licensing',
        'optimize-conversion-funnels',
        'reinvest-profit-into-best-performing-assets',
        'enter-high-demand-markets',
        'automate-financial-monitoring',
      ],
      targetMarkets: portfolio.targetMarkets,
      targetPlatforms: portfolio.targetPlatforms,
      humanApprovalRequired: true,
      generatedAt: new Date().toISOString(),
    };
  }

  removePortfolio(id: string) {
    this.getPortfolio(id);
    this.portfolios.delete(id);
    return { success: true as const, id };
  }

  private getStage(id: string, stage: MediaBusinessStage) {
    const execution = this.getPortfolio(id).stages.find((item) => item.stage === stage);
    if (!execution) throw new NotFoundException(`Stage '${stage}' was not found`);
    return execution;
  }

  private updateStage(id: string, stage: MediaBusinessStage, input: Partial<BusinessStageExecution>) {
    const portfolio = this.getPortfolio(id);
    return this.updatePortfolio(id, {
      stages: portfolio.stages.map((item) => item.stage === stage ? { ...item, ...input, id: item.id, stage: item.stage, sequence: item.sequence } : item),
    });
  }

  private requiresHumanApproval(stage: MediaBusinessStage) {
    return [
      'pricing-intelligence',
      'sponsorship-intelligence',
      'licensing-revenue-intelligence',
      'franchise-revenue-intelligence',
      'financial-planning',
      'budget-allocation',
      'investment-opportunity-intelligence',
      'content-investment-engine',
      'portfolio-capital-allocation',
      'profit-reinvestment',
      'autonomous-growth',
      'human-final-authority',
    ].includes(stage);
  }

  private score(value: number) {
    if (!Number.isFinite(value)) throw new BadRequestException('Score must be a valid number');
    return Number(Math.max(0, Math.min(100, value)).toFixed(2));
  }

  private nonNegative(value: number, field: string) {
    if (!Number.isFinite(value) || value < 0) throw new BadRequestException(`${field} must be zero or greater`);
    return this.money(value);
  }

  private money(value: number) {
    return Number(value.toFixed(2));
  }

  private normalizeList(values?: string[], lowercase = true) {
    if (!values) return [];
    return [...new Set(values.map((value) => lowercase ? value.trim().toLowerCase() : value.trim()).filter(Boolean))];
  }
}
