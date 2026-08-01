import { Test, TestingModule } from '@nestjs/testing';
import { ChannelNetworkIntelligenceStageController } from './channel-network-intelligence-stage.controller';
import { ChannelNetworkIntelligenceStageService } from './channel-network-intelligence-stage.service';

describe('ChannelNetworkIntelligenceStageController', () => {
  let controller: ChannelNetworkIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ChannelNetworkIntelligenceStageController], providers: [ChannelNetworkIntelligenceStageService] }).compile();
    controller = module.get(ChannelNetworkIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
