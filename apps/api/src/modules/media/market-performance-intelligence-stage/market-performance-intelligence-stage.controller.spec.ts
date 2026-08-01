import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MarketPerformanceIntelligenceStageController,
} from './market-performance-intelligence-stage.controller';

import {
  MarketPerformanceIntelligenceStageService,
} from './market-performance-intelligence-stage.service';

describe('MarketPerformanceIntelligenceStageController', () => {
  let controller: MarketPerformanceIntelligenceStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MarketPerformanceIntelligenceStageController,
        ],
        providers: [
          MarketPerformanceIntelligenceStageService,
        ],
      }).compile();

    controller =
      module.get<MarketPerformanceIntelligenceStageController>(
        MarketPerformanceIntelligenceStageController,
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
