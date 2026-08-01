import { Module } from '@nestjs/common';

import {
  TranslationLocalizationStageController,
} from './translation-localization-stage.controller';

import {
  TranslationLocalizationStageService,
} from './translation-localization-stage.service';

@Module({
  controllers: [TranslationLocalizationStageController],
  providers: [TranslationLocalizationStageService],
  exports: [TranslationLocalizationStageService],
})
export class TranslationLocalizationStageModule {}
