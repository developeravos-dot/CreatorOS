import { Module } from '@nestjs/common';

import {
  AgentCoordinationController,
} from './agent-coordination.controller';

import {
  AgentCoordinationService,
} from './agent-coordination.service';

@Module({
  controllers: [AgentCoordinationController],
  providers: [AgentCoordinationService],
  exports: [AgentCoordinationService],
})
export class AgentCoordinationModule {}
