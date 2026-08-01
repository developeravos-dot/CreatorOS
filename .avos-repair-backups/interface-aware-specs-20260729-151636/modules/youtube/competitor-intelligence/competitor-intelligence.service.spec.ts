import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CompetitorIntelligenceService,
} from './competitor-intelligence.service';

describe('CompetitorIntelligenceService', () => {
  let service: CompetitorIntelligenceService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [CompetitorIntelligenceService],
      }).compile();

    service = module.get<CompetitorIntelligenceService>(
      CompetitorIntelligenceService,
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
      title: 'YouTube Operation',
      category: 'growth',
      score: 80,
      tags: ['YouTube', 'Creator'],
    });

    expect(record.id).toBeDefined();
    expect(record.tags).toEqual([
      'youtube',
      'creator',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty title', () => {
    expect(() =>
      service.createRecord({
        title: '',
        category: 'growth',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update a record', () => {
    const record = service.createRecord({
      title: 'Operation',
      category: 'content',
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

  it('should schedule a record', () => {
    const record = service.createRecord({
      title: 'Scheduled Operation',
      category: 'publishing',
    });

    const scheduled = service.scheduleRecord(
      record.id,
      '2027-01-01T10:00:00.000Z',
    );

    expect(scheduled.status).toBe('scheduled');
    expect(scheduled.scheduledAt).toBeDefined();
  });

  it('should activate and pause a record', () => {
    const record = service.createRecord({
      title: 'Active Operation',
      category: 'workflow',
    });

    const active =
      service.activateRecord(record.id);

    const paused =
      service.pauseRecord(record.id);

    expect(active.status).toBe('active');
    expect(paused.status).toBe('paused');
  });

  it('should complete record at full progress', () => {
    const record = service.createRecord({
      title: 'Completion Operation',
      category: 'workflow',
    });

    const completed = service.updateProgress(
      record.id,
      100,
    );

    expect(completed.status).toBe('completed');
    expect(completed.progress).toBe(100);
    expect(completed.completedAt).toBeDefined();
  });

  it('should analyze metrics', () => {
    const result = service.analyzeMetrics([
      10,
      20,
      30,
    ]);

    expect(result.average).toBe(20);
    expect(result.trend).toBe('up');
  });

  it('should generate recommendations', () => {
    const record = service.createRecord({
      title: 'Recommendation Operation',
      category: 'analysis',
      score: 30,
      priority: 'critical',
    });

    const recommendations =
      service.generateRecommendations(record.id);

    expect(
      recommendations.length,
    ).toBeGreaterThan(0);
  });

  it('should rank top records safely', () => {
    service.createRecord({
      title: 'Low',
      category: 'ranking',
      score: 20,
    });

    service.createRecord({
      title: 'High',
      category: 'ranking',
      score: 95,
    });

    const top = service.getTopRecords(1);

    expect(top).toHaveLength(1);
    expect(top[0]?.title).toBe('High');
  });

  it('should remove record', () => {
    const record = service.createRecord({
      title: 'Delete Operation',
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
