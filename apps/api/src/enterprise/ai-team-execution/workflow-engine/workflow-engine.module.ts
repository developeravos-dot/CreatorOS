import { Module } from '@nestjs/common';

import { WorkflowEngineController } from './controllers/workflow-engine.controller';
import { WorkflowDefinitionEntity } from './entities/workflow-definition.entity';
import { WorkflowStepOrchestratorService } from './orchestrator';
import {
  DEFAULT_WORKFLOW_RECOVERY_POLICY,
  WORKFLOW_RECOVERY_POLICY,
  WorkflowExecutionPersistenceEngineService,
  WorkflowPersistenceModule,
  WorkflowRecoveryEngineService,
} from './persistence';
import { WorkflowSchedulerService } from './scheduler';
import { WorkflowOrchestratorService } from './services/workflow-orchestrator.service';
import { WorkflowPlannerService } from './services/workflow-planner.service';
import { WorkflowRoutingService } from './services/workflow-routing.service';

@Module({
  imports: [WorkflowPersistenceModule],
  controllers: [WorkflowEngineController],
  providers: [
    {
      provide: WORKFLOW_RECOVERY_POLICY,
      useValue: DEFAULT_WORKFLOW_RECOVERY_POLICY,
    },
    WorkflowPlannerService,
    WorkflowRoutingService,
    WorkflowOrchestratorService,
    WorkflowSchedulerService,
    WorkflowStepOrchestratorService,
    WorkflowDefinitionEntity,
    WorkflowRecoveryEngineService,
  ],
  exports: [
    WorkflowPersistenceModule,
    WorkflowOrchestratorService,
    WorkflowSchedulerService,
    WorkflowStepOrchestratorService,
    WorkflowExecutionPersistenceEngineService,
    WorkflowRecoveryEngineService,
  ],
})
export class WorkflowEngineModule {}
