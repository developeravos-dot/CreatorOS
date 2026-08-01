import { Test, TestingModule } from '@nestjs/testing';
import { ContentIntelligenceStageController } from './content-intelligence-stage.controller';
import { ContentIntelligenceStageService } from './content-intelligence-stage.service';

describe('ContentIntelligenceStageController', () => {
  let controller: ContentIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ContentIntelligenceStageController], providers: [ContentIntelligenceStageService] }).compile();
    controller = module.get(ContentIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
