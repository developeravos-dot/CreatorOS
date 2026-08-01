import { Module } from '@nestjs/common';
import { SalesFunnelIntelligenceStageController } from './sales-funnel-intelligence-stage.controller';
import { SalesFunnelIntelligenceStageService } from './sales-funnel-intelligence-stage.service';

@Module({
  controllers: [SalesFunnelIntelligenceStageController],
  providers: [SalesFunnelIntelligenceStageService],
  exports: [SalesFunnelIntelligenceStageService],
})
export class SalesFunnelIntelligenceStageModule {}
