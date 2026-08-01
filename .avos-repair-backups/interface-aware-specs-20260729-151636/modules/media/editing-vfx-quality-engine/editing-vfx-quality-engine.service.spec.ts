import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  EditingVfxQualityEngineService,
} from './editing-vfx-quality-engine.service';

describe('EditingVfxQualityEngineService', () => {
  let service: EditingVfxQualityEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [EditingVfxQualityEngineService],
      }).compile();

    service =
      module.get<EditingVfxQualityEngineService>(
        EditingVfxQualityEngineService,
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

  it('should create production record', () => {
    const record = service.createRecord({
      name: 'AVOS Original Episode',
      category: 'original-production',
      owner: 'AVOS Media',
      type: 'full-production',
      platform: 'YouTube',
      language: 'Arabic',
      resolution: '4K',
      frameRate: 30,
      tags: ['AVOS', 'Production'],
    });

    expect(record.id).toBeDefined();
    expect(record.platform).toBe('youtube');
    expect(record.language).toBe('arabic');
    expect(record.resolution).toBe('4k');
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'production',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Production',
        category: 'production',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update production record', () => {
    const record = service.createRecord({
      name: 'Update Production',
      category: 'production',
      owner: 'AVOS Media',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'critical',
        visualScore: 94,
      },
    );

    expect(updated.priority).toBe(
      'critical',
    );

    expect(updated.visualScore).toBe(94);
  });

  it('should start pre-production', () => {
    const record = service.createRecord({
      name: 'Pre Production',
      category: 'production',
      owner: 'AVOS Media',
    });

    expect(
      service.startPreProduction(record.id)
        .status,
    ).toBe('pre-production');
  });

  it('should start script development', () => {
    const record = service.createRecord({
      name: 'Script Development',
      category: 'script',
      owner: 'AVOS Media',
    });

    expect(
      service.startScriptDevelopment(
        record.id,
      ).status,
    ).toBe('script-development');
  });

  it('should start storyboarding', () => {
    const record = service.createRecord({
      name: 'Storyboard',
      category: 'storyboard',
      owner: 'AVOS Media',
    });

    expect(
      service.startStoryboarding(record.id)
        .status,
    ).toBe('storyboarding');
  });

  it('should add scene', () => {
    const record = service.createRecord({
      name: 'Scene Production',
      category: 'production',
      owner: 'AVOS Media',
    });

    const updated = service.addScene(
      record.id,
      {
        title: 'Opening Scene',
        durationSeconds: 15,
        visualPrompt:
          'Cinematic city opening',
      },
    );

    expect(updated.scenes).toHaveLength(1);
    expect(updated.scenes[0]!.order).toBe(1);
  });

  it('should update scene', () => {
    const record = service.createRecord({
      name: 'Update Scene',
      category: 'production',
      owner: 'AVOS Media',
    });

    const withScene = service.addScene(
      record.id,
      {
        title: 'Scene One',
        durationSeconds: 10,
      },
    );

    const updated = service.updateScene(
      record.id,
      withScene.scenes[0]!.id,
      {
        title: 'Updated Scene',
      },
    );

    expect(updated.scenes[0]!.title).toBe(
      'Updated Scene',
    );
  });

  it('should remove scene', () => {
    const record = service.createRecord({
      name: 'Remove Scene',
      category: 'production',
      owner: 'AVOS Media',
    });

    const withScene = service.addScene(
      record.id,
      {
        title: 'Temporary Scene',
      },
    );

    const updated = service.removeScene(
      record.id,
      withScene.scenes[0]!.id,
    );

    expect(updated.scenes).toHaveLength(0);
  });

  it('should add visual asset', () => {
    const record = service.createRecord({
      name: 'Visual Assets',
      category: 'production',
      owner: 'AVOS Media',
    });

    const updated = service.addAsset(
      record.id,
      'visual',
      'Opening Shot',
    );

    expect(updated.visualAssets).toContain(
      'Opening Shot',
    );
  });

  it('should add issue', () => {
    const record = service.createRecord({
      name: 'Production Issue',
      category: 'production',
      owner: 'AVOS Media',
    });

    const updated = service.addIssue(
      record.id,
      'Character continuity mismatch',
    );

    expect(updated.issues).toContain(
      'Character continuity mismatch',
    );
  });

  it('should require human approval before rendering', () => {
    const record = service.createRecord({
      name: 'Protected Rendering',
      category: 'production',
      owner: 'AVOS Media',
    });

    expect(() =>
      service.startRendering(record.id),
    ).toThrow(BadRequestException);
  });

  it('should render after human approval', () => {
    const record = service.createRecord({
      name: 'Approved Rendering',
      category: 'production',
      owner: 'AVOS Media',
    });

    service.approveByHuman(record.id);

    expect(
      service.startRendering(record.id).status,
    ).toBe('rendering');
  });

  it('should generate script blueprint', () => {
    const record = service.createRecord({
      name: 'Script Blueprint',
      category: 'script',
      owner: 'AVOS Media',
    });

    const blueprint =
      service.generateScriptBlueprint(
        record.id,
      );

    expect(blueprint.structure).toHaveLength(
      9,
    );
  });

  it('should generate storyboard blueprint', () => {
    const record = service.createRecord({
      name: 'Storyboard Blueprint',
      category: 'storyboard',
      owner: 'AVOS Media',
    });

    service.addScene(record.id, {
      title: 'Scene One',
      durationSeconds: 15,
    });

    const blueprint =
      service.generateStoryboardBlueprint(
        record.id,
      );

    expect(blueprint.scenes).toHaveLength(1);
  });

  it('should generate visual production plan', () => {
    const record = service.createRecord({
      name: 'Visual Plan',
      category: 'visual',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateVisualProductionPlan(
        record.id,
      );

    expect(plan.requirements).toHaveLength(7);
  });

  it('should generate audio production plan', () => {
    const record = service.createRecord({
      name: 'Audio Plan',
      category: 'audio',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateAudioProductionPlan(
        record.id,
      );

    expect(plan.stages).toHaveLength(8);
  });

  it('should generate editing plan', () => {
    const record = service.createRecord({
      name: 'Editing Plan',
      category: 'editing',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateEditingPlan(record.id);

    expect(plan.stages).toHaveLength(10);
  });

  it('should run quality assessment', () => {
    const record = service.createRecord({
      name: 'Quality Assessment',
      category: 'quality',
      owner: 'AVOS Media',
      scriptScore: 90,
      visualScore: 90,
      audioScore: 90,
      continuityScore: 90,
      originalityScore: 90,
      audienceFitScore: 90,
      technicalQualityScore: 90,
    });

    const result =
      service.runQualityAssessment(record.id);

    expect(result.score).toBe(90);
    expect(result.recommendation).toBe(
      'approve-for-human-review',
    );
  });

  it('should calculate production timeline', () => {
    const record = service.createRecord({
      name: 'Timeline',
      category: 'production',
      owner: 'AVOS Media',
      targetDurationSeconds: 60,
    });

    service.addScene(record.id, {
      title: 'Scene One',
      durationSeconds: 20,
    });

    service.addScene(record.id, {
      title: 'Scene Two',
      durationSeconds: 40,
    });

    const timeline =
      service.getProductionTimeline(record.id);

    expect(
      timeline.sceneDurationSeconds,
    ).toBe(60);

    expect(
      timeline.durationVarianceSeconds,
    ).toBe(0);
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete Production',
      category: 'production',
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

