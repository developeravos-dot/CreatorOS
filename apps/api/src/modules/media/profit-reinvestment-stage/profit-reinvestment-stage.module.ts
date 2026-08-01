import { Module } from '@nestjs/common';
import { ProfitReinvestmentStageController } from './profit-reinvestment-stage.controller';
import { ProfitReinvestmentStageService } from './profit-reinvestment-stage.service';

@Module({
  controllers: [ProfitReinvestmentStageController],
  providers: [ProfitReinvestmentStageService],
  exports: [ProfitReinvestmentStageService],
})
export class ProfitReinvestmentStageModule {}
