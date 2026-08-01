import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  BrandIdentityCreativeStudioService,
} from './brand-identity-creative-studio.service';

describe('BrandIdentityCreativeStudioService', () => {
  let service: BrandIdentityCreativeStudioService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [BrandIdentityCreativeStudioService],
      }).compile();

    service =
      module.get<BrandIdentityCreativeStudioService>(
        BrandIdentityCreativeStudioService,
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

  it('should create media record', () => {
    const record = service.createRecord({
      name: 'AVOS Original Production',
      category: 'creative-production',
      owner: 'AVOS Media',
      type: 'creative-production',
      platform: 'YouTube',
      language: 'Arabic',
      creativeStyle: 'Cinematic',
      strategicScore: 92,
      tags: ['AVOS', 'Media'],
    });

    expect(record.id).toBeDefined();
    expect(record.platform).toBe('youtube');
    expect(record.language).toBe('arabic');
    expect(record.tags).toEqual([
      'avos',
      'media',
    ]);
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'media',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Project',
        category: 'media',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update media record', () => {
    const record = service.createRecord({
      name: 'Update Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'critical',
        qualityScore: 95,
      },
    );

    expect(updated.priority).toBe(
      'critical',
    );
    expect(updated.qualityScore).toBe(95);
  });

  it('should start analysis', () => {
    const record = service.createRecord({
      name: 'Analysis Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    expect(
      service.startAnalysis(record.id).status,
    ).toBe('analyzing');
  });

  it('should start planning', () => {
    const record = service.createRecord({
      name: 'Planning Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    expect(
      service.startPlanning(record.id).status,
    ).toBe('planning');
  });

  it('should require human approval', () => {
    const record = service.createRecord({
      name: 'Protected Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    expect(() =>
      service.startExecution(record.id),
    ).toThrow(BadRequestException);
  });

  it('should approve by human', () => {
    const record = service.createRecord({
      name: 'Human Approved Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    const approved =
      service.approveByHuman(record.id);

    expect(approved.humanApproved).toBe(true);
    expect(approved.status).toBe('approved');
  });

  it('should execute approved record', () => {
    const record = service.createRecord({
      name: 'Execution Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    service.approveByHuman(record.id);

    expect(
      service.startExecution(record.id).status,
    ).toBe('executing');
  });

  it('should assign agent', () => {
    const record = service.createRecord({
      name: 'Council Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    const updated = service.assignAgent(
      record.id,
      'Film Director',
    );

    expect(
      updated.assignedAgents,
    ).toContain('film director');
  });

  it('should add capability', () => {
    const record = service.createRecord({
      name: 'Capability Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    const updated = service.addCapability(
      record.id,
      'Visual Intelligence',
    );

    expect(
      updated.capabilities,
    ).toContain('visual intelligence');
  });

  it('should add recommendation', () => {
    const record = service.createRecord({
      name: 'Recommendation Project',
      category: 'media',
      owner: 'AVOS Media',
    });

    const updated =
      service.addRecommendation(
        record.id,
        'Use cinematic production style',
      );

    expect(
      updated.recommendations,
    ).toContain(
      'Use cinematic production style',
    );
  });

  it('should analyze creative direction', () => {
    const record = service.createRecord({
      name: 'Creative Project',
      category: 'media',
      owner: 'AVOS Media',
      qualityScore: 90,
      originalityScore: 90,
      consistencyScore: 90,
      culturalFitScore: 90,
      strategicScore: 90,
      confidenceScore: 90,
    });

    const result =
      service.analyzeCreativeDirection(
        record.id,
      );

    expect(result.score).toBe(90);
    expect(result.recommendation).toBe(
      'production-ready',
    );
  });

  it('should calculate business case', () => {
    const record = service.createRecord({
      name: 'Business Project',
      category: 'media',
      owner: 'AVOS Media',
      estimatedCost: 10000,
      estimatedRevenue: 30000,
    });

    const result =
      service.calculateBusinessCase(record.id);

    expect(result.estimatedProfit).toBe(
      20000,
    );
    expect(result.roi).toBe(200);
  });

  it('should generate agent council', () => {
    const record = service.createRecord({
      name: 'Agent Council',
      category: 'media',
      owner: 'AVOS Media',
    });

    const council =
      service.generateAgentCouncil(record.id);

    expect(council.council.length).toBeGreaterThan(
      10,
    );
    expect(council.humanFinalAuthority).toBe(
      true,
    );
  });

  it('should generate production blueprint', () => {
    const record = service.createRecord({
      name: 'Production Blueprint',
      category: 'media',
      owner: 'AVOS Media',
    });

    const blueprint =
      service.generateProductionBlueprint(
        record.id,
      );

    expect(blueprint.stages).toHaveLength(12);
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete Project',
      category: 'media',
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
