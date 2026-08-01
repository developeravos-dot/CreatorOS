import { Module } from '@nestjs/common';

import {
  PublishingAutomationController,
} from './publishing-automation.controller';

import {
  PublishingAutomationService,
} from './publishing-automation.service';

@Module({
  controllers: [PublishingAutomationController],
  providers: [PublishingAutomationService],
  exports: [PublishingAutomationService],
})
export class PublishingAutomationModule {}
