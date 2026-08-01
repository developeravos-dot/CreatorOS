import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  TrademarkManagementStageController,
} from './trademark-management-stage.controller';

import {
  TrademarkManagementStageService,
} from './trademark-management-stage.service';

describe('TrademarkManagementStageController', () => {
  let controller: TrademarkManagementStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          TrademarkManagementStageController,
        ],
        providers: [
          TrademarkManagementStageService,
        ],
      }).compile();

    controller =
      module.get<TrademarkManagementStageController>(
        TrademarkManagementStageController,
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
