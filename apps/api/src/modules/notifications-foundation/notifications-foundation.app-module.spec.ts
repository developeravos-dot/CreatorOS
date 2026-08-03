import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  AppModule,
} from '../../app.module';
import {
  NotificationsFoundationModule,
} from './notifications-foundation.module';

describe(
  'Notifications foundation AppModule composition',
  () => {
    it(
      'imports NotificationsFoundationModule',
      () => {
        const imports =
          Reflect.getMetadata(
            MODULE_METADATA.IMPORTS,
            AppModule,
          ) as readonly unknown[];

        expect(imports).toContain(
          NotificationsFoundationModule,
        );
      },
    );
  },
);