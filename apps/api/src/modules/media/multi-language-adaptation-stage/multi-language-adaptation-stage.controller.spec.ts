import { Test } from '@nestjs/testing';
import { MultiLanguageAdaptationStageController } from './multi-language-adaptation-stage.controller';
import { MultiLanguageAdaptationStageService } from './multi-language-adaptation-stage.service';

describe('MultiLanguageAdaptationStageController', () => {
  let controller: MultiLanguageAdaptationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MultiLanguageAdaptationStageController],
      providers: [MultiLanguageAdaptationStageService],
    }).compile();

    controller = moduleRef.get(MultiLanguageAdaptationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
