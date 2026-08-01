import { Module } from '@nestjs/common';
import { ContentInvestmentEngineStageController } from './content-investment-engine-stage.controller';
import { ContentInvestmentEngineStageService } from './content-investment-engine-stage.service';

@Module({
  controllers: [ContentInvestmentEngineStageController],
  providers: [ContentInvestmentEngineStageService],
  exports: [ContentInvestmentEngineStageService],
})
export class ContentInvestmentEngineStageModule {}
