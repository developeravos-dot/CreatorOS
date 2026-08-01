import { Module } from '@nestjs/common';
import { CreativeExperimentationStageController } from './creative-experimentation-stage.controller';
import { CreativeExperimentationStageService } from './creative-experimentation-stage.service';

@Module({
  controllers: [CreativeExperimentationStageController],
  providers: [CreativeExperimentationStageService],
  exports: [CreativeExperimentationStageService],
})
export class CreativeExperimentationStageModule {}
