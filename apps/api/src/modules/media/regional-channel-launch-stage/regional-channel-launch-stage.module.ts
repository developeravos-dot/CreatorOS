import { Module } from '@nestjs/common';

import {
  RegionalChannelLaunchStageController,
} from './regional-channel-launch-stage.controller';

import {
  RegionalChannelLaunchStageService,
} from './regional-channel-launch-stage.service';

@Module({
  controllers: [RegionalChannelLaunchStageController],
  providers: [RegionalChannelLaunchStageService],
  exports: [RegionalChannelLaunchStageService],
})
export class RegionalChannelLaunchStageModule {}
