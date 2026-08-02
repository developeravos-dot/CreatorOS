import {
  AiStudioRuntimeModule,
} from "../ai-studio-runtime/ai-studio-runtime.module";
import {
  Module,
} from "@nestjs/common";

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

@Module({
  imports: [
    AiStudioRuntimeModule,
  ],
  controllers: [
    AiTeamExecutionController,
    RuntimeDispatcherController,
  ],
  providers: [
    AiTeamExecutionRepository,
    AiTeamExecutionService,
    ExecutionSchedulerService,
    RuntimeProviderRegistryService,
    RuntimeDispatcherService,
    AgentAssignmentService,
    RuntimeExecutionGatewayService,
  ],
  exports: [
    AiTeamExecutionService,
    ExecutionSchedulerService,
    RuntimeProviderRegistryService,
    RuntimeDispatcherService,
    AgentAssignmentService,
    RuntimeExecutionGatewayService,
  ],
})
export class AiTeamExecutionModule {}