import { Test, TestingModule } from '@nestjs/testing';
import { BusinessModelIntelligenceStageController } from './business-model-intelligence-stage.controller';
import { BusinessModelIntelligenceStageService } from './business-model-intelligence-stage.service';

describe('BusinessModelIntelligenceStageController', () => {
  let controller: BusinessModelIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [BusinessModelIntelligenceStageController], providers: [BusinessModelIntelligenceStageService] }).compile();
    controller = module.get<BusinessModelIntelligenceStageController>(BusinessModelIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
