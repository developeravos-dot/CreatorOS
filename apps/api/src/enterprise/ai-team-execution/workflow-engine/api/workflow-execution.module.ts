import { Module } from '@nestjs/common';
import {
  WorkflowExecutionEngineService,
} from '../execution-engine';
import {
  WorkflowStepOrchestratorService,
} from '../orchestrator';
import {
  WorkflowSchedulerService,
} from '../scheduler';
import {
  WorkflowExecutionController,
} from './workflow-execution.controller';

@Module({
  controllers: [
    WorkflowExecutionController,
  ],
  providers: [
    WorkflowSchedulerService,
    WorkflowStepOrchestratorService,
    WorkflowExecutionEngineService,
  ],
  exports: [
    WorkflowSchedulerService,
    WorkflowStepOrchestratorService,
    WorkflowExecutionEngineService,
  ],
})
export class WorkflowExecutionModule {}
