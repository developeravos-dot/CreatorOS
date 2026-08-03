import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  SchedulingJobsController,
} from './controllers';
import {
  SchedulingJobsModule,
} from './scheduling-jobs.module';
import {
  JobEngineService,
  JobOperationsService,
  JobQueryService,
  JobQueueFactoryService,
  JobRetryPolicyService,
  JobSchedulerService,
  JobStateMachineService,
} from './services';

describe(
  'SchedulingJobsModule',
  () => {
    const controllers =
      Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        SchedulingJobsModule,
      ) as readonly unknown[];

    const providers =
      Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        SchedulingJobsModule,
      ) as readonly unknown[];

    const exports =
      Reflect.getMetadata(
        MODULE_METADATA.EXPORTS,
        SchedulingJobsModule,
      ) as readonly unknown[];

    it(
      'registers the controller',
      () => {
        expect(controllers)
          .toContain(
            SchedulingJobsController,
          );
      },
    );

    it(
      'registers all scheduling services',
      () => {
        for (
          const provider of [
            JobStateMachineService,
            JobEngineService,
            JobSchedulerService,
            JobRetryPolicyService,
            JobQueueFactoryService,
            JobQueryService,
            JobOperationsService,
          ]
        ) {
          expect(providers)
            .toContain(provider);
        }
      },
    );

    it(
      'exports all scheduling services',
      () => {
        for (
          const provider of [
            JobStateMachineService,
            JobEngineService,
            JobSchedulerService,
            JobRetryPolicyService,
            JobQueueFactoryService,
            JobQueryService,
            JobOperationsService,
          ]
        ) {
          expect(exports)
            .toContain(provider);
        }
      },
    );
  },
);