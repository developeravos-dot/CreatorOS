import { Test, TestingModule } from '@nestjs/testing';
import { CreativeLearningStageController } from './creative-learning-stage.controller';
import { CreativeLearningStageService } from './creative-learning-stage.service';

describe('CreativeLearningStageController', () => {
  let controller: CreativeLearningStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CreativeLearningStageController], providers: [CreativeLearningStageService] }).compile();
    controller = module.get(CreativeLearningStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
