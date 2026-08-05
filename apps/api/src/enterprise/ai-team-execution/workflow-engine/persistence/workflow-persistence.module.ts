import { Module } from '@nestjs/common';

import { PersistenceModule } from '../../../../modules/persistence';
import {
  DEFAULT_WORKFLOW_CHECKPOINT_POLICY,
  WORKFLOW_CHECKPOINT_POLICY,
  WorkflowCheckpointEngineService,
} from './checkpoint-engine';
import {
  WorkflowCheckpointEntity,
  WorkflowEventEntity,
  WorkflowExecutionEntity,
  WorkflowRecoveryEntity,
  WorkflowStepStateEntity,
} from './entities';
import {
  WorkflowExecutionPersistenceEngineService,
} from './execution-persistence';
import {
  WorkflowCheckpointRepository,
  WorkflowEventRepository,
  WorkflowExecutionRepository,
  WorkflowRecoveryRepository,
  WorkflowStepStateRepository,
} from './repositories';

const WORKFLOW_PERSISTENCE_ENTITIES = [
  WorkflowExecutionEntity,
  WorkflowCheckpointEntity,
  WorkflowStepStateEntity,
  WorkflowEventEntity,
  WorkflowRecoveryEntity,
] as const;

const WORKFLOW_PERSISTENCE_REPOSITORIES = [
  WorkflowExecutionRepository,
  WorkflowCheckpointRepository,
  WorkflowStepStateRepository,
  WorkflowEventRepository,
  WorkflowRecoveryRepository,
] as const;

const WORKFLOW_PERSISTENCE_ENGINES = [
  WorkflowCheckpointEngineService,
  WorkflowExecutionPersistenceEngineService,
] as const;

@Module({
  imports: [PersistenceModule],
  providers: [
    {
      provide: WORKFLOW_CHECKPOINT_POLICY,
      useValue: DEFAULT_WORKFLOW_CHECKPOINT_POLICY,
    },
    ...WORKFLOW_PERSISTENCE_ENTITIES,
    ...WORKFLOW_PERSISTENCE_REPOSITORIES,
    ...WORKFLOW_PERSISTENCE_ENGINES,
  ],
  exports: [
    PersistenceModule,
    WORKFLOW_CHECKPOINT_POLICY,
    ...WORKFLOW_PERSISTENCE_ENTITIES,
    ...WORKFLOW_PERSISTENCE_REPOSITORIES,
    ...WORKFLOW_PERSISTENCE_ENGINES,
  ],
})
export class WorkflowPersistenceModule {}
