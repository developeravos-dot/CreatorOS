import { Test, TestingModule } from '@nestjs/testing';
import { MulticulturalAdaptationStageController } from './multicultural-adaptation-stage.controller';
import { MulticulturalAdaptationStageService } from './multicultural-adaptation-stage.service';

describe('MulticulturalAdaptationStageController', () => {
  let controller: MulticulturalAdaptationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [MulticulturalAdaptationStageController], providers: [MulticulturalAdaptationStageService] }).compile();
    controller = module.get(MulticulturalAdaptationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
