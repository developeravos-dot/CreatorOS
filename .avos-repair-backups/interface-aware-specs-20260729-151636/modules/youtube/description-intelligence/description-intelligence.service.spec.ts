import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  DescriptionIntelligenceService,
} from './description-intelligence.service';

describe('DescriptionIntelligenceService', () => {
  let service: DescriptionIntelligenceService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [DescriptionIntelligenceService],
      }).compile();

    service = module.get<DescriptionIntelligenceService>(
      DescriptionIntelligenceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe('operational');
    expect(dashboard.totalCandidates).toBe(0);
  });

  it('should expose optimization rules', () => {
    const rules = service.getRules();

    expect(rules.minimumLength).toBeGreaterThan(0);
    expect(rules.maximumLength).toBeGreaterThan(
      rules.minimumLength,
    );
  });

  it('should create and list a candidate', () => {
    const candidate = service.createCandidate({
      name: 'Candidate One',
      content:
        'Amazing creator growth strategy for YouTube',
      tags: ['YouTube', 'Growth'],
    });

    expect(candidate.id).toBeDefined();
    expect(candidate.tags).toEqual([
      'youtube',
      'growth',
    ]);
    expect(service.listCandidates()).toHaveLength(1);
  });

  it('should reject empty content', () => {
    expect(() =>
      service.createCandidate({
        name: 'Empty',
        content: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should evaluate content', () => {
    const result = service.evaluate(
      'Amazing YouTube creator growth strategy',
    );

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.wordCount).toBeGreaterThan(0);
  });

  it('should compare candidates', () => {
    const comparison = service.compare([
      'Basic creator video',
      'Amazing creator growth strategy 2026',
    ]);

    expect(comparison.candidates).toHaveLength(2);
    expect(comparison.winner).not.toBeNull();
  });

  it('should optimize a candidate', () => {
    const candidate = service.createCandidate({
      name: 'Optimization Test',
      content: 'creator growth strategy',
    });

    const optimized =
      service.optimizeCandidate(candidate.id);

    expect(optimized.status).toBe('optimized');
  });

  it('should update and reject candidate', () => {
    const candidate = service.createCandidate({
      name: 'Update Test',
      content:
        'Amazing creator intelligence platform',
    });

    const updated = service.updateCandidate(
      candidate.id,
      {
        priority: 'high',
      },
    );

    const rejected =
      service.rejectCandidate(candidate.id);

    expect(updated.priority).toBe('high');
    expect(rejected.status).toBe('rejected');
  });

  it('should rank top candidates safely', () => {
    service.createCandidate({
      name: 'First',
      content: 'creator video',
    });

    service.createCandidate({
      name: 'Second',
      content:
        'Amazing creator growth strategy 2026',
    });

    const top = service.getTopCandidates(1);

    expect(top).toHaveLength(1);
    expect(top[0]?.id).toBeDefined();
  });

  it('should remove candidate', () => {
    const candidate = service.createCandidate({
      name: 'Delete Test',
      content: 'creator content',
    });

    service.removeCandidate(candidate.id);

    expect(service.listCandidates()).toHaveLength(0);
  });

  it('should throw for missing candidate', () => {
    expect(() =>
      service.getCandidate('missing-id'),
    ).toThrow(NotFoundException);
  });
});
