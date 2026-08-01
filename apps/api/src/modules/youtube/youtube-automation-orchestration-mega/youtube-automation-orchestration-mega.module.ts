import { Module } from '@nestjs/common';

import {
  WorkflowOrchestratorModule,
} from '../workflow-orchestrator/workflow-orchestrator.module';

import {
  PublishingAutomationModule,
} from '../publishing-automation/publishing-automation.module';

import {
  AgentCoordinationModule,
} from '../agent-coordination/agent-coordination.module';

import {
  QualityControlEngineModule,
} from '../quality-control-engine/quality-control-engine.module';

import {
  OperationsCommandCenterModule,
} from '../operations-command-center/operations-command-center.module';

@Module({
  imports: [
    WorkflowOrchestratorModule,
    PublishingAutomationModule,
    AgentCoordinationModule,
    QualityControlEngineModule,
    OperationsCommandCenterModule,
  ],
  exports: [
    WorkflowOrchestratorModule,
    PublishingAutomationModule,
    AgentCoordinationModule,
    QualityControlEngineModule,
    OperationsCommandCenterModule,
  ],
})
export class YoutubeAutomationOrchestrationMegaModule {}
