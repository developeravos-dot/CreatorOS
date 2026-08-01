import { Test, TestingModule } from '@nestjs/testing';
import { PremiumContentIntelligenceStageController } from './premium-content-intelligence-stage.controller';
import { PremiumContentIntelligenceStageService } from './premium-content-intelligence-stage.service';

describe('PremiumContentIntelligenceStageController', () => {
  let controller: PremiumContentIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [PremiumContentIntelligenceStageController], providers: [PremiumContentIntelligenceStageService] }).compile();
    controller = module.get<PremiumContentIntelligenceStageController>(PremiumContentIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
