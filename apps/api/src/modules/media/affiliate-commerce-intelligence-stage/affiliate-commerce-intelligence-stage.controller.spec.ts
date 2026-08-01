import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateCommerceIntelligenceStageController } from './affiliate-commerce-intelligence-stage.controller';
import { AffiliateCommerceIntelligenceStageService } from './affiliate-commerce-intelligence-stage.service';

describe('AffiliateCommerceIntelligenceStageController', () => {
  let controller: AffiliateCommerceIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AffiliateCommerceIntelligenceStageController], providers: [AffiliateCommerceIntelligenceStageService] }).compile();
    controller = module.get<AffiliateCommerceIntelligenceStageController>(AffiliateCommerceIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
