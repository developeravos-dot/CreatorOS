import { Module } from '@nestjs/common';
import { PortfolioOptimizationStageController } from './portfolio-optimization-stage.controller';
import { PortfolioOptimizationStageService } from './portfolio-optimization-stage.service';

@Module({
  controllers: [PortfolioOptimizationStageController],
  providers: [PortfolioOptimizationStageService],
  exports: [PortfolioOptimizationStageService],
})
export class PortfolioOptimizationStageModule {}
