import { Module } from '@nestjs/common';

import {
  NotificationCenterController,
} from './notification-center.controller';

import {
  NotificationCenterService,
} from './notification-center.service';

@Module({
  controllers: [NotificationCenterController],
  providers: [NotificationCenterService],
  exports: [NotificationCenterService],
})
export class NotificationCenterModule {}
