import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LicensingManagementStageController,
} from './licensing-management-stage.controller';

import {
  LicensingManagementStageService,
} from './licensing-management-stage.service';

describe('LicensingManagementStageController', () => {
  let controller: LicensingManagementStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          LicensingManagementStageController,
        ],
        providers: [
          LicensingManagementStageService,
        ],
      }).compile();

    controller =
      module.get<LicensingManagementStageController>(
        LicensingManagementStageController,
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
