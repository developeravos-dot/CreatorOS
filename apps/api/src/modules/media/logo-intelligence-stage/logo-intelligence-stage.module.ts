import { Module } from '@nestjs/common';
import { LogoIntelligenceStageController } from './logo-intelligence-stage.controller';
import { LogoIntelligenceStageService } from './logo-intelligence-stage.service';

@Module({
  controllers: [LogoIntelligenceStageController],
  providers: [LogoIntelligenceStageService],
  exports: [LogoIntelligenceStageService],
})
export class LogoIntelligenceStageModule {}
