import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  GlobalRiskGovernanceStageController,
} from './global-risk-governance-stage.controller';

import {
  GlobalRiskGovernanceStageService,
} from './global-risk-governance-stage.service';

describe('GlobalRiskGovernanceStageController', () => {
  let controller: GlobalRiskGovernanceStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          GlobalRiskGovernanceStageController,
        ],
        providers: [
          GlobalRiskGovernanceStageService,
        ],
      }).compile();

    controller =
      module.get<GlobalRiskGovernanceStageController>(
        GlobalRiskGovernanceStageController,
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
});
