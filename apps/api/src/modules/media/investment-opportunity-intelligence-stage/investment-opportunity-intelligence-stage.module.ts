import { Module } from '@nestjs/common';
import { InvestmentOpportunityIntelligenceStageController } from './investment-opportunity-intelligence-stage.controller';
import { InvestmentOpportunityIntelligenceStageService } from './investment-opportunity-intelligence-stage.service';

@Module({
  controllers: [InvestmentOpportunityIntelligenceStageController],
  providers: [InvestmentOpportunityIntelligenceStageService],
  exports: [InvestmentOpportunityIntelligenceStageService],
})
export class InvestmentOpportunityIntelligenceStageModule {}
