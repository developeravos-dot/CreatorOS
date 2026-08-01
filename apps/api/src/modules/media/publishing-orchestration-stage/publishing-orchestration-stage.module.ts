import { Module } from '@nestjs/common';
import { PublishingOrchestrationStageController } from './publishing-orchestration-stage.controller';
import { PublishingOrchestrationStageService } from './publishing-orchestration-stage.service';

@Module({
  controllers: [PublishingOrchestrationStageController],
  providers: [PublishingOrchestrationStageService],
  exports: [PublishingOrchestrationStageService],
})
export class PublishingOrchestrationStageModule {}
