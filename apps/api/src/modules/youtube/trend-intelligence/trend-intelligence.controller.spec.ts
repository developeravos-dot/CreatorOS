import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  TrendIntelligenceController,
} from './trend-intelligence.controller';

import {
  TrendIntelligenceService,
} from './trend-intelligence.service';

describe('TrendIntelligenceController', () => {
  let controller: TrendIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [TrendIntelligenceController],
        providers: [TrendIntelligenceService],
      }).compile();

    controller =
      module.get<TrendIntelligenceController>(
        TrendIntelligenceController,
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
