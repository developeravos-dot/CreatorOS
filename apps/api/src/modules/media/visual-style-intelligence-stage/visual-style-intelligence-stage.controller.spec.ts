import { Test, TestingModule } from '@nestjs/testing';
import { VisualStyleIntelligenceStageController } from './visual-style-intelligence-stage.controller';
import { VisualStyleIntelligenceStageService } from './visual-style-intelligence-stage.service';

describe('VisualStyleIntelligenceStageController', () => {
  let controller: VisualStyleIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [VisualStyleIntelligenceStageController], providers: [VisualStyleIntelligenceStageService] }).compile();
    controller = module.get(VisualStyleIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
