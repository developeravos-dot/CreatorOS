import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CampaignManagerService,
} from './campaign-manager.service';

describe('CampaignManagerService', () => {
  let service: CampaignManagerService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [CampaignManagerService],
      }).compile();

    service = module.get<CampaignManagerService>(
      CampaignManagerService,
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
      title: 'Growth Record',
      category: 'growth',
      score: 85,
      targetValue: 1000,
      currentValue: 250,
      tags: ['YouTube', 'Growth'],
    });

    expect(record.id).toBeDefined();
    expect(record.progress).toBe(25);
    expect(record.tags).toEqual([
      'youtube',
      'growth',
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
      title: 'Update Record',
      category: 'management',
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

  it('should plan and start a record', () => {
    const record = service.createRecord({
      title: 'Campaign',
      category: 'campaign',
    });

    const planned = service.planRecord(
      record.id,
    );

    const running = service.startRecord(
      record.id,
    );

    expect(planned.status).toBe('planned');
    expect(running.status).toBe('running');
    expect(running.startAt).toBeDefined();
  });

  it('should pause a running record', () => {
    const record = service.createRecord({
      title: 'Running Record',
      category: 'workflow',
    });

    service.startRecord(record.id);

    const paused = service.pauseRecord(
      record.id,
    );

    expect(paused.status).toBe('paused');
  });

  it('should update progress', () => {
    const record = service.createRecord({
      title: 'Progress Record',
      category: 'metrics',
      targetValue: 200,
    });

    const updated = service.recordProgress(
      record.id,
      100,
    );

    expect(updated.progress).toBe(50);
    expect(updated.currentValue).toBe(100);
  });

  it('should complete at target', () => {
    const record = service.createRecord({
      title: 'Completion Record',
      category: 'metrics',
      targetValue: 100,
    });

    const completed =
      service.recordProgress(record.id, 100);

    expect(completed.status).toBe('completed');
    expect(completed.progress).toBe(100);
    expect(completed.endAt).toBeDefined();
  });

  it('should analyze values', () => {
    const result = service.analyzeValues([
      100,
      150,
      200,
    ]);

    expect(result.trend).toBe('up');
    expect(result.growth).toBe(100);
    expect(result.average).toBe(150);
  });

  it('should generate recommendations', () => {
    const record = service.createRecord({
      title: 'Recommendation Record',
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

  it('should return top records safely', () => {
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
