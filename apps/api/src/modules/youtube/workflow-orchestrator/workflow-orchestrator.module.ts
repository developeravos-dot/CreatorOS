import { Module } from '@nestjs/common';

import {
  WorkflowOrchestratorController,
} from './workflow-orchestrator.controller';

import {
  WorkflowOrchestratorService,
} from './workflow-orchestrator.service';

@Module({
  controllers: [WorkflowOrchestratorController],
  providers: [WorkflowOrchestratorService],
  exports: [WorkflowOrchestratorService],
})
export class WorkflowOrchestratorModule {}
