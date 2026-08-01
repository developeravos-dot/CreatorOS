import { Test, TestingModule } from '@nestjs/testing';
import { CrossPromotionIntelligenceStageController } from './cross-promotion-intelligence-stage.controller';
import { CrossPromotionIntelligenceStageService } from './cross-promotion-intelligence-stage.service';

describe('CrossPromotionIntelligenceStageController', () => {
  let controller: CrossPromotionIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CrossPromotionIntelligenceStageController], providers: [CrossPromotionIntelligenceStageService] }).compile();
    controller = module.get(CrossPromotionIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
