import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MarketSelectionStageController,
} from './market-selection-stage.controller';

import {
  MarketSelectionStageService,
} from './market-selection-stage.service';

describe('MarketSelectionStageController', () => {
  let controller: MarketSelectionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MarketSelectionStageController,
        ],
        providers: [
          MarketSelectionStageService,
        ],
      }).compile();

    controller =
      module.get<MarketSelectionStageController>(
        MarketSelectionStageController,
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
