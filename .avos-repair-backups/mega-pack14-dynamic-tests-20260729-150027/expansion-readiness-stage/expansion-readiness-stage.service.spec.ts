import {
  BadRequestException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ExpansionReadinessStageService,
} from './expansion-readiness-stage.service';

describe('ExpansionReadinessStageService', () => {
  let service: ExpansionReadinessStageService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [ExpansionReadinessStageService],
      }).compile();

    service =
      module.get<ExpansionReadinessStageService>(
        ExpansionReadinessStageService,
      );
  });

  it('should be operational', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe('operational');
    expect(dashboard.totalStages).toBe(15);
    expect(
      dashboard.humanFinalAuthority,
    ).toBe(true);
  });

  it('should expose fifteen-stage blueprint', () => {
    expect(
      service.getBlueprint().stages,
    ).toHaveLength(15);
  });

  it('should create expansion project', () => {
    const project = service.createProject({
      name: 'AVOS Global Expansion',
      owner: 'AVOS Media',
      sourceCountry: 'UAE',
      sourceLanguage: 'ar',
      targetRegions: [
        'middle-east',
        'europe',
      ],
    });

    expect(project.stages).toHaveLength(15);
    expect(project.currentStage).toBe(
      'expansion-readiness',
    );
  });

  it('should require approval before autonomous expansion', () => {
    const project = service.createProject({
      name: 'Autonomous Expansion',
      owner: 'AVOS Media',
      autonomousExecutionEnabled: true,
    });

    expect(() =>
      service.startExpansion(project.id),
    ).toThrow(BadRequestException);
  });

  it('should start approved expansion', () => {
    const project = service.createProject({
      name: 'Approved Expansion',
      owner: 'AVOS Media',
      autonomousExecutionEnabled: true,
    });

    service.approveAutonomousExecution(
      project.id,
      'Human Final Authority',
    );

    expect(
      service.startExpansion(project.id).status,
    ).toBe('running');
  });

  it('should add and rank markets', () => {
    const project = service.createProject({
      name: 'Market Intelligence',
      owner: 'AVOS Media',
    });

    service.addMarket(project.id, {
      country: 'Germany',
      region: 'Europe',
      language: 'de',
      demandScore: 90,
      revenuePotentialScore: 90,
      culturalFitScore: 80,
      localizationReadinessScore: 85,
    });

    service.addMarket(project.id, {
      country: 'France',
      region: 'Europe',
      language: 'fr',
      demandScore: 75,
      revenuePotentialScore: 80,
      culturalFitScore: 75,
      localizationReadinessScore: 80,
    });

    expect(
      service.getRankedMarkets(project.id),
    ).toHaveLength(2);
  });

  it('should add partner', () => {
    const project = service.createProject({
      name: 'Partner Network',
      owner: 'AVOS Media',
    });

    const updated = service.addPartner(
      project.id,
      {
        name: 'Regional Creator',
        type: 'creator',
        country: 'Germany',
        audienceReach: 1000000,
        trustScore: 90,
      },
    );

    expect(updated.partners).toHaveLength(1);
  });

  it('should calculate reinvestment', () => {
    const project = service.createProject({
      name: 'Reinvestment',
      owner: 'AVOS Media',
      totalRevenue: 1000,
      totalCost: 500,
    });

    const updated =
      service.calculateReinvestment(
        project.id,
        40,
      );

    expect(
      updated.reinvestmentAmount,
    ).toBe(200);
  });

  it('should generate market entry plan', () => {
    const project = service.createProject({
      name: 'Market Entry',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateMarketEntryPlan(
        project.id,
      );

    expect(plan.entryStages).toHaveLength(7);
    expect(plan.humanFinalAuthority).toBe(
      true,
    );
  });

  it('should generate global expansion report', () => {
    const project = service.createProject({
      name: 'Expansion Report',
      owner: 'AVOS Media',
    });

    const report =
      service.generateGlobalExpansionReport(
        project.id,
      );

    expect(report.totalStages).toBe(15);
    expect(report.humanFinalAuthority).toBe(
      true,
    );
  });
});
