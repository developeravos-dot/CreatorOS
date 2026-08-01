import { Module } from '@nestjs/common';

import {
  MarketExpansionEngineController,
} from './market-expansion-engine.controller';

import {
  MarketExpansionEngineService,
} from './market-expansion-engine.service';

@Module({
  controllers: [MarketExpansionEngineController],
  providers: [MarketExpansionEngineService],
  exports: [MarketExpansionEngineService],
})
export class MarketExpansionEngineModule {}
