import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MarketExpansionEngineController,
} from './market-expansion-engine.controller';

import {
  MarketExpansionEngineService,
} from './market-expansion-engine.service';

describe('MarketExpansionEngineController', () => {
  let controller: MarketExpansionEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [MarketExpansionEngineController],
        providers: [MarketExpansionEngineService],
      }).compile();

    controller =
      module.get<MarketExpansionEngineController>(
        MarketExpansionEngineController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
