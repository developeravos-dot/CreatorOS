import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AssetLibraryService,
} from './asset-library.service';

describe('AssetLibraryService', () => {
  let service: AssetLibraryService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [AssetLibraryService],
      }).compile();

    service = module.get<AssetLibraryService>(
      AssetLibraryService,
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
      title: 'Production Asset',
      category: 'youtube',
      assetType: 'video',
      score: 85,
      durationSeconds: 300,
      language: 'AR',
      tags: ['YouTube', 'Production'],
    });

    expect(record.id).toBeDefined();
    expect(record.language).toBe('ar');
    expect(record.tags).toEqual([
      'youtube',
      'production',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty title', () => {
    expect(() =>
      service.createRecord({
        title: '',
        category: 'youtube',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update a record', () => {
    const record = service.createRecord({
      title: 'Update Asset',
      category: 'production',
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

  it('should move through production stages', () => {
    const record = service.createRecord({
      title: 'Workflow Asset',
      category: 'workflow',
    });

    const draft =
      service.moveToDraft(record.id);

    const production =
      service.startProduction(record.id);

    const review =
      service.sendToReview(record.id);

    expect(draft.status).toBe('draft');
    expect(production.status).toBe(
      'in-production',
    );
    expect(review.status).toBe('review');
  });

  it('should mark a record ready', () => {
    const record = service.createRecord({
      title: 'Ready Asset',
      category: 'workflow',
    });

    const ready =
      service.markReady(record.id);

    expect(ready.status).toBe('ready');
    expect(ready.progress).toBe(100);
  });

  it('should publish a ready record', () => {
    const record = service.createRecord({
      title: 'Publish Asset',
      category: 'workflow',
    });

    service.markReady(record.id);

    const published =
      service.publishRecord(record.id);

    expect(published.status).toBe('published');
    expect(published.progress).toBe(100);
  });

  it('should attach a production file', () => {
    const record = service.createRecord({
      title: 'File Asset',
      category: 'asset',
    });

    const updated = service.attachFile(
      record.id,
      'https://example.com/video.mp4',
    );

    expect(updated.fileUrl).toBe(
      'https://example.com/video.mp4',
    );
  });

  it('should generate a content outline', () => {
    const result = service.generateOutline(
      'Artificial Intelligence',
      5,
    );

    expect(result.sections).toBe(5);
    expect(result.outline).toHaveLength(5);
    expect(result.outline[0]?.order).toBe(1);
  });

  it('should estimate production duration', () => {
    const result = service.estimateProduction(
      300,
      150,
    );

    expect(result.durationMinutes).toBe(2);
    expect(result.durationSeconds).toBe(120);
  });

  it('should generate recommendations', () => {
    const record = service.createRecord({
      title: 'Recommendation Asset',
      category: 'analysis',
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
      title: 'Delete Asset',
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
