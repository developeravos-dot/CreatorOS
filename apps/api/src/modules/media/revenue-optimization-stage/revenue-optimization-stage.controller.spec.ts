import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RevenueOptimizationStageController,
} from './revenue-optimization-stage.controller';

import {
  RevenueOptimizationStageService,
} from './revenue-optimization-stage.service';

describe('RevenueOptimizationStageController', () => {
  let controller: RevenueOptimizationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          RevenueOptimizationStageController,
        ],
        providers: [
          RevenueOptimizationStageService,
        ],
      }).compile();

    controller =
      module.get<RevenueOptimizationStageController>(
        RevenueOptimizationStageController,
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
