import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PatentManagementStageController,
} from './patent-management-stage.controller';

import {
  PatentManagementStageService,
} from './patent-management-stage.service';

describe('PatentManagementStageController', () => {
  let controller: PatentManagementStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          PatentManagementStageController,
        ],
        providers: [
          PatentManagementStageService,
        ],
      }).compile();

    controller =
      module.get<PatentManagementStageController>(
        PatentManagementStageController,
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
