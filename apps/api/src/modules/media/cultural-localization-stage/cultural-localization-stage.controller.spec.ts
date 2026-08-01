import { Test } from '@nestjs/testing';
import { CulturalLocalizationStageController } from './cultural-localization-stage.controller';
import { CulturalLocalizationStageService } from './cultural-localization-stage.service';

describe('CulturalLocalizationStageController', () => {
  let controller: CulturalLocalizationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CulturalLocalizationStageController],
      providers: [CulturalLocalizationStageService],
    }).compile();

    controller = moduleRef.get(CulturalLocalizationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
