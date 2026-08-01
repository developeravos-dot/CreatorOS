import { Module } from '@nestjs/common';
import { AutonomousGrowthStageController } from './autonomous-growth-stage.controller';
import { AutonomousGrowthStageService } from './autonomous-growth-stage.service';

@Module({
  controllers: [AutonomousGrowthStageController],
  providers: [AutonomousGrowthStageService],
  exports: [AutonomousGrowthStageService],
})
export class AutonomousGrowthStageModule {}
