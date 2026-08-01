import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  GovernanceApprovalStageController,
} from './governance-approval-stage.controller';

import {
  GovernanceApprovalStageService,
} from './governance-approval-stage.service';

describe('GovernanceApprovalStageController', () => {
  let controller: GovernanceApprovalStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          GovernanceApprovalStageController,
        ],
        providers: [
          GovernanceApprovalStageService,
        ],
      }).compile();

    controller =
      module.get<GovernanceApprovalStageController>(
        GovernanceApprovalStageController,
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
