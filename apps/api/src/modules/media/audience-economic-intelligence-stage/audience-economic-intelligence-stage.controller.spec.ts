import { Test, TestingModule } from '@nestjs/testing';
import { AudienceEconomicIntelligenceStageController } from './audience-economic-intelligence-stage.controller';
import { AudienceEconomicIntelligenceStageService } from './audience-economic-intelligence-stage.service';

describe('AudienceEconomicIntelligenceStageController', () => {
  let controller: AudienceEconomicIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AudienceEconomicIntelligenceStageController], providers: [AudienceEconomicIntelligenceStageService] }).compile();
    controller = module.get<AudienceEconomicIntelligenceStageController>(AudienceEconomicIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
