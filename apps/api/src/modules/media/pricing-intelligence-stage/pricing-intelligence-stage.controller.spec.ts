import { Test, TestingModule } from '@nestjs/testing';
import { PricingIntelligenceStageController } from './pricing-intelligence-stage.controller';
import { PricingIntelligenceStageService } from './pricing-intelligence-stage.service';

describe('PricingIntelligenceStageController', () => {
  let controller: PricingIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [PricingIntelligenceStageController], providers: [PricingIntelligenceStageService] }).compile();
    controller = module.get<PricingIntelligenceStageController>(PricingIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
