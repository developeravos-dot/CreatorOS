import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentInvestmentEngineController,
} from './content-investment-engine.controller';

import {
  ContentInvestmentEngineService,
} from './content-investment-engine.service';

describe('ContentInvestmentEngineController', () => {
  let controller: ContentInvestmentEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ContentInvestmentEngineController],
        providers: [ContentInvestmentEngineService],
      }).compile();

    controller =
      module.get<ContentInvestmentEngineController>(
        ContentInvestmentEngineController,
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
