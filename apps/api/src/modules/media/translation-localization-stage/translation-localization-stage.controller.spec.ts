import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  TranslationLocalizationStageController,
} from './translation-localization-stage.controller';

import {
  TranslationLocalizationStageService,
} from './translation-localization-stage.service';

describe('TranslationLocalizationStageController', () => {
  let controller: TranslationLocalizationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          TranslationLocalizationStageController,
        ],
        providers: [
          TranslationLocalizationStageService,
        ],
      }).compile();

    controller =
      module.get<TranslationLocalizationStageController>(
        TranslationLocalizationStageController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
