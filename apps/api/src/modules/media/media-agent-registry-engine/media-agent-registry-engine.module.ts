import { Module } from '@nestjs/common';

import {
  MediaAgentRegistryEngineController,
} from './media-agent-registry-engine.controller';

import {
  MediaAgentRegistryEngineService,
} from './media-agent-registry-engine.service';

@Module({
  controllers: [MediaAgentRegistryEngineController],
  providers: [MediaAgentRegistryEngineService],
  exports: [MediaAgentRegistryEngineService],
})
export class MediaAgentRegistryEngineModule {}
