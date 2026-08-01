import { Module } from '@nestjs/common';

import {
  LocalizationGlobalDistributionController,
} from './localization-global-distribution.controller';

import {
  LocalizationGlobalDistributionService,
} from './localization-global-distribution.service';

@Module({
  controllers: [LocalizationGlobalDistributionController],
  providers: [LocalizationGlobalDistributionService],
  exports: [LocalizationGlobalDistributionService],
})
export class LocalizationGlobalDistributionModule {}
