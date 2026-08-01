import { Test, TestingModule } from '@nestjs/testing';
import { MultiplatformAdaptationStageController } from './multiplatform-adaptation-stage.controller';
import { MultiplatformAdaptationStageService } from './multiplatform-adaptation-stage.service';

describe('MultiplatformAdaptationStageController', () => {
  let controller: MultiplatformAdaptationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [MultiplatformAdaptationStageController], providers: [MultiplatformAdaptationStageService] }).compile();
    controller = module.get(MultiplatformAdaptationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
