import { Test, TestingModule } from '@nestjs/testing';
import { CharacterIntelligenceStageController } from './character-intelligence-stage.controller';
import { CharacterIntelligenceStageService } from './character-intelligence-stage.service';

describe('CharacterIntelligenceStageController', () => {
  let controller: CharacterIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CharacterIntelligenceStageController], providers: [CharacterIntelligenceStageService] }).compile();
    controller = module.get(CharacterIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
