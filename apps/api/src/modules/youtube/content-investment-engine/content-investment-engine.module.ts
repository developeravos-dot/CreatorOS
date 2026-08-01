import { Module } from '@nestjs/common';

import {
  ContentInvestmentEngineController,
} from './content-investment-engine.controller';

import {
  ContentInvestmentEngineService,
} from './content-investment-engine.service';

@Module({
  controllers: [ContentInvestmentEngineController],
  providers: [ContentInvestmentEngineService],
  exports: [ContentInvestmentEngineService],
})
export class ContentInvestmentEngineModule {}
