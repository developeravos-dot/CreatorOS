import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  TrendOpportunityRadarEngineController,
} from './trend-opportunity-radar-engine.controller';

import {
  TrendOpportunityRadarEngineService,
} from './trend-opportunity-radar-engine.service';

describe('TrendOpportunityRadarEngineController', () => {
  let controller: TrendOpportunityRadarEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          TrendOpportunityRadarEngineController,
        ],
        providers: [
          TrendOpportunityRadarEngineService,
        ],
      }).compile();

    controller =
      module.get<TrendOpportunityRadarEngineController>(
        TrendOpportunityRadarEngineController,
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
