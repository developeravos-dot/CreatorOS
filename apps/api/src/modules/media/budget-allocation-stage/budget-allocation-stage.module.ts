import { Module } from '@nestjs/common';
import { BudgetAllocationStageController } from './budget-allocation-stage.controller';
import { BudgetAllocationStageService } from './budget-allocation-stage.service';

@Module({
  controllers: [BudgetAllocationStageController],
  providers: [BudgetAllocationStageService],
  exports: [BudgetAllocationStageService],
})
export class BudgetAllocationStageModule {}
