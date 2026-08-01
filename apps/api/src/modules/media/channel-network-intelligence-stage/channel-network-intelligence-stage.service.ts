import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class ChannelNetworkIntelligenceStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Channel Network Intelligence', 'channel-network-intelligence');
  }
}
