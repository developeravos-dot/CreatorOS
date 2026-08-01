import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  UnifiedMediaAnalyticsEngineService,
} from './unified-media-analytics-engine.service';

describe('UnifiedMediaAnalyticsEngineService', () => {
  let service: UnifiedMediaAnalyticsEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [UnifiedMediaAnalyticsEngineService],
      }).compile();

    service =
      module.get<UnifiedMediaAnalyticsEngineService>(
        UnifiedMediaAnalyticsEngineService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe(
      'operational',
    );

    expect(
      dashboard.humanFinalAuthority,
    ).toBe(true);
  });

  it('should create intelligence record', () => {
    const record = service.createRecord({
      name: 'AVOS Media Intelligence',
      category: 'analytics',
      owner: 'AVOS Media',
      type: 'performance',
      platform: 'YouTube',
      region: 'UAE',
    });

    expect(record.id).toBeDefined();
    expect(record.platform).toBe('youtube');
    expect(record.region).toBe('uae');
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'analytics',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should start analysis', () => {
    const record = service.createRecord({
      name: 'Analysis',
      category: 'analytics',
      owner: 'AVOS Media',
    });

    expect(
      service.startAnalysis(record.id).status,
    ).toBe('analyzing');
  });

  it('should require approval before activation', () => {
    const record = service.createRecord({
      name: 'Protected Intelligence',
      category: 'decision',
      owner: 'AVOS Media',
    });

    expect(() =>
      service.activateIntelligence(record.id),
    ).toThrow(BadRequestException);
  });

  it('should activate after approval', () => {
    const record = service.createRecord({
      name: 'Approved Intelligence',
      category: 'decision',
      owner: 'AVOS Media',
    });

    service.approveByHuman(record.id);

    expect(
      service.activateIntelligence(record.id)
        .status,
    ).toBe('active');
  });

  it('should add metric', () => {
    const record = service.createRecord({
      name: 'Metric',
      category: 'analytics',
      owner: 'AVOS Media',
    });

    const updated = service.addMetric(
      record.id,
      {
        name: 'Views',
        value: 1000,
        previousValue: 800,
      },
    );

    expect(updated.metrics).toHaveLength(1);
    expect(updated.metrics[0]!.value).toBe(
      1000,
    );
  });

  it('should add signal', () => {
    const record = service.createRecord({
      name: 'Signal',
      category: 'trend',
      owner: 'AVOS Media',
    });

    const updated = service.addSignal(
      record.id,
      {
        title: 'Rapid audience growth',
        type: 'opportunity',
        confidence: 90,
        impact: 85,
      },
    );

    expect(updated.signals).toHaveLength(1);
    expect(updated.signals[0]!.type).toBe(
      'opportunity',
    );
  });

  it('should add forecast', () => {
    const record = service.createRecord({
      name: 'Forecast',
      category: 'forecast',
      owner: 'AVOS Media',
    });

    const updated = service.addForecast(
      record.id,
      {
        metric: 'views',
        horizonDays: 30,
        predictedValue: 100000,
        lowerBound: 80000,
        upperBound: 120000,
        confidence: 85,
      },
    );

    expect(updated.forecasts).toHaveLength(1);
    expect(
      updated.forecasts[0]!.horizonDays,
    ).toBe(30);
  });

  it('should add and approve decision', () => {
    const record = service.createRecord({
      name: 'Decision',
      category: 'executive',
      owner: 'AVOS Media',
    });

    const withDecision = service.addDecision(
      record.id,
      {
        title: 'Expand successful series',
        recommendation:
          'Produce five new episodes',
        expectedImpact: 90,
        confidence: 88,
      },
    );

    const decisionId =
      withDecision.decisions[0]!.id;

    const updated = service.approveDecision(
      record.id,
      decisionId,
      'Human Authority',
    );

    expect(
      updated.decisions[0]!.humanApproved,
    ).toBe(true);

    expect(
      updated.decisions[0]!.status,
    ).toBe('approved');
  });

  it('should calculate unified performance', () => {
    const record = service.createRecord({
      name: 'Performance',
      category: 'analytics',
      owner: 'AVOS Media',
      impressions: 1000,
      views: 100,
      revenue: 1000,
      cost: 500,
    });

    const result =
      service.calculateUnifiedPerformance(
        record.id,
      );

    expect(
      result.calculatedClickThroughRate,
    ).toBe(10);

    expect(result.profit).toBe(500);
    expect(result.returnOnInvestment).toBe(100);
  });

  it('should generate audience intelligence', () => {
    const record = service.createRecord({
      name: 'Audience',
      category: 'audience',
      owner: 'AVOS Media',
    });

    const report =
      service.generateAudienceIntelligence(
        record.id,
      );

    expect(report.analysisStages).toHaveLength(
      7,
    );
  });

  it('should generate trend intelligence', () => {
    const record = service.createRecord({
      name: 'Trend',
      category: 'trend',
      owner: 'AVOS Media',
    });

    const report =
      service.generateTrendIntelligence(
        record.id,
      );

    expect(report.trendStages).toHaveLength(7);
  });

  it('should generate opportunity radar', () => {
    const record = service.createRecord({
      name: 'Opportunity',
      category: 'opportunity',
      owner: 'AVOS Media',
    });

    const radar =
      service.generateOpportunityRadar(
        record.id,
      );

    expect(radar.radarDimensions).toHaveLength(
      7,
    );
  });

  it('should generate forecast report', () => {
    const record = service.createRecord({
      name: 'Forecast Report',
      category: 'forecast',
      owner: 'AVOS Media',
    });

    const report =
      service.generateForecastReport(record.id);

    expect(report.horizons.shortTermDays).toBe(
      7,
    );
  });

  it('should generate executive decision brief', () => {
    const record = service.createRecord({
      name: 'Executive Brief',
      category: 'executive',
      owner: 'AVOS Media',
    });

    const brief =
      service.generateExecutiveDecisionBrief(
        record.id,
      );

    expect(brief.humanFinalAuthority).toBe(
      true,
    );
  });

  it('should assess intelligence readiness', () => {
    const record = service.createRecord({
      name: 'Assessment',
      category: 'intelligence',
      owner: 'AVOS Media',
      performanceScore: 90,
      audienceScore: 90,
      trendScore: 90,
      opportunityScore: 90,
      forecastConfidenceScore: 90,
      decisionConfidenceScore: 90,
      strategicValueScore: 90,
    });

    const result =
      service.runIntelligenceAssessment(
        record.id,
      );

    expect(result.score).toBe(90);

    expect(result.recommendation).toBe(
      'strategic-action-ready-for-human-approval',
    );
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete Intelligence',
      category: 'analytics',
      owner: 'AVOS Media',
    });

    service.removeRecord(record.id);

    expect(service.listRecords()).toHaveLength(
      0,
    );
  });

  it('should throw for missing record', () => {
    expect(() =>
      service.getRecord('missing-id'),
    ).toThrow(NotFoundException);
  });
});
