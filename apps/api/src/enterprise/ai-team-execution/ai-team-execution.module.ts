import {
  Module,
} from "@nestjs/common";

import {
  AiTeamExecutionController,
} from "./ai-team-execution.controller";

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

@Module({
  controllers: [
    AiTeamExecutionController,
  ],
  providers: [
    AiTeamExecutionRepository,
    AiTeamExecutionService,
    ExecutionSchedulerService,
    RuntimeProviderRegistryService,
    RuntimeDispatcherService,
    AgentAssignmentService,
  ],
  exports: [
    AiTeamExecutionService,
    ExecutionSchedulerService,
    RuntimeProviderRegistryService,
    RuntimeDispatcherService,
    AgentAssignmentService,
  ],
})
export class AiTeamExecutionModule {}