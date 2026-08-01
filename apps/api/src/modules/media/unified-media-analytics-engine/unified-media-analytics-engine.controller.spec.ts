import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  UnifiedMediaAnalyticsEngineController,
} from './unified-media-analytics-engine.controller';

import {
  UnifiedMediaAnalyticsEngineService,
} from './unified-media-analytics-engine.service';

describe('UnifiedMediaAnalyticsEngineController', () => {
  let controller: UnifiedMediaAnalyticsEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          UnifiedMediaAnalyticsEngineController,
        ],
        providers: [
          UnifiedMediaAnalyticsEngineService,
        ],
      }).compile();

    controller =
      module.get<UnifiedMediaAnalyticsEngineController>(
        UnifiedMediaAnalyticsEngineController,
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
