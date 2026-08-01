import {
  BadRequestException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  OpportunityDiscoveryStageService,
} from './opportunity-discovery-stage.service';

describe('OpportunityDiscoveryStageService', () => {
  let service: OpportunityDiscoveryStageService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [OpportunityDiscoveryStageService],
      }).compile();

    service =
      module.get<OpportunityDiscoveryStageService>(
        OpportunityDiscoveryStageService,
      );
  });

  it('should be operational', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe('operational');
    expect(dashboard.totalStages).toBe(12);
    expect(
      dashboard.humanFinalAuthority,
    ).toBe(true);
  });

  it('should expose twelve-stage blueprint', () => {
    const blueprint =
      service.getLifecycleBlueprint();

    expect(blueprint.stages).toHaveLength(12);
  });

  it('should create complete lifecycle project', () => {
    const project = service.createProject({
      name: 'AVOS Media Project',
      owner: 'AVOS Media',
      platform: 'YouTube',
      region: 'UAE',
    });

    expect(project.stageExecutions).toHaveLength(
      12,
    );

    expect(project.currentStage).toBe(
      'opportunity-discovery',
    );
  });

  it('should reject empty project name', () => {
    expect(() =>
      service.createProject({
        name: '',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should require approval for autonomy', () => {
    const project = service.createProject({
      name: 'Autonomous Project',
      owner: 'AVOS Media',
      autonomousExecutionEnabled: true,
    });

    expect(() =>
      service.startLifecycle(project.id),
    ).toThrow(BadRequestException);
  });

  it('should start approved autonomous lifecycle', () => {
    const project = service.createProject({
      name: 'Approved Autonomous Project',
      owner: 'AVOS Media',
      autonomousExecutionEnabled: true,
    });

    service.approveAutonomousExecution(
      project.id,
      'Human Final Authority',
    );

    const started =
      service.startLifecycle(project.id);

    expect(started.status).toBe('running');
  });

  it('should add lifecycle learning', () => {
    const project = service.createProject({
      name: 'Learning Project',
      owner: 'AVOS Media',
    });

    const updated = service.addLearning(
      project.id,
      'Higher retention with shorter introductions',
    );

    expect(updated.lessons).toHaveLength(1);
  });

  it('should generate lifecycle report', () => {
    const project = service.createProject({
      name: 'Lifecycle Report',
      owner: 'AVOS Media',
    });

    const report =
      service.generateLifecycleReport(
        project.id,
      );

    expect(report.totalStages).toBe(12);
    expect(report.humanFinalAuthority).toBe(
      true,
    );
  });

  it('should generate next best action', () => {
    const project = service.createProject({
      name: 'Next Action',
      owner: 'AVOS Media',
    });

    const result =
      service.generateNextBestAction(
        project.id,
      );

    expect(result.nextBestAction).toBeDefined();
  });
});
