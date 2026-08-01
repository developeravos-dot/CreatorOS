import { Module } from '@nestjs/common';

import {
  ChannelStrategyEngineController,
} from './channel-strategy-engine.controller';

import {
  ChannelStrategyEngineService,
} from './channel-strategy-engine.service';

@Module({
  controllers: [ChannelStrategyEngineController],
  providers: [ChannelStrategyEngineService],
  exports: [ChannelStrategyEngineService],
})
export class ChannelStrategyEngineModule {}
