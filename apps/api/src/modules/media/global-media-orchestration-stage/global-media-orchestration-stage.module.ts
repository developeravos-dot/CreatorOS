import { Module } from '@nestjs/common';
import { GlobalMediaOrchestrationStageController } from './global-media-orchestration-stage.controller';
import { GlobalMediaOrchestrationStageService } from './global-media-orchestration-stage.service';

@Module({
  controllers: [GlobalMediaOrchestrationStageController],
  providers: [GlobalMediaOrchestrationStageService],
  exports: [GlobalMediaOrchestrationStageService],
})
export class GlobalMediaOrchestrationStageModule {}
