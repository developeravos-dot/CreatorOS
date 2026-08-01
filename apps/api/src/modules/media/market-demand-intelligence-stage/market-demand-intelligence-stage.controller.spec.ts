import { Test, TestingModule } from '@nestjs/testing';
import { MarketDemandIntelligenceStageController } from './market-demand-intelligence-stage.controller';
import { MarketDemandIntelligenceStageService } from './market-demand-intelligence-stage.service';

describe('MarketDemandIntelligenceStageController', () => {
  let controller: MarketDemandIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [MarketDemandIntelligenceStageController], providers: [MarketDemandIntelligenceStageService] }).compile();
    controller = module.get<MarketDemandIntelligenceStageController>(MarketDemandIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
