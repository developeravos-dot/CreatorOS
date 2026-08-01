import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ChannelIntelligenceController,
} from './channel-intelligence.controller';

import {
  ChannelIntelligenceService,
} from './channel-intelligence.service';

describe('ChannelIntelligenceController', () => {
  let controller: ChannelIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ChannelIntelligenceController],
        providers: [ChannelIntelligenceService],
      }).compile();

    controller =
      module.get<ChannelIntelligenceController>(
        ChannelIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
