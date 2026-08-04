import {
  Module,
} from '@nestjs/common';

import {
  AiStudioRuntimeModule,
} from '../ai-studio-runtime/ai-studio-runtime.module';
import {
  EnterpriseControlPlaneModule,
} from '../enterprise-control-plane';
import {
  EnterpriseIntelligenceModule,
} from '../enterprise-intelligence';
import {
  AiTeamExecutionController,
} from './ai-team-execution.controller';
import {
  AiTeamExecutionRepository,
} from './ai-team-execution.repository';
import {
  AiTeamExecutionService,
} from './ai-team-execution.service';
import {
  AgentAssignmentService,
} from './agent-assignment.service';
import {
  ExecutionIntelligenceService,
} from './execution-intelligence/execution-intelligence.service';
import {
  ExecutionJobRunnerService,
} from './execution-job-runner.service';
import {
  ExecutionOrchestratorService,
} from './execution-orchestrator.service';
import {
  ExecutionSchedulerService,
} from './execution-scheduler.service';
import {
  RuntimeDispatcherController,
} from './runtime-dispatcher.controller';
import {
  RuntimeDispatcherService,
} from './runtime-dispatcher.service';
import {
  RuntimeExecutionGatewayService,
} from './runtime-execution-gateway.service';
import {
  RuntimeProviderRegistryService,
} from './runtime-provider-registry.service';
import {
  WorkflowExecutionModule,
} from './workflow-engine/api';
import {
  DistributedRuntimeModule,
} from './workflow-engine/distributed-runtime';
import {
  WorkflowEngineModule,
} from './workflow-engine/workflow-engine.module';

@Module({
  imports: [
    WorkflowExecutionModule,
    AiStudioRuntimeModule,
    WorkflowEngineModule,
    DistributedRuntimeModule,
    EnterpriseControlPlaneModule,
    EnterpriseIntelligenceModule,
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
    DistributedRuntimeModule,
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