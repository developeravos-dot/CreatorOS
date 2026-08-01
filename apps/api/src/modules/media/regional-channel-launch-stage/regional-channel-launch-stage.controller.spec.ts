import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RegionalChannelLaunchStageController,
} from './regional-channel-launch-stage.controller';

import {
  RegionalChannelLaunchStageService,
} from './regional-channel-launch-stage.service';

describe('RegionalChannelLaunchStageController', () => {
  let controller: RegionalChannelLaunchStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          RegionalChannelLaunchStageController,
        ],
        providers: [
          RegionalChannelLaunchStageService,
        ],
      }).compile();

    controller =
      module.get<RegionalChannelLaunchStageController>(
        RegionalChannelLaunchStageController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
