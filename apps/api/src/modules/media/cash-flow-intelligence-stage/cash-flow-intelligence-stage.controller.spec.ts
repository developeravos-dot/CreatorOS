import { Test, TestingModule } from '@nestjs/testing';
import { CashFlowIntelligenceStageController } from './cash-flow-intelligence-stage.controller';
import { CashFlowIntelligenceStageService } from './cash-flow-intelligence-stage.service';

describe('CashFlowIntelligenceStageController', () => {
  let controller: CashFlowIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CashFlowIntelligenceStageController], providers: [CashFlowIntelligenceStageService] }).compile();
    controller = module.get<CashFlowIntelligenceStageController>(CashFlowIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
