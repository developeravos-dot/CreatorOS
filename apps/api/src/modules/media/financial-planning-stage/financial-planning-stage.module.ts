import { Module } from '@nestjs/common';
import { FinancialPlanningStageController } from './financial-planning-stage.controller';
import { FinancialPlanningStageService } from './financial-planning-stage.service';

@Module({
  controllers: [FinancialPlanningStageController],
  providers: [FinancialPlanningStageService],
  exports: [FinancialPlanningStageService],
})
export class FinancialPlanningStageModule {}
