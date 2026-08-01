import { Module } from '@nestjs/common';
import { ShotPlanningStageController } from './shot-planning-stage.controller';
import { ShotPlanningStageService } from './shot-planning-stage.service';

@Module({
  controllers: [ShotPlanningStageController],
  providers: [ShotPlanningStageService],
  exports: [ShotPlanningStageService],
})
export class ShotPlanningStageModule {}
