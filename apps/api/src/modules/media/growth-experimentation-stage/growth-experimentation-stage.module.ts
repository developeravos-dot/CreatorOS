import { Module } from '@nestjs/common';
import { GrowthExperimentationStageController } from './growth-experimentation-stage.controller';
import { GrowthExperimentationStageService } from './growth-experimentation-stage.service';

@Module({
  controllers: [GrowthExperimentationStageController],
  providers: [GrowthExperimentationStageService],
  exports: [GrowthExperimentationStageService],
})
export class GrowthExperimentationStageModule {}
