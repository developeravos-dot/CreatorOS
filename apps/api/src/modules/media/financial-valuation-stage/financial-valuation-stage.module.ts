import { Module } from '@nestjs/common';

import {
  FinancialValuationStageController,
} from './financial-valuation-stage.controller';

import {
  FinancialValuationStageService,
} from './financial-valuation-stage.service';

@Module({
  controllers: [
    FinancialValuationStageController,
  ],
  providers: [
    FinancialValuationStageService,
  ],
  exports: [
    FinancialValuationStageService,
  ],
})
export class FinancialValuationStageModule {}
