import { Module } from "@nestjs/common";

import { WorkflowEngineController } from "./controllers/workflow-engine.controller";

import { WorkflowPlannerService } from "./services/workflow-planner.service";
import { WorkflowRoutingService } from "./services/workflow-routing.service";
import { WorkflowOrchestratorService } from "./services/workflow-orchestrator.service";

import { WorkflowDefinitionEntity } from "./entities/workflow-definition.entity";


@Module({
  controllers: [
    WorkflowEngineController,
  ],
  providers: [
    WorkflowPlannerService,
    WorkflowRoutingService,
    WorkflowOrchestratorService,
    WorkflowDefinitionEntity,
  ],
  exports: [
    WorkflowOrchestratorService,
  ],
})
export class WorkflowEngineModule {}
