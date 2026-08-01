import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LocalizationGlobalDistributionService,
} from './localization-global-distribution.service';

describe('LocalizationGlobalDistributionService', () => {
  let service: LocalizationGlobalDistributionService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [LocalizationGlobalDistributionService],
      }).compile();

    service =
      module.get<LocalizationGlobalDistributionService>(
        LocalizationGlobalDistributionService,
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

  it('should create publishing record', () => {
    const record = service.createRecord({
      name: 'AVOS Global Release',
      category: 'global-release',
      owner: 'AVOS Media',
      type: 'release',
      primaryPlatform: 'YouTube',
      platforms: [
        'YouTube',
        'TikTok',
      ],
      languages: [
        'Arabic',
        'English',
      ],
      regions: [
        'UAE',
        'Global',
      ],
    });

    expect(record.id).toBeDefined();
    expect(record.primaryPlatform).toBe(
      'youtube',
    );
    expect(record.platforms).toContain(
      'youtube',
    );
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'release',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should start planning', () => {
    const record = service.createRecord({
      name: 'Planning',
      category: 'release',
      owner: 'AVOS Media',
    });

    expect(
      service.startPlanning(record.id).status,
    ).toBe('planning');
  });

  it('should start localization', () => {
    const record = service.createRecord({
      name: 'Localization',
      category: 'localization',
      owner: 'AVOS Media',
    });

    expect(
      service.startLocalization(record.id)
        .status,
    ).toBe('localization');
  });

  it('should schedule release', () => {
    const record = service.createRecord({
      name: 'Scheduled Release',
      category: 'release',
      owner: 'AVOS Media',
    });

    const updated = service.scheduleRelease(
      record.id,
      '2026-08-01T12:00:00.000Z',
    );

    expect(updated.status).toBe('scheduled');
    expect(updated.scheduledAt).toContain(
      '2026-08-01',
    );
  });

  it('should require human approval before publishing', () => {
    const record = service.createRecord({
      name: 'Protected Release',
      category: 'release',
      owner: 'AVOS Media',
    });

    expect(() =>
      service.startPublishing(record.id),
    ).toThrow(BadRequestException);
  });

  it('should publish after human approval', () => {
    const record = service.createRecord({
      name: 'Approved Release',
      category: 'release',
      owner: 'AVOS Media',
    });

    service.approveByHuman(record.id);

    expect(
      service.startPublishing(record.id).status,
    ).toBe('publishing');
  });

  it('should add distribution channel', () => {
    const record = service.createRecord({
      name: 'Distribution',
      category: 'distribution',
      owner: 'AVOS Media',
    });

    const updated =
      service.addDistributionChannel(
        record.id,
        {
          platform: 'YouTube',
          accountId: 'channel-1',
          region: 'UAE',
          language: 'Arabic',
        },
      );

    expect(
      updated.distributionChannels,
    ).toHaveLength(1);

    expect(
      updated.distributionChannels[0]!
        .platform,
    ).toBe('youtube');
  });

  it('should update distribution channel', () => {
    const record = service.createRecord({
      name: 'Update Distribution',
      category: 'distribution',
      owner: 'AVOS Media',
    });

    const withChannel =
      service.addDistributionChannel(
        record.id,
        {
          platform: 'YouTube',
        },
      );

    const channelId =
      withChannel.distributionChannels[0]!.id;

    const updated =
      service.updateDistributionChannel(
        record.id,
        channelId,
        {
          status: 'ready',
        },
      );

    expect(
      updated.distributionChannels[0]!
        .status,
    ).toBe('ready');
  });

  it('should remove distribution channel', () => {
    const record = service.createRecord({
      name: 'Remove Distribution',
      category: 'distribution',
      owner: 'AVOS Media',
    });

    const withChannel =
      service.addDistributionChannel(
        record.id,
        {
          platform: 'TikTok',
        },
      );

    const channelId =
      withChannel.distributionChannels[0]!.id;

    const updated =
      service.removeDistributionChannel(
        record.id,
        channelId,
      );

    expect(
      updated.distributionChannels,
    ).toHaveLength(0);
  });

  it('should add experiment', () => {
    const record = service.createRecord({
      name: 'Growth Experiment',
      category: 'growth',
      owner: 'AVOS Media',
    });

    const updated = service.addExperiment(
      record.id,
      'Test three thumbnail variants',
    );

    expect(updated.experiments).toContain(
      'Test three thumbnail variants',
    );
  });

  it('should calculate performance', () => {
    const record = service.createRecord({
      name: 'Performance',
      category: 'analytics',
      owner: 'AVOS Media',
      impressions: 1000,
      views: 100,
      likes: 10,
      comments: 5,
      shares: 5,
      conversions: 10,
      revenue: 200,
      cost: 100,
    });

    const performance =
      service.calculatePerformance(record.id);

    expect(
      performance.clickThroughRate,
    ).toBe(10);

    expect(
      performance.engagementRate,
    ).toBe(20);

    expect(
      performance.returnOnInvestment,
    ).toBe(100);
  });

  it('should generate metadata blueprint', () => {
    const record = service.createRecord({
      name: 'Metadata',
      category: 'optimization',
      owner: 'AVOS Media',
    });

    const blueprint =
      service.generateMetadataBlueprint(
        record.id,
      );

    expect(
      blueprint.optimizationChecklist,
    ).toHaveLength(7);
  });

  it('should generate localization plan', () => {
    const record = service.createRecord({
      name: 'Localization Plan',
      category: 'localization',
      owner: 'AVOS Media',
      languages: [
        'Arabic',
        'English',
      ],
    });

    const plan =
      service.generateLocalizationPlan(
        record.id,
      );

    expect(plan.localizationStages).toHaveLength(
      8,
    );
  });

  it('should generate distribution plan', () => {
    const record = service.createRecord({
      name: 'Distribution Plan',
      category: 'distribution',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateDistributionPlan(
        record.id,
      );

    expect(plan.stages).toHaveLength(7);
  });

  it('should generate growth plan', () => {
    const record = service.createRecord({
      name: 'Growth Plan',
      category: 'growth',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateGrowthPlan(record.id);

    expect(plan.growthLoops).toHaveLength(7);
  });

  it('should assess release readiness', () => {
    const record = service.createRecord({
      name: 'Ready Release',
      category: 'release',
      owner: 'AVOS Media',
      metadataScore: 90,
      titleScore: 90,
      thumbnailScore: 90,
      localizationScore: 90,
      audienceFitScore: 90,
      distributionScore: 90,
      growthScore: 90,
    });

    const result =
      service.runReleaseReadinessAssessment(
        record.id,
      );

    expect(result.score).toBe(90);
    expect(result.recommendation).toBe(
      'ready-for-human-approval',
    );
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete Release',
      category: 'release',
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
