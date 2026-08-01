import { Module } from '@nestjs/common';
import { PortfolioCapitalAllocationStageController } from './portfolio-capital-allocation-stage.controller';
import { PortfolioCapitalAllocationStageService } from './portfolio-capital-allocation-stage.service';

@Module({
  controllers: [PortfolioCapitalAllocationStageController],
  providers: [PortfolioCapitalAllocationStageService],
  exports: [PortfolioCapitalAllocationStageService],
})
export class PortfolioCapitalAllocationStageModule {}
