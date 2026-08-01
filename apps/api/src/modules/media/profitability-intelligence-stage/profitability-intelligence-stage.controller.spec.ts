import { Test, TestingModule } from '@nestjs/testing';
import { ProfitabilityIntelligenceStageController } from './profitability-intelligence-stage.controller';
import { ProfitabilityIntelligenceStageService } from './profitability-intelligence-stage.service';

describe('ProfitabilityIntelligenceStageController', () => {
  let controller: ProfitabilityIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ProfitabilityIntelligenceStageController], providers: [ProfitabilityIntelligenceStageService] }).compile();
    controller = module.get<ProfitabilityIntelligenceStageController>(ProfitabilityIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
