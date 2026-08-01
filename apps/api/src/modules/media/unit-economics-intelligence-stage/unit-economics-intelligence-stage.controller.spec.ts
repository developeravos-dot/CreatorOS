import { Test, TestingModule } from '@nestjs/testing';
import { UnitEconomicsIntelligenceStageController } from './unit-economics-intelligence-stage.controller';
import { UnitEconomicsIntelligenceStageService } from './unit-economics-intelligence-stage.service';

describe('UnitEconomicsIntelligenceStageController', () => {
  let controller: UnitEconomicsIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [UnitEconomicsIntelligenceStageController], providers: [UnitEconomicsIntelligenceStageService] }).compile();
    controller = module.get<UnitEconomicsIntelligenceStageController>(UnitEconomicsIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
