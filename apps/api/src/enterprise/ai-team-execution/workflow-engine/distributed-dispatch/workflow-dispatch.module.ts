import {
  Module,
} from '@nestjs/common';

import {
  QueueInfrastructureModule,
} from '../../../../modules/queue-infrastructure';
import {
  DistributedRuntimeModule,
} from '../distributed-runtime';
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
  WorkflowExecutionConsumer,
  WorkflowRetryConsumer,
  WorkflowStepConsumer,
} from './consumers';
import {
  DistributedWorkerHeartbeatService,
  DistributedWorkerLeaseService,
} from './runtime';
import {
  DistributedWorkerCoordinatorService,
  WorkflowDispatchIdempotencyService,
  WorkflowQueueDispatcherService,
} from './services';

@Module({
  imports: [
    QueueInfrastructureModule,
    DistributedRuntimeModule,
  ],
  providers: [
    WorkflowSchedulerService,
    WorkflowStepOrchestratorService,
    WorkflowExecutionEngineService,
    WorkflowDispatchIdempotencyService,
    WorkflowQueueDispatcherService,
    WorkflowExecutionConsumer,
    WorkflowStepConsumer,
    WorkflowRetryConsumer,
    DistributedWorkerLeaseService,
    DistributedWorkerHeartbeatService,
    DistributedWorkerCoordinatorService,
  ],
  exports: [
    DistributedRuntimeModule,
    WorkflowDispatchIdempotencyService,
    WorkflowQueueDispatcherService,
    WorkflowExecutionConsumer,
    WorkflowStepConsumer,
    WorkflowRetryConsumer,
    DistributedWorkerLeaseService,
    DistributedWorkerHeartbeatService,
    DistributedWorkerCoordinatorService,
  ],
})
export class WorkflowDispatchModule {}