import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RightsOwnershipManagementStageController,
} from './rights-ownership-management-stage.controller';

import {
  RightsOwnershipManagementStageService,
} from './rights-ownership-management-stage.service';

describe('RightsOwnershipManagementStageController', () => {
  let controller: RightsOwnershipManagementStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          RightsOwnershipManagementStageController,
        ],
        providers: [
          RightsOwnershipManagementStageService,
        ],
      }).compile();

    controller =
      module.get<RightsOwnershipManagementStageController>(
        RightsOwnershipManagementStageController,
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
