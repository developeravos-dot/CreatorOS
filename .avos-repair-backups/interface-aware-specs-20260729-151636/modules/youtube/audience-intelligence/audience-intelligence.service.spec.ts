import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AudienceIntelligenceService,
} from './audience-intelligence.service';

describe('AudienceIntelligenceService', () => {
  let service: AudienceIntelligenceService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [AudienceIntelligenceService],
      }).compile();

    service = module.get<AudienceIntelligenceService>(
      AudienceIntelligenceService,
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
      name: 'Core Audience',
      category: 'youtube',
      segment: 'subscriber',
      engagementScore: 80,
      loyaltyScore: 70,
      growthScore: 60,
      language: 'AR',
      country: 'ae',
      tags: ['Audience', 'YouTube'],
    });

    expect(record.id).toBeDefined();
    expect(record.language).toBe('ar');
    expect(record.country).toBe('AE');
    expect(record.tags).toEqual([
      'audience',
      'youtube',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'youtube',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update a record', () => {
    const record = service.createRecord({
      name: 'Update Audience',
      category: 'community',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'high',
        engagementScore: 92,
      },
    );

    expect(updated.priority).toBe('high');
    expect(updated.engagementScore).toBe(92);
  });

  it('should move through engagement stages', () => {
    const record = service.createRecord({
      name: 'Audience Workflow',
      category: 'workflow',
    });

    const observing =
      service.observeRecord(record.id);

    const engaged =
      service.markEngaged(record.id);

    const loyal =
      service.markLoyal(record.id);

    expect(observing.status).toBe('observing');
    expect(engaged.status).toBe('engaged');
    expect(loyal.status).toBe('loyal');
    expect(loyal.loyaltyScore).toBeGreaterThanOrEqual(
      70,
    );
  });

  it('should add audience interactions', () => {
    const record = service.createRecord({
      name: 'Interaction Audience',
      category: 'analytics',
      views: 100,
      likes: 10,
    });

    const updated = service.addInteraction(
      record.id,
      {
        views: 50,
        likes: 5,
        comments: 3,
        shares: 2,
        subscribers: 1,
      },
    );

    expect(updated.views).toBe(150);
    expect(updated.likes).toBe(15);
    expect(updated.comments).toBe(3);
    expect(updated.shares).toBe(2);
    expect(updated.subscribers).toBe(1);
  });

  it('should calculate engagement summary', () => {
    const record = service.createRecord({
      name: 'Summary Audience',
      category: 'analytics',
      views: 1000,
      likes: 50,
      comments: 20,
      shares: 10,
      subscribers: 25,
    });

    const summary =
      service.getEngagementSummary(record.id);

    expect(summary.totalInteractions).toBe(80);
    expect(summary.engagementRate).toBe(8);
    expect(
      summary.subscriberConversionRate,
    ).toBe(2.5);
  });

  it('should analyze a positive comment', () => {
    const result = service.analyzeComment(
      'This video is amazing and great',
    );

    expect(result.sentiment).toBe('positive');
    expect(result.positiveMatches).toBeGreaterThan(
      0,
    );
  });

  it('should analyze a negative comment', () => {
    const result = service.analyzeComment(
      'This video is bad and terrible',
    );

    expect(result.sentiment).toBe('negative');
    expect(result.requiresResponse).toBe(true);
  });

  it('should forecast subscriber growth', () => {
    const forecast =
      service.forecastSubscriberGrowth(
        1000,
        10,
        2,
      );

    expect(forecast.forecast).toHaveLength(2);
    expect(forecast.finalSubscribers).toBe(1210);
  });

  it('should generate recommendations', () => {
    const record = service.createRecord({
      name: 'Recommendation Audience',
      category: 'analysis',
      status: 'inactive',
      sentiment: 'negative',
      views: 1000,
      likes: 1,
      loyaltyScore: 20,
    });

    const recommendations =
      service.generateRecommendations(record.id);

    expect(
      recommendations.length,
    ).toBeGreaterThan(0);
  });

  it('should return top records safely', () => {
    service.createRecord({
      name: 'Low Engagement',
      category: 'ranking',
      engagementScore: 20,
    });

    service.createRecord({
      name: 'High Engagement',
      category: 'ranking',
      engagementScore: 95,
    });

    const top = service.getTopRecords(1);

    expect(top).toHaveLength(1);
    expect(top[0]?.name).toBe(
      'High Engagement',
    );
  });

  it('should remove a record', () => {
    const record = service.createRecord({
      name: 'Delete Audience',
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
