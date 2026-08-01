import { Module } from '@nestjs/common';

import {
  MarketSelectionStageController,
} from './market-selection-stage.controller';

import {
  MarketSelectionStageService,
} from './market-selection-stage.service';

@Module({
  controllers: [MarketSelectionStageController],
  providers: [MarketSelectionStageService],
  exports: [MarketSelectionStageService],
})
export class MarketSelectionStageModule {}
