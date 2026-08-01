import { Test, TestingModule } from '@nestjs/testing';
import { RiskReturnIntelligenceStageController } from './risk-return-intelligence-stage.controller';
import { RiskReturnIntelligenceStageService } from './risk-return-intelligence-stage.service';

describe('RiskReturnIntelligenceStageController', () => {
  let controller: RiskReturnIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [RiskReturnIntelligenceStageController], providers: [RiskReturnIntelligenceStageService] }).compile();
    controller = module.get<RiskReturnIntelligenceStageController>(RiskReturnIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
