import { Module } from '@nestjs/common';
import { ChannelNetworkIntelligenceStageController } from './channel-network-intelligence-stage.controller';
import { ChannelNetworkIntelligenceStageService } from './channel-network-intelligence-stage.service';

@Module({
  controllers: [ChannelNetworkIntelligenceStageController],
  providers: [ChannelNetworkIntelligenceStageService],
  exports: [ChannelNetworkIntelligenceStageService],
})
export class ChannelNetworkIntelligenceStageModule {}
