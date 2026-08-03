import {
  Module,
} from '@nestjs/common';

import {
  NotificationsController,
} from './controllers';
import {
  NotificationEngineService,
  NotificationQueryService,
} from './services';

@Module({
  controllers: [
    NotificationsController,
  ],
  providers: [
    NotificationEngineService,
    NotificationQueryService,
  ],
  exports: [
    NotificationEngineService,
    NotificationQueryService,
  ],
})
export class NotificationsFoundationModule {}