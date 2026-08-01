import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentConceptLabService,
} from './content-concept-lab.service';

describe('ContentConceptLabService', () => {
  let service: ContentConceptLabService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [ContentConceptLabService],
      }).compile();

    service =
      module.get<ContentConceptLabService>(
        ContentConceptLabService,
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

  it('should create development record', () => {
    const record = service.createRecord({
      name: 'Original Media Concept',
      category: 'concept-development',
      owner: 'AVOS Media',
      type: 'concept',
      platform: 'YouTube',
      language: 'Arabic',
      culture: 'Gulf',
      originalityScore: 95,
      tags: ['AVOS', 'Original'],
    });

    expect(record.id).toBeDefined();
    expect(record.platform).toBe('youtube');
    expect(record.language).toBe('arabic');
    expect(record.tags).toEqual([
      'avos',
      'original',
    ]);
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'concept',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Concept',
        category: 'concept',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update development record', () => {
    const record = service.createRecord({
      name: 'Update Concept',
      category: 'concept',
      owner: 'AVOS Media',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'critical',
        viralityScore: 90,
      },
    );

    expect(updated.priority).toBe(
      'critical',
    );

    expect(updated.viralityScore).toBe(90);
  });

  it('should start research', () => {
    const record = service.createRecord({
      name: 'Research Concept',
      category: 'research',
      owner: 'AVOS Media',
    });

    expect(
      service.startResearch(record.id).status,
    ).toBe('researching');
  });

  it('should start ideation', () => {
    const record = service.createRecord({
      name: 'Idea Concept',
      category: 'ideas',
      owner: 'AVOS Media',
    });

    expect(
      service.startIdeation(record.id).status,
    ).toBe('ideating');
  });

  it('should start evaluation', () => {
    const record = service.createRecord({
      name: 'Evaluation Concept',
      category: 'evaluation',
      owner: 'AVOS Media',
    });

    expect(
      service.startEvaluation(record.id).status,
    ).toBe('evaluating');
  });

  it('should start development', () => {
    const record = service.createRecord({
      name: 'Development Concept',
      category: 'development',
      owner: 'AVOS Media',
    });

    expect(
      service.startDevelopment(record.id).status,
    ).toBe('developing');
  });

  it('should approve by human', () => {
    const record = service.createRecord({
      name: 'Approved Concept',
      category: 'concept',
      owner: 'AVOS Media',
    });

    const approved =
      service.approveByHuman(record.id);

    expect(approved.status).toBe('approved');
    expect(approved.humanApproved).toBe(true);
  });

  it('should reject by human', () => {
    const record = service.createRecord({
      name: 'Rejected Concept',
      category: 'concept',
      owner: 'AVOS Media',
    });

    const rejected =
      service.rejectByHuman(record.id);

    expect(rejected.status).toBe('rejected');
    expect(rejected.humanApproved).toBe(false);
  });

  it('should add research source', () => {
    const record = service.createRecord({
      name: 'Research Sources',
      category: 'research',
      owner: 'AVOS Media',
    });

    const updated = service.addSource(
      record.id,
      'Audience interview',
    );

    expect(updated.sources).toContain(
      'Audience interview',
    );
  });

  it('should add trend', () => {
    const record = service.createRecord({
      name: 'Trend Concept',
      category: 'trend',
      owner: 'AVOS Media',
    });

    const updated = service.addTrend(
      record.id,
      'Interactive storytelling',
    );

    expect(updated.trends).toContain(
      'interactive storytelling',
    );
  });

  it('should add opportunity', () => {
    const record = service.createRecord({
      name: 'Opportunity Concept',
      category: 'opportunity',
      owner: 'AVOS Media',
    });

    const updated = service.addOpportunity(
      record.id,
      'Arabic educational franchise',
    );

    expect(updated.opportunities).toContain(
      'Arabic educational franchise',
    );
  });

  it('should add story element', () => {
    const record = service.createRecord({
      name: 'Story Concept',
      category: 'story',
      owner: 'AVOS Media',
    });

    const updated = service.addStoryElement(
      record.id,
      'Unexpected discovery',
    );

    expect(updated.storyElements).toContain(
      'Unexpected discovery',
    );
  });

  it('should evaluate idea', () => {
    const record = service.createRecord({
      name: 'Strong Idea',
      category: 'idea',
      owner: 'AVOS Media',
      originalityScore: 90,
      audienceFitScore: 90,
      culturalFitScore: 90,
      platformFitScore: 90,
      viralityScore: 90,
      franchisePotentialScore: 90,
      monetizationPotentialScore: 90,
      confidenceScore: 90,
    });

    const evaluation =
      service.evaluateIdea(record.id);

    expect(evaluation.score).toBe(90);
    expect(evaluation.recommendation).toBe(
      'develop-immediately',
    );
  });

  it('should generate research brief', () => {
    const record = service.createRecord({
      name: 'Research Brief',
      category: 'research',
      owner: 'AVOS Media',
    });

    const brief =
      service.generateResearchBrief(record.id);

    expect(
      brief.researchQuestions,
    ).toHaveLength(8);
  });

  it('should generate concept blueprint', () => {
    const record = service.createRecord({
      name: 'Concept Blueprint',
      category: 'concept',
      owner: 'AVOS Media',
    });

    const blueprint =
      service.generateConceptBlueprint(
        record.id,
      );

    expect(
      blueprint.developmentStages,
    ).toHaveLength(9);
  });

  it('should generate story architecture', () => {
    const record = service.createRecord({
      name: 'Story Architecture',
      category: 'story',
      owner: 'AVOS Media',
    });

    const story =
      service.generateStoryArchitecture(
        record.id,
      );

    expect(
      story.storyArchitecture.opening,
    ).toBeDefined();
  });

  it('should generate audience profile', () => {
    const record = service.createRecord({
      name: 'Audience Profile',
      category: 'audience',
      owner: 'AVOS Media',
    });

    const profile =
      service.generateAudienceProfile(
        record.id,
      );

    expect(
      profile.profileDimensions,
    ).toHaveLength(9);
  });

  it('should generate format system', () => {
    const record = service.createRecord({
      name: 'Format System',
      category: 'format',
      owner: 'AVOS Media',
    });

    const format =
      service.generateFormatSystem(record.id);

    expect(
      format.repeatableStructure,
    ).toHaveLength(5);

    expect(format.scalability.seasons).toBe(
      true,
    );
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete Concept',
      category: 'concept',
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
