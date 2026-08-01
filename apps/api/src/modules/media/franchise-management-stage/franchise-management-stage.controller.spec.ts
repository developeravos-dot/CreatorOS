import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  FranchiseManagementStageController,
} from './franchise-management-stage.controller';

import {
  FranchiseManagementStageService,
} from './franchise-management-stage.service';

describe('FranchiseManagementStageController', () => {
  let controller: FranchiseManagementStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          FranchiseManagementStageController,
        ],
        providers: [
          FranchiseManagementStageService,
        ],
      }).compile();

    controller =
      module.get<FranchiseManagementStageController>(
        FranchiseManagementStageController,
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
