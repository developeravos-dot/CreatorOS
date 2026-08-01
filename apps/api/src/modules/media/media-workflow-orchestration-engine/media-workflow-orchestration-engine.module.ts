import { Module } from '@nestjs/common';

import {
  MediaWorkflowOrchestrationEngineController,
} from './media-workflow-orchestration-engine.controller';

import {
  MediaWorkflowOrchestrationEngineService,
} from './media-workflow-orchestration-engine.service';

@Module({
  controllers: [MediaWorkflowOrchestrationEngineController],
  providers: [MediaWorkflowOrchestrationEngineService],
  exports: [MediaWorkflowOrchestrationEngineService],
})
export class MediaWorkflowOrchestrationEngineModule {}
