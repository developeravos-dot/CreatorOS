import { Module } from '@nestjs/common';

import {
  SponsorshipManagerController,
} from './sponsorship-manager.controller';

import {
  SponsorshipManagerService,
} from './sponsorship-manager.service';

@Module({
  controllers: [SponsorshipManagerController],
  providers: [SponsorshipManagerService],
  exports: [SponsorshipManagerService],
})
export class SponsorshipManagerModule {}
