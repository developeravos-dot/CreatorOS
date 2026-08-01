import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CopyrightManagementStageController,
} from './copyright-management-stage.controller';

import {
  CopyrightManagementStageService,
} from './copyright-management-stage.service';

describe('CopyrightManagementStageController', () => {
  let controller: CopyrightManagementStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          CopyrightManagementStageController,
        ],
        providers: [
          CopyrightManagementStageService,
        ],
      }).compile();

    controller =
      module.get<CopyrightManagementStageController>(
        CopyrightManagementStageController,
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
