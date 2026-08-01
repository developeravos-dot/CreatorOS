import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  GrowthOptimizationStageController,
} from './growth-optimization-stage.controller';

import {
  GrowthOptimizationStageService,
} from './growth-optimization-stage.service';

describe('GrowthOptimizationStageController', () => {
  let controller: GrowthOptimizationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          GrowthOptimizationStageController,
        ],
        providers: [
          GrowthOptimizationStageService,
        ],
      }).compile();

    controller =
      module.get<GrowthOptimizationStageController>(
        GrowthOptimizationStageController,
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
