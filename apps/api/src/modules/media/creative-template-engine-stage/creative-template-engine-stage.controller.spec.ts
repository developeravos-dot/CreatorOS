import { Test, TestingModule } from '@nestjs/testing';
import { CreativeTemplateEngineStageController } from './creative-template-engine-stage.controller';
import { CreativeTemplateEngineStageService } from './creative-template-engine-stage.service';

describe('CreativeTemplateEngineStageController', () => {
  let controller: CreativeTemplateEngineStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CreativeTemplateEngineStageController], providers: [CreativeTemplateEngineStageService] }).compile();
    controller = module.get(CreativeTemplateEngineStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
