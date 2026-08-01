import { Test, TestingModule } from '@nestjs/testing';
import { MultilingualCreativeAdaptationStageController } from './multilingual-creative-adaptation-stage.controller';
import { MultilingualCreativeAdaptationStageService } from './multilingual-creative-adaptation-stage.service';

describe('MultilingualCreativeAdaptationStageController', () => {
  let controller: MultilingualCreativeAdaptationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [MultilingualCreativeAdaptationStageController], providers: [MultilingualCreativeAdaptationStageService] }).compile();
    controller = module.get(MultilingualCreativeAdaptationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
