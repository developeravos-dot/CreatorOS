import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  NotificationsController,
} from './controllers';
import {
  NotificationsFoundationModule,
} from './notifications-foundation.module';
import {
  NotificationEngineService,
  NotificationQueryService,
} from './services';

describe(
  'NotificationsFoundationModule',
  () => {
    const controllers =
      Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        NotificationsFoundationModule,
      ) as readonly unknown[];

    const providers =
      Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        NotificationsFoundationModule,
      ) as readonly unknown[];

    const exports =
      Reflect.getMetadata(
        MODULE_METADATA.EXPORTS,
        NotificationsFoundationModule,
      ) as readonly unknown[];

    it(
      'registers the notifications controller',
      () => {
        expect(controllers).toContain(
          NotificationsController,
        );
      },
    );

    it(
      'registers notification services',
      () => {
        expect(providers).toContain(
          NotificationEngineService,
        );

        expect(providers).toContain(
          NotificationQueryService,
        );
      },
    );

    it(
      'exports notification services',
      () => {
        expect(exports).toContain(
          NotificationEngineService,
        );

        expect(exports).toContain(
          NotificationQueryService,
        );
      },
    );
  },
);