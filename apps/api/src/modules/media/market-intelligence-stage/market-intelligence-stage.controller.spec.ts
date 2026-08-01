import { Test } from '@nestjs/testing';
import { MarketIntelligenceStageController } from './market-intelligence-stage.controller';
import { MarketIntelligenceStageService } from './market-intelligence-stage.service';

describe('MarketIntelligenceStageController', () => {
  let controller: MarketIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MarketIntelligenceStageController],
      providers: [MarketIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(MarketIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
