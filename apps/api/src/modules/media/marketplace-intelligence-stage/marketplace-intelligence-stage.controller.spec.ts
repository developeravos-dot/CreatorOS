import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceIntelligenceStageController } from './marketplace-intelligence-stage.controller';
import { MarketplaceIntelligenceStageService } from './marketplace-intelligence-stage.service';

describe('MarketplaceIntelligenceStageController', () => {
  let controller: MarketplaceIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [MarketplaceIntelligenceStageController], providers: [MarketplaceIntelligenceStageService] }).compile();
    controller = module.get<MarketplaceIntelligenceStageController>(MarketplaceIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
