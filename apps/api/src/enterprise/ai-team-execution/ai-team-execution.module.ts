import { ExecutionIntelligenceService } from "./execution-intelligence/execution-intelligence.service";
import {
  AiStudioRuntimeModule,
} from "../ai-studio-runtime/ai-studio-runtime.module";
import {
  Module,
} from "@nestjs/common";

import { WorkflowEngineModule } from "./workflow-engine/workflow-engine.module";

import { WorkflowExecutionModule } from './workflow-engine/api';
import {
  AiTeamExecutionController,
} from "./ai-team-execution.controller";
import {
  RuntimeDispatcherController,
} from "./runtime-dispatcher.controller";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

import {
  AiTeamExecutionService,
} from "./ai-team-execution.service";

import {
  ExecutionSchedulerService,
} from "./execution-scheduler.service";

import {
  RuntimeDispatcherService,
} from "./runtime-dispatcher.service";

import {
  RuntimeProviderRegistryService,
} from "./runtime-provider-registry.service";

import {
  AgentAssignmentService,
} from "./agent-assignment.service";
import {
  RuntimeExecutionGatewayService,
} from "./runtime-execution-gateway.service";
import {
  ExecutionOrchestratorService,
} from "./execution-orchestrator.service";
import {
  ExecutionJobRunnerService,
} from "./execution-job-runner.service";

@Module({
  imports: [
    WorkflowExecutionModule,
    AiStudioRuntimeModule,
    WorkflowEngineModule,
  ],
  controllers: [
    AiTeamExecutionController,
    RuntimeDispatcherController,
  ],
  providers: [
    ExecutionIntelligenceService,
    AiTeamExecutionRepository,
    AiTeamExecutionService,
    ExecutionSchedulerService,
    RuntimeProviderRegistryService,
    RuntimeDispatcherService,
    AgentAssignmentService,
    RuntimeExecutionGatewayService,
    ExecutionOrchestratorService,
    ExecutionJobRunnerService,
  ],
  exports: [
    AiTeamExecutionService,
    ExecutionSchedulerService,
    RuntimeProviderRegistryService,
    RuntimeDispatcherService,
    AgentAssignmentService,
    RuntimeExecutionGatewayService,
    ExecutionOrchestratorService,
    ExecutionJobRunnerService,
  ],
})
export class AiTeamExecutionModule {}



