import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ChannelStrategyEngineController,
} from './channel-strategy-engine.controller';

import {
  ChannelStrategyEngineService,
} from './channel-strategy-engine.service';

describe('ChannelStrategyEngineController', () => {
  let controller: ChannelStrategyEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ChannelStrategyEngineController],
        providers: [ChannelStrategyEngineService],
      }).compile();

    controller =
      module.get<ChannelStrategyEngineController>(
        ChannelStrategyEngineController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
