import { Test, TestingModule } from '@nestjs/testing';
import { MerchandiseCommerceIntelligenceStageController } from './merchandise-commerce-intelligence-stage.controller';
import { MerchandiseCommerceIntelligenceStageService } from './merchandise-commerce-intelligence-stage.service';

describe('MerchandiseCommerceIntelligenceStageController', () => {
  let controller: MerchandiseCommerceIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [MerchandiseCommerceIntelligenceStageController], providers: [MerchandiseCommerceIntelligenceStageService] }).compile();
    controller = module.get<MerchandiseCommerceIntelligenceStageController>(MerchandiseCommerceIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
