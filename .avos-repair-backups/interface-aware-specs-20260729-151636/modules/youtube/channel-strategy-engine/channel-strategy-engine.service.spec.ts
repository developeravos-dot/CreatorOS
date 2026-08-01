import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ChannelStrategyEngineService,
} from './channel-strategy-engine.service';

describe('ChannelStrategyEngineService', () => {
  let service: ChannelStrategyEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [ChannelStrategyEngineService],
      }).compile();

    service = module.get<ChannelStrategyEngineService>(
      ChannelStrategyEngineService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe('operational');
    expect(dashboard.totalRecords).toBe(0);
  });

  it('should create and list strategy', () => {
    const record = service.createRecord({
      name: 'YouTube Growth Strategy',
      category: 'growth',
      owner: 'CreatorOS',
      type: 'channel',
      market: 'global',
      strategicScore: 90,
      opportunityScore: 85,
      tags: ['YouTube', 'Growth'],
    });

    expect(record.id).toBeDefined();
    expect(record.market).toBe('GLOBAL');
    expect(record.tags).toEqual([
      'youtube',
      'growth',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'growth',
        owner: 'CreatorOS',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Strategy',
        category: 'growth',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update strategy', () => {
    const record = service.createRecord({
      name: 'Update Strategy',
      category: 'strategy',
      owner: 'CreatorOS',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'critical',
        strategicScore: 95,
      },
    );

    expect(updated.priority).toBe('critical');
    expect(updated.strategicScore).toBe(95);
  });

  it('should start analysis', () => {
    const record = service.createRecord({
      name: 'Analysis Strategy',
      category: 'analysis',
      owner: 'CreatorOS',
    });

    const analyzed =
      service.startAnalysis(record.id);

    expect(analyzed.status).toBe('analyzing');
  });

  it('should recommend strategy', () => {
    const record = service.createRecord({
      name: 'Recommended Strategy',
      category: 'strategy',
      owner: 'CreatorOS',
    });

    const recommended =
      service.recommendRecord(
        record.id,
        'Strong market opportunity',
      );

    expect(recommended.status).toBe(
      'recommended',
    );
    expect(recommended.rationale).toBe(
      'Strong market opportunity',
    );
  });

  it('should approve and execute strategy', () => {
    const record = service.createRecord({
      name: 'Executive Strategy',
      category: 'executive',
      owner: 'CreatorOS',
    });

    const approved = service.approveRecord(
      record.id,
      'Approved for execution',
    );

    const executing =
      service.executeRecord(record.id);

    expect(approved.status).toBe('approved');
    expect(executing.status).toBe('executing');
  });

  it('should block execution before approval', () => {
    const record = service.createRecord({
      name: 'Blocked Strategy',
      category: 'executive',
      owner: 'CreatorOS',
    });

    expect(() =>
      service.executeRecord(record.id),
    ).toThrow(BadRequestException);
  });

  it('should add intelligence signal', () => {
    const record = service.createRecord({
      name: 'Trend Strategy',
      category: 'trend',
      owner: 'CreatorOS',
    });

    const updated = service.addSignal(
      record.id,
      'Search demand increased',
    );

    expect(updated.signals).toContain(
      'Search demand increased',
    );
  });

  it('should calculate investment case', () => {
    const record = service.createRecord({
      name: 'Investment Strategy',
      category: 'investment',
      owner: 'CreatorOS',
      estimatedCost: 10000,
      estimatedRevenue: 25000,
      estimatedViews: 500000,
    });

    const investment =
      service.calculateInvestmentCase(record.id);

    expect(investment.estimatedProfit).toBe(
      15000,
    );
    expect(investment.roi).toBe(150);
    expect(investment.revenuePerView).toBe(
      0.05,
    );
  });

  it('should analyze opportunity', () => {
    const record = service.createRecord({
      name: 'Opportunity Strategy',
      category: 'opportunity',
      owner: 'CreatorOS',
      opportunityScore: 90,
      trendScore: 90,
      strategicScore: 90,
      confidenceScore: 90,
      investmentScore: 90,
    });

    const opportunity =
      service.analyzeOpportunity(record.id);

    expect(opportunity.combinedScore).toBe(90);
    expect(opportunity.recommendation).toBe(
      'strong-opportunity',
    );
  });

  it('should generate strategic plan', () => {
    const record = service.createRecord({
      name: 'Planning Strategy',
      category: 'planning',
      owner: 'CreatorOS',
      timeframeDays: 100,
    });

    const plan =
      service.generateStrategicPlan(record.id);

    expect(plan.phases).toHaveLength(5);
    expect(plan.timeframeDays).toBe(100);
  });

  it('should generate executive summary', () => {
    const record = service.createRecord({
      name: 'Summary Strategy',
      category: 'executive',
      owner: 'CreatorOS',
      opportunityScore: 90,
      trendScore: 80,
      strategicScore: 90,
      confidenceScore: 90,
      investmentScore: 80,
      estimatedCost: 10000,
      estimatedRevenue: 30000,
    });

    const summary =
      service.getExecutiveSummary(record.id);

    expect(summary.recommendedAction).toBe(
      'approve',
    );
    expect(summary.investment.estimatedProfit).toBe(
      20000,
    );
  });

  it('should return top strategic record', () => {
    service.createRecord({
      name: 'Low Strategy',
      category: 'ranking',
      owner: 'CreatorOS',
      strategicScore: 20,
    });

    service.createRecord({
      name: 'High Strategy',
      category: 'ranking',
      owner: 'CreatorOS',
      strategicScore: 95,
    });

    const top = service.getTopRecords(1);

    expect(top).toHaveLength(1);
    expect(top[0]?.name).toBe('High Strategy');
  });

  it('should remove strategy', () => {
    const record = service.createRecord({
      name: 'Delete Strategy',
      category: 'delete',
      owner: 'CreatorOS',
    });

    service.removeRecord(record.id);

    expect(service.listRecords()).toHaveLength(0);
  });

  it('should throw for missing strategy', () => {
    expect(() =>
      service.getRecord('missing-id'),
    ).toThrow(NotFoundException);
  });
});
