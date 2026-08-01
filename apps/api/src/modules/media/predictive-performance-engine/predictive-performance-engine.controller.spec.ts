import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PredictivePerformanceEngineController,
} from './predictive-performance-engine.controller';

import {
  PredictivePerformanceEngineService,
} from './predictive-performance-engine.service';

describe('PredictivePerformanceEngineController', () => {
  let controller: PredictivePerformanceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          PredictivePerformanceEngineController,
        ],
        providers: [
          PredictivePerformanceEngineService,
        ],
      }).compile();

    controller =
      module.get<PredictivePerformanceEngineController>(
        PredictivePerformanceEngineController,
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
