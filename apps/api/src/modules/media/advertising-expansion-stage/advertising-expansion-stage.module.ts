import { Module } from '@nestjs/common';

import {
  AdvertisingExpansionStageController,
} from './advertising-expansion-stage.controller';

import {
  AdvertisingExpansionStageService,
} from './advertising-expansion-stage.service';

@Module({
  controllers: [AdvertisingExpansionStageController],
  providers: [AdvertisingExpansionStageService],
  exports: [AdvertisingExpansionStageService],
})
export class AdvertisingExpansionStageModule {}
