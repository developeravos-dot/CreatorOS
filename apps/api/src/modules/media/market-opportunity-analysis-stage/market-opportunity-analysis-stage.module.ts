import { Module } from '@nestjs/common';

import {
  MarketOpportunityAnalysisStageController,
} from './market-opportunity-analysis-stage.controller';

import {
  MarketOpportunityAnalysisStageService,
} from './market-opportunity-analysis-stage.service';

@Module({
  controllers: [
    MarketOpportunityAnalysisStageController,
  ],
  providers: [
    MarketOpportunityAnalysisStageService,
  ],
  exports: [
    MarketOpportunityAnalysisStageService,
  ],
})
export class MarketOpportunityAnalysisStageModule {}
