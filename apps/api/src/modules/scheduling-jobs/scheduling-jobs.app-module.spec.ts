import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  AppModule,
} from '../../app.module';
import {
  SchedulingJobsModule,
} from './scheduling-jobs.module';

describe(
  'SchedulingJobs AppModule composition',
  () => {
    it(
      'imports SchedulingJobsModule',
      () => {
        const imports =
          Reflect.getMetadata(
            MODULE_METADATA.IMPORTS,
            AppModule,
          ) as readonly unknown[];

        expect(imports).toContain(
          SchedulingJobsModule,
        );
      },
    );
  },
);