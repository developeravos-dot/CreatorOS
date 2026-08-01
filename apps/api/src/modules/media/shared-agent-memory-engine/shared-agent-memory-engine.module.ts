import { Module } from '@nestjs/common';

import {
  SharedAgentMemoryEngineController,
} from './shared-agent-memory-engine.controller';

import {
  SharedAgentMemoryEngineService,
} from './shared-agent-memory-engine.service';

@Module({
  controllers: [SharedAgentMemoryEngineController],
  providers: [SharedAgentMemoryEngineService],
  exports: [SharedAgentMemoryEngineService],
})
export class SharedAgentMemoryEngineModule {}
