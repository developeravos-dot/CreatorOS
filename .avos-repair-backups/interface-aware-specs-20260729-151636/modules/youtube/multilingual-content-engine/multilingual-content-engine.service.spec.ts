import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MultilingualContentEngineService,
} from './multilingual-content-engine.service';

describe('MultilingualContentEngineService', () => {
  let service: MultilingualContentEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [MultilingualContentEngineService],
      }).compile();

    service = module.get<MultilingualContentEngineService>(
      MultilingualContentEngineService,
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

  it('should create and list expansion', () => {
    const record = service.createRecord({
      name: 'Arabic Market Expansion',
      category: 'global-growth',
      owner: 'CreatorOS',
      type: 'market-expansion',
      sourceLanguage: 'en',
      targetLanguage: 'ar',
      country: 'ae',
      region: 'mena',
      opportunityScore: 90,
      tags: ['YouTube', 'Global'],
    });

    expect(record.id).toBeDefined();
    expect(record.country).toBe('AE');
    expect(record.region).toBe('MENA');
    expect(record.tags).toEqual([
      'youtube',
      'global',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'global',
        owner: 'CreatorOS',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Expansion',
        category: 'global',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update expansion', () => {
    const record = service.createRecord({
      name: 'Update Expansion',
      category: 'global',
      owner: 'CreatorOS',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'critical',
        opportunityScore: 95,
      },
    );

    expect(updated.priority).toBe('critical');
    expect(updated.opportunityScore).toBe(95);
  });

  it('should start research and localization', () => {
    const record = service.createRecord({
      name: 'Localization Workflow',
      category: 'localization',
      owner: 'CreatorOS',
    });

    const researching =
      service.startResearch(record.id);

    const localizing =
      service.startLocalization(record.id);

    expect(researching.status).toBe(
      'researching',
    );
    expect(localizing.status).toBe(
      'localizing',
    );
  });

  it('should update compliance', () => {
    const record = service.createRecord({
      name: 'Compliance Expansion',
      category: 'compliance',
      owner: 'CreatorOS',
    });

    const updated = service.updateCompliance(
      record.id,
      'compliant',
      95,
    );

    expect(updated.complianceStatus).toBe(
      'compliant',
    );
    expect(updated.complianceScore).toBe(95);
  });

  it('should approve compliant expansion', () => {
    const record = service.createRecord({
      name: 'Approved Expansion',
      category: 'launch',
      owner: 'CreatorOS',
      complianceStatus: 'compliant',
      complianceScore: 95,
    });

    const approved =
      service.approveRecord(record.id);

    expect(approved.status).toBe('approved');
  });

  it('should block non-compliant approval', () => {
    const record = service.createRecord({
      name: 'Blocked Expansion',
      category: 'launch',
      owner: 'CreatorOS',
      complianceStatus: 'non-compliant',
    });

    expect(() =>
      service.approveRecord(record.id),
    ).toThrow(BadRequestException);
  });

  it('should launch approved expansion', () => {
    const record = service.createRecord({
      name: 'Launch Expansion',
      category: 'launch',
      owner: 'CreatorOS',
      complianceStatus: 'compliant',
    });

    service.approveRecord(record.id);

    const launching =
      service.launchRecord(record.id);

    expect(launching.status).toBe('launching');
  });

  it('should add distribution channel', () => {
    const record = service.createRecord({
      name: 'Distribution Expansion',
      category: 'distribution',
      owner: 'CreatorOS',
    });

    const updated =
      service.addDistributionChannel(
        record.id,
        'YouTube Shorts',
      );

    expect(
      updated.distributionChannels,
    ).toContain('youtube shorts');
  });

  it('should add expansion risk', () => {
    const record = service.createRecord({
      name: 'Risk Expansion',
      category: 'risk',
      owner: 'CreatorOS',
    });

    const updated = service.addRisk(
      record.id,
      'Regional copyright risk',
    );

    expect(updated.risks).toContain(
      'Regional copyright risk',
    );
  });

  it('should analyze market opportunity', () => {
    const record = service.createRecord({
      name: 'Opportunity Expansion',
      category: 'market',
      owner: 'CreatorOS',
      opportunityScore: 90,
      localizationScore: 90,
      culturalFitScore: 90,
      complianceScore: 90,
      distributionScore: 90,
      confidenceScore: 90,
    });

    const analysis =
      service.analyzeMarketOpportunity(
        record.id,
      );

    expect(analysis.score).toBe(90);
    expect(analysis.recommendation).toBe(
      'expand-immediately',
    );
  });

  it('should calculate expansion case', () => {
    const record = service.createRecord({
      name: 'Investment Expansion',
      category: 'investment',
      owner: 'CreatorOS',
      estimatedCost: 10000,
      estimatedRevenue: 30000,
      estimatedAudience: 1000000,
    });

    const result =
      service.calculateExpansionCase(record.id);

    expect(result.estimatedProfit).toBe(20000);
    expect(result.roi).toBe(200);
    expect(
      result.audienceAcquisitionCost,
    ).toBe(0.01);
  });

  it('should generate localization plan', () => {
    const record = service.createRecord({
      name: 'Localization Plan',
      category: 'localization',
      owner: 'CreatorOS',
      sourceLanguage: 'en',
      targetLanguage: 'ar',
    });

    const plan =
      service.generateLocalizationPlan(
        record.id,
      );

    expect(plan.steps).toHaveLength(7);
    expect(plan.targetLanguage).toBe('ar');
  });

  it('should generate distribution plan', () => {
    const record = service.createRecord({
      name: 'Distribution Plan',
      category: 'distribution',
      owner: 'CreatorOS',
    });

    const plan =
      service.generateDistributionPlan(
        record.id,
      );

    expect(plan.phases).toHaveLength(5);
    expect(plan.channels.length).toBeGreaterThan(
      0,
    );
  });

  it('should run compliance assessment', () => {
    const record = service.createRecord({
      name: 'Assessment Expansion',
      category: 'compliance',
      owner: 'CreatorOS',
      complianceStatus: 'compliant',
      complianceScore: 90,
      requirements: [
        'Regional advertising compliance',
      ],
    });

    const assessment =
      service.runComplianceAssessment(
        record.id,
      );

    expect(assessment.passed).toBe(true);
    expect(assessment.issues).toHaveLength(0);
  });

  it('should remove expansion', () => {
    const record = service.createRecord({
      name: 'Delete Expansion',
      category: 'delete',
      owner: 'CreatorOS',
    });

    service.removeRecord(record.id);

    expect(service.listRecords()).toHaveLength(0);
  });

  it('should throw for missing expansion', () => {
    expect(() =>
      service.getRecord('missing-id'),
    ).toThrow(NotFoundException);
  });
});
