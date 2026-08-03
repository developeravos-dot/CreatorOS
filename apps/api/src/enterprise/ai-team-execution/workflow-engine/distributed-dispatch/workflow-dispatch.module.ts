import {
  Module,
} from '@nestjs/common';
import {
  QueueInfrastructureModule,
} from '../../../../modules/queue-infrastructure';
import {
  WorkflowStepOrchestratorService,
} from '../orchestrator';
import {
  WorkflowSchedulerService,
} from '../scheduler';
import {
  WorkflowDispatchIdempotencyService,
  WorkflowQueueDispatcherService,
} from './services';

@Module({
  imports: [
    QueueInfrastructureModule,
  ],
  providers: [
    WorkflowSchedulerService,
    WorkflowStepOrchestratorService,
    WorkflowDispatchIdempotencyService,
    WorkflowQueueDispatcherService,
  ],
  exports: [
    WorkflowDispatchIdempotencyService,
    WorkflowQueueDispatcherService,
  ],
})
export class WorkflowDispatchModule {}

