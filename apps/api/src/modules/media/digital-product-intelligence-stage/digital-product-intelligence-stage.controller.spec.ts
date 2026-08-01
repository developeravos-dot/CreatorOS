import { Test, TestingModule } from '@nestjs/testing';
import { DigitalProductIntelligenceStageController } from './digital-product-intelligence-stage.controller';
import { DigitalProductIntelligenceStageService } from './digital-product-intelligence-stage.service';

describe('DigitalProductIntelligenceStageController', () => {
  let controller: DigitalProductIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [DigitalProductIntelligenceStageController], providers: [DigitalProductIntelligenceStageService] }).compile();
    controller = module.get<DigitalProductIntelligenceStageController>(DigitalProductIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
