import {
  Module,
} from '@nestjs/common';

import {
  SchedulingJobsController,
} from './controllers';
import {
  JobEngineService,
  JobOperationsService,
  JobQueryService,
  JobQueueFactoryService,
  JobRetryPolicyService,
  JobSchedulerService,
  JobStateMachineService,
} from './services';

@Module({
  controllers: [
    SchedulingJobsController,
  ],
  providers: [
    JobStateMachineService,
    JobEngineService,
    JobSchedulerService,
    JobRetryPolicyService,
    JobQueueFactoryService,
    JobQueryService,
    JobOperationsService,
  ],
  exports: [
    JobStateMachineService,
    JobEngineService,
    JobSchedulerService,
    JobRetryPolicyService,
    JobQueueFactoryService,
    JobQueryService,
    JobOperationsService,
  ],
})
export class SchedulingJobsModule {}