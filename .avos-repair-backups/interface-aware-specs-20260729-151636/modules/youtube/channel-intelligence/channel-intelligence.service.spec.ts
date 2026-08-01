import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ChannelIntelligenceService,
} from './channel-intelligence.service';

describe('ChannelIntelligenceService', () => {
  let service: ChannelIntelligenceService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [ChannelIntelligenceService],
      }).compile();

    service = module.get<ChannelIntelligenceService>(
      ChannelIntelligenceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(service.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should create and list a signal', () => {
    const signal = service.createSignal({
      title: 'High-value opportunity',
      category: 'opportunity',
      score: 90,
      priority: 'high',
      tags: ['YouTube', 'Growth'],
    });

    expect(signal.id).toBeDefined();
    expect(signal.score).toBe(90);
    expect(signal.tags).toEqual([
      'youtube',
      'growth',
    ]);
    expect(service.listSignals()).toHaveLength(1);
  });

  it('should update a signal', () => {
    const signal = service.createSignal({
      title: 'Signal',
      category: 'analysis',
    });

    const updated = service.updateSignal(
      signal.id,
      {
        score: 95,
        status: 'reviewing',
      },
    );

    expect(updated.score).toBe(95);
    expect(updated.status).toBe('reviewing');
  });

  it('should advance a signal', () => {
    const signal = service.createSignal({
      title: 'Signal',
      category: 'workflow',
    });

    const advanced =
      service.advanceSignal(signal.id);

    expect(advanced.status).toBe('reviewing');
  });

  it('should reject a signal', () => {
    const signal = service.createSignal({
      title: 'Signal',
      category: 'workflow',
    });

    const rejected =
      service.rejectSignal(signal.id);

    expect(rejected.status).toBe('rejected');
  });

  it('should return top signals by score', () => {
    service.createSignal({
      title: 'Low',
      category: 'ranking',
      score: 20,
    });

    service.createSignal({
      title: 'High',
      category: 'ranking',
      score: 95,
    });

    const topSignals = service.getTopSignals(1);

    expect(topSignals).toHaveLength(1);
    expect(topSignals[0]?.title).toBe('High');
  });

  it('should analyze text', () => {
    const result = service.analyzeText(
      'creator creator youtube intelligence system',
    );

    expect(result.wordCount).toBe(5);
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.keywords[0]?.keyword).toBe(
      'creator',
    );
  });

  it('should reject empty content', () => {
    expect(() =>
      service.analyzeText(''),
    ).toThrow(BadRequestException);
  });

  it('should remove a signal', () => {
    const signal = service.createSignal({
      title: 'Signal',
      category: 'delete',
    });

    service.removeSignal(signal.id);

    expect(service.listSignals()).toHaveLength(0);
  });

  it('should throw for missing signal', () => {
    expect(() =>
      service.getSignal('missing-id'),
    ).toThrow(NotFoundException);
  });
});

