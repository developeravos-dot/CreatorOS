import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ProtectabilityAnalysisStageController,
} from './protectability-analysis-stage.controller';

import {
  ProtectabilityAnalysisStageService,
} from './protectability-analysis-stage.service';

describe('ProtectabilityAnalysisStageController', () => {
  let controller: ProtectabilityAnalysisStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ProtectabilityAnalysisStageController,
        ],
        providers: [
          ProtectabilityAnalysisStageService,
        ],
      }).compile();

    controller =
      module.get<ProtectabilityAnalysisStageController>(
        ProtectabilityAnalysisStageController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });

  it('should expose 24-stage blueprint', () => {
    expect(
      controller.getBlueprint().stages,
    ).toHaveLength(24);
  });
});
