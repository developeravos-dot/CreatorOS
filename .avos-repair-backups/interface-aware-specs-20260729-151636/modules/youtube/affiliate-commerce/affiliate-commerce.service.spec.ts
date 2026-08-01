import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AffiliateCommerceService,
} from './affiliate-commerce.service';

describe('AffiliateCommerceService', () => {
  let service: AffiliateCommerceService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [AffiliateCommerceService],
      }).compile();

    service = module.get<AffiliateCommerceService>(
      AffiliateCommerceService,
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

  it('should create and list a record', () => {
    const record = service.createRecord({
      title: 'Revenue Channel',
      category: 'revenue',
      revenue: 500,
      cost: 100,
      targetRevenue: 1000,
      conversionRate: 5,
      score: 85,
      tags: ['YouTube', 'Revenue'],
    });

    expect(record.id).toBeDefined();
    expect(record.currency).toBe('USD');
    expect(record.tags).toEqual([
      'youtube',
      'revenue',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty title', () => {
    expect(() =>
      service.createRecord({
        title: '',
        category: 'revenue',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update a record', () => {
    const record = service.createRecord({
      title: 'Update Record',
      category: 'monetization',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'high',
        score: 92,
      },
    );

    expect(updated.priority).toBe('high');
    expect(updated.score).toBe(92);
  });

  it('should plan and activate a record', () => {
    const record = service.createRecord({
      title: 'Active Revenue Plan',
      category: 'campaign',
    });

    const planned =
      service.planRecord(record.id);

    const active =
      service.activateRecord(record.id);

    expect(planned.status).toBe('planned');
    expect(active.status).toBe('active');
  });

  it('should pause an active record', () => {
    const record = service.createRecord({
      title: 'Pause Revenue Plan',
      category: 'campaign',
    });

    service.activateRecord(record.id);

    const paused =
      service.pauseRecord(record.id);

    expect(paused.status).toBe('paused');
  });

  it('should add revenue and cost', () => {
    const record = service.createRecord({
      title: 'Financial Record',
      category: 'finance',
      revenue: 100,
      cost: 20,
    });

    const revenueUpdated =
      service.addRevenue(record.id, 50);

    const costUpdated =
      service.addCost(record.id, 10);

    expect(revenueUpdated.revenue).toBe(150);
    expect(costUpdated.cost).toBe(30);
  });

  it('should calculate financial summary', () => {
    const record = service.createRecord({
      title: 'Summary Record',
      category: 'finance',
      revenue: 1000,
      cost: 250,
      targetRevenue: 2000,
    });

    const summary =
      service.getFinancialSummary(record.id);

    expect(summary.profit).toBe(750);
    expect(summary.margin).toBe(75);
    expect(summary.achievementRate).toBe(50);
    expect(summary.profitable).toBe(true);
  });

  it('should forecast revenue', () => {
    const forecast = service.forecastRevenue(
      1000,
      10,
      2,
    );

    expect(forecast.forecast).toHaveLength(2);
    expect(forecast.finalRevenue).toBe(1210);
  });

  it('should generate recommendations', () => {
    const record = service.createRecord({
      title: 'Recommendation Record',
      category: 'analysis',
      revenue: 0,
      cost: 100,
      conversionRate: 1,
      score: 30,
    });

    const recommendations =
      service.generateRecommendations(record.id);

    expect(
      recommendations.length,
    ).toBeGreaterThan(0);
  });

  it('should return top records safely', () => {
    service.createRecord({
      title: 'Low Profit',
      category: 'ranking',
      revenue: 100,
      cost: 90,
      score: 50,
    });

    service.createRecord({
      title: 'High Profit',
      category: 'ranking',
      revenue: 1000,
      cost: 100,
      score: 90,
    });

    const top = service.getTopRecords(1);

    expect(top).toHaveLength(1);
    expect(top[0]?.title).toBe('High Profit');
  });

  it('should remove a record', () => {
    const record = service.createRecord({
      title: 'Delete Record',
      category: 'delete',
    });

    service.removeRecord(record.id);

    expect(service.listRecords()).toHaveLength(0);
  });

  it('should throw for missing record', () => {
    expect(() =>
      service.getRecord('missing-id'),
    ).toThrow(NotFoundException);
  });
});
