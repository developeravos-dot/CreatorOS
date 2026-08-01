import { Module } from '@nestjs/common';

import {
  PublishingOrchestrationEngineController,
} from './publishing-orchestration-engine.controller';

import {
  PublishingOrchestrationEngineService,
} from './publishing-orchestration-engine.service';

@Module({
  controllers: [PublishingOrchestrationEngineController],
  providers: [PublishingOrchestrationEngineService],
  exports: [PublishingOrchestrationEngineService],
})
export class PublishingOrchestrationEngineModule {}
